document.addEventListener('DOMContentLoaded', () => {
  // Variável global para guardar todos os pets carregados
  let todosOsPets = [];

  // ==========================================
  // 1. ACESSIBILIDADE (Botão flutuante)
  // ==========================================
  const btnAcess = document.getElementById('btn-acessibilidade');
  const menuAcess = document.getElementById('menu-acessibilidade');

  if (btnAcess && menuAcess) {
    // Abre e fecha o menu
    btnAcess.addEventListener('click', () => {
      menuAcess.classList.toggle('aberto');
    });

    // Fecha se clicar fora
    document.addEventListener('click', (e) => {
      if (!btnAcess.contains(e.target) && !menuAcess.contains(e.target)) {
        menuAcess.classList.remove('aberto');
      }
    });

    // Ações dos botões
    menuAcess.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const value = btn.dataset.value;

        if (action === 'text-size') {
          if (value === 'larger') {
            document.documentElement.classList.remove('a11y-small-text');
            document.documentElement.classList.toggle('a11y-large-text');
          } else {
            document.documentElement.classList.remove('a11y-large-text');
            document.documentElement.classList.toggle('a11y-small-text');
          }
        } else if (action === 'contrast') {
          const enabled = document.documentElement.classList.toggle('a11y-high-contrast');
          btn.setAttribute('aria-pressed', String(enabled));
        }
      });
    });
  }

  // ==========================================
  // 2. RENDERIZAR OS CARDS DOS PETS
  // ==========================================
  function renderizarPets(pets) {
    const lista = document.getElementById('results');
    const contador = document.getElementById('result-count');
    
    if (!lista) return;
    lista.innerHTML = '';

    if (pets.length === 0) {
      lista.innerHTML = '<div class="empty"><h2>Nenhum alerta encontrado</h2><p>Tente mudar os filtros ou buscar por outro termo.</p></div>';
      if(contador) contador.textContent = '0 alertas encontrados';
      return;
    }

    if(contador) contador.textContent = `${pets.length} alertas encontrados`;

    pets.forEach(pet => {
      const emoji = pet.especie === 'gato' ? '🐈' : (pet.especie === 'cão' ? '🐶' : '🐾');
      const fotoHtml = pet.foto_url 
        ? `<img src="${pet.foto_url}" alt="${pet.nome}" style="width:100%; height:100%; object-fit:cover;">` 
        : emoji;

      const recompensa = pet.recompensa > 0 ? `R$ ${Number(pet.recompensa).toFixed(2).replace('.', ',')}` : 'Sem recompensa';
      const tagClass = pet.status === 'encontrado' ? 'tag found' : 'tag';
      const tagText = pet.status === 'encontrado' ? 'Pet encontrado' : 'Pet perdido';

      const card = document.createElement('article');
      card.className = 'pet';
      
      // Dados invisíveis para o filtro
      card.dataset.nome = pet.nome.toLowerCase();
      card.dataset.raca = (pet.raca || '').toLowerCase();
      card.dataset.especie = pet.especie;
      card.dataset.status = pet.status;
      card.dataset.regiao = pet.regiao;

      card.innerHTML = `
        <div class="photo">${fotoHtml}</div>
        <div class="pet-body">
          <div class="card-tags">
            <span class="${tagClass}">${tagText}</span>
          </div>
          <h3>${pet.nome}</h3>
          <p class="pet-description">${pet.raca || pet.especie} ${pet.idade ? '· ' + pet.idade + ' anos' : ''}</p>
          <p class="pet-location">
            <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></svg> 
            ${pet.regiao || 'Não informado'}
            <span>Campo Grande - MS</span>
          </p>
          <div class="card-bottom">
            <span>Hoje</span>
            <strong>${recompensa}</strong>
          </div>
          <div class="card-footer">
            <span>Alerta da comunidade</span>
            <b>Ver alerta <span aria-hidden="true">↗</span></b>
          </div>
        </div>
        <a class="card-link" href="detalhe.html?id=${pet.id}" aria-label="Ver detalhes de ${pet.nome}"></a>
      `;
      
      lista.appendChild(card);
    });
  }

  // ==========================================
  // 3. LÓGICA DOS FILTROS
  // ==========================================
  function aplicarFiltros() {
    const busca = document.getElementById('search-input')?.value.toLowerCase() || '';
    const tipo = document.getElementById('filter-type')?.value || 'todos';
    const regiao = document.getElementById('filter-region')?.value || 'todos';
    const especieAtiva = document.querySelector('[data-especie].on')?.dataset.especie || 'todos';

    const filtrados = todosOsPets.filter(pet => {
      const textoMatch = 
        pet.nome.toLowerCase().includes(busca) || 
        (pet.raca || '').toLowerCase().includes(busca) || 
        'campo grande'.includes(busca);
      
      const tipoMatch = tipo === 'todos' || pet.status === tipo;
      const regiaoMatch = regiao === 'todos' || pet.regiao === regiao;
      
      // Ajuste para garantir que 'cão' e 'cao' funcionem (removendo acentos)
      const especiePet = pet.especie.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const especieFiltro = especieAtiva.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const especieMatch = especieAtiva === 'todos' || especiePet === especieFiltro;

      return textoMatch && tipoMatch && regiaoMatch && especieMatch;
    });

    renderizarPets(filtrados);
  }

  // ==========================================
  // 4. BUSCAR DADOS NO BANCO
  // ==========================================
  async function carregarPets() {
    try {
      const response = await fetch('/api/pets');
      todosOsPets = await response.json();
      renderizarPets(todosOsPets); 
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    }
  }

  // ==========================================
  // 5. EVENTOS
  // ==========================================
  document.getElementById('search-input')?.addEventListener('input', aplicarFiltros);
  document.getElementById('filter-type')?.addEventListener('change', aplicarFiltros);
  document.getElementById('filter-region')?.addEventListener('change', aplicarFiltros);

  document.querySelectorAll('[data-especie]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-especie]').forEach(b => b.classList.remove('on'));
      e.target.classList.add('on');
      aplicarFiltros();
    });
  });

  // Inicia a busca
  carregarPets();
});