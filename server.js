const express = require('express');
const path = require('path');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ================= VALIDAÇÕES =================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarSenha(senha) {
  if (typeof senha !== 'string') return { ok: false, erro: 'Senha inválida.' };
  const regras = [
    senha.length >= 8,
    /[A-Z]/.test(senha),
    /[a-z]/.test(senha),
    /\d/.test(senha),
    /[@$!%*?&]/.test(senha),
  ];
  const cumpridas = regras.filter(Boolean).length;
  if (cumpridas < 4) {
    return {
      ok: false,
      erro: 'Senha fraca. Use 8+ caracteres e cumpra pelo menos 4 regras: maiúscula, minúscula, número e símbolo.',
    };
  }
  return { ok: true };
}

function validarTelefone(telefone) {
  if (typeof telefone !== 'string') return false;
  const digits = telefone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

function validarNomePet(nome) {
  if (typeof nome !== 'string') return false;
  const limpo = nome.trim();
  if (limpo.length < 2 || limpo.length > 40) return false;
  if (/\d/.test(limpo)) return false;
  return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]*$/.test(limpo);
}

function validarEmail(email) {
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 254;
}

// ================= PETS =================
app.get('/api/pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("ERRO AO BUSCAR PETS:", err);
    res.status(500).json({ erro: 'Erro ao buscar pets' });
  }
});

app.get('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.nome AS tutor_nome, u.telefone AS tutor_telefone 
       FROM pets p LEFT JOIN usuarios u ON p.usuario_id = u.id WHERE p.id = $1`, 
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Pet não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO BUSCAR PET:", err);
    res.status(500).json({ erro: 'Erro ao buscar pet' });
  }
});

app.post('/api/pets', async (req, res) => {
  try {
    const { nome, especie, raca, idade, cidade, regiao, bairro, recompensa, descricao, status, usuario_id, foto_url, contato } = req.body;

    // Validação no back
    if (!validarNomePet(nome)) {
      return res.status(400).json({ erro: 'Nome do pet inválido. Use apenas letras, mínimo 2 e máximo 40 caracteres.' });
    }
    if (!['cão', 'gato', 'outro'].includes(especie)) {
      return res.status(400).json({ erro: 'Espécie inválida.' });
    }
    if (!['perdido', 'encontrado'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido.' });
    }
    if (!descricao || String(descricao).trim().length < 10) {
      return res.status(400).json({ erro: 'A descrição deve ter pelo menos 10 caracteres.' });
    }
    if (contato && !validarTelefone(contato)) {
      return res.status(400).json({ erro: 'Telefone de contato inválido.' });
    }
    if (!usuario_id) {
      return res.status(400).json({ erro: 'Usuário não identificado. Faça login de novo.' });
    }

    // Converte campos numéricos vazios
    const idadeNumerica = idade === '' || idade === null || idade === undefined
      ? null
      : parseInt(idade, 10);
    const recompensaNumerica = recompensa === '' || recompensa === null || recompensa === undefined
      ? 0
      : parseFloat(recompensa);

    // Confere se o usuário existe (evita erro de foreign key)
    const userCheck = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ erro: 'Sua sessão expirou. Faça login de novo.' });
    }

    const result = await pool.query(
      `INSERT INTO pets (nome, especie, raca, idade, cidade, regiao, bairro, recompensa, descricao, status, usuario_id, foto_url, contato)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [nome.trim(), especie, raca, idadeNumerica, cidade, regiao, bairro, recompensaNumerica, descricao, status, usuario_id, foto_url, contato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO CADASTRAR PET:", err);
    res.status(500).json({ erro: 'Erro ao cadastrar pet. Tente novamente.' });
  }
});

app.delete('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pets WHERE id = $1', [id]);
    res.json({ mensagem: 'Pet excluído com sucesso' });
  } catch (err) {
    console.error("ERRO AO EXCLUIR PET:", err);
    res.status(500).json({ erro: 'Erro ao excluir pet' });
  }
});

// ================= USUÁRIOS =================
app.post('/api/cadastro', async (req, res) => {
  try {
    const { 
      nome, email, senha, cpf, data_nascimento, telefone, foto_perfil,
      cep, rua, numero, complemento, bairro, cidade, estado 
    } = req.body;

    // Validação no back
    if (!nome || String(nome).trim().split(' ').length < 2) {
      return res.status(400).json({ erro: 'Informe seu nome completo (nome e sobrenome).' });
    }
    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }
    if (!validarSenha(senha).ok) {
      return res.status(400).json({ erro: validarSenha(senha).erro });
    }
    if (!validarTelefone(telefone)) {
      return res.status(400).json({ erro: 'Telefone inválido. Use DDD + número.' });
    }
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf || '')) {
      return res.status(400).json({ erro: 'CPF inválido. Use o formato 000.000.000-00.' });
    }
    if (!/^\d{5}-?\d{3}$/.test(cep || '')) {
      return res.status(400).json({ erro: 'CEP inválido.' });
    }
    if (!rua || !numero || !bairro || !cidade || !estado || String(estado).length !== 2) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios do endereço.' });
    }

    const result = await pool.query(
      `INSERT INTO usuarios 
       (nome, email, senha, cpf, data_nascimento, telefone, foto_perfil, cep, rua, numero, complemento, bairro, cidade, estado) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) 
       RETURNING id, nome, email, foto_perfil`,
      [nome, email.toLowerCase(), senha, cpf, data_nascimento, telefone, foto_perfil, cep, rua, numero, complemento, bairro, cidade, String(estado).toUpperCase()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERRO NO CADASTRO:", err);
    if (err.code === '23505') {
      if (err.detail.includes('cpf')) {
        return res.status(400).json({ erro: 'Este CPF já está cadastrado no sistema.' });
      }
      if (err.detail.includes('email')) {
        return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
      }
      return res.status(400).json({ erro: 'Dados duplicados. Verifique e tente novamente.' });
    }
    res.status(500).json({ erro: 'Erro interno ao cadastrar.' });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, nome, email, telefone, foto_perfil FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO BUSCAR USUÁRIO:", err);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!validarEmail(email) || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha válidos.' });
    }
    const result = await pool.query(
      'SELECT id, nome, email, telefone, foto_perfil FROM usuarios WHERE email = $1 AND senha = $2',
      [email.toLowerCase(), senha]
    );
    if (result.rows.length === 0) return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERRO NO LOGIN:", err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, foto_perfil } = req.body;
    if (!nome || String(nome).trim().split(' ').length < 2) {
      return res.status(400).json({ erro: 'Informe nome completo.' });
    }
    if (telefone && !validarTelefone(telefone)) {
      return res.status(400).json({ erro: 'Telefone inválido.' });
    }
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, telefone = $2, foto_perfil = $3 WHERE id = $4 RETURNING id, nome, email, telefone, foto_perfil',
      [nome, telefone, foto_perfil, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO ATUALIZAR USUÁRIO:", err);
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json({ mensagem: 'Conta e anúncios desativados com sucesso.' });
  } catch (err) {
    console.error("ERRO AO DELETAR USUÁRIO:", err);
    res.status(500).json({ erro: 'Erro ao desativar conta.' });
  }
});

// ================= FAVORITOS =================
app.get('/api/favoritos/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query('SELECT pet_id FROM favoritos WHERE usuario_id = $1', [usuario_id]);
    res.json(result.rows.map(r => r.pet_id));
  } catch (err) {
    console.error("ERRO AO BUSCAR FAVORITOS:", err);
    res.status(500).json({ erro: 'Erro ao buscar favoritos' });
  }
});

app.post('/api/favoritos', async (req, res) => {
  try {
    const { usuario_id, pet_id } = req.body;
    if (!usuario_id || !pet_id) {
      return res.status(400).json({ erro: 'Dados incompletos.' });
    }
    const existe = await pool.query('SELECT id FROM favoritos WHERE usuario_id = $1 AND pet_id = $2', [usuario_id, pet_id]);
    if (existe.rows.length > 0) {
      await pool.query('DELETE FROM favoritos WHERE usuario_id = $1 AND pet_id = $2', [usuario_id, pet_id]);
      return res.json({ acao: 'removido' });
    } else {
      await pool.query('INSERT INTO favoritos (usuario_id, pet_id) VALUES ($1, $2)', [usuario_id, pet_id]);
      return res.json({ acao: 'adicionado' });
    }
  } catch (err) {
    console.error("ERRO AO FAVORITAR:", err);
    res.status(500).json({ erro: 'Erro ao favoritar' });
  }
});

// ================= DENÚNCIAS =================
app.post('/api/denuncias', async (req, res) => {
  try {
    const { pet_id, usuario_id, motivo, descricao } = req.body;
    if (!pet_id || !usuario_id || !motivo) {
      return res.status(400).json({ erro: 'Dados incompletos para a denúncia.' });
    }
    const result = await pool.query(
      `INSERT INTO denuncias (pet_id, usuario_id, motivo, descricao)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [pet_id, usuario_id, motivo, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO DENUNCIAR:", err);
    res.status(500).json({ erro: 'Erro ao registrar denúncia.' });
  }
});

// ================= INICIAR =================
app.listen(port, () => {
  console.log(`Servidor BuscaPet rodando em http://localhost:${port}`);
});