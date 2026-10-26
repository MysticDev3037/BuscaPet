console.log("DATABASE_URL configurada?", !!process.env.DATABASE_URL);
const express = require('express');
const path = require('path');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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
    const result = await pool.query(
      `INSERT INTO pets (nome, especie, raca, idade, cidade, regiao, bairro, recompensa, descricao, status, usuario_id, foto_url, contato)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [nome, especie, raca, idade, cidade, regiao, bairro, recompensa, descricao, status, usuario_id, foto_url, contato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO CADASTRAR PET:", err);
    res.status(500).json({ erro: 'Erro ao cadastrar pet' });
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
    
    const result = await pool.query(
      `INSERT INTO usuarios 
       (nome, email, senha, cpf, data_nascimento, telefone, foto_perfil, cep, rua, numero, complemento, bairro, cidade, estado) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) 
       RETURNING id, nome, email, foto_perfil`,
      [nome, email, senha, cpf, data_nascimento, telefone, foto_perfil, cep, rua, numero, complemento, bairro, cidade, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERRO NO CADASTRO:", err); // <-- ISSO VAI MOSTRAR O ERRO
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

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await pool.query(
      'SELECT id, nome, email, telefone, foto_perfil FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
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

// ================= INICIAR =================
app.listen(port, () => {
  console.log(`Servidor BuscaPet rodando em http://localhost:${port}`);
});