document.addEventListener('DOMContentLoaded', () => {
  // Variável global para guardar todos os pets carregados
  let todosOsPets = [];

  // ==========================================
  // 1. RENDERIZAR OS CARDS DOS PETS
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
      // Se o pet tem foto no banco, usa ela. Senão, usa o emoji.
      const fotoHtml = pet.foto_url 
        ? `<img src="${pet.foto_url}" alt="${pet.nome}" style="width:100%; height:100%; object-fit:cover;">` 
        : (pet.especie === 'gato' ? '🐈' : (pet.especie === 'cão' ? '🐶' : '🐾'));

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
  // 2. LÓGICA DOS FILTROS
  // ==========================================
  function aplicarFiltros() {
    const busca = document.getElementById('search-input')?.value.toLowerCase() || '';
    const tipo = document.getElementById('filter-type')?.value || 'todos';
    const regiao = document.getElementById('filter-region')?.value || 'todos';
    const especieAtiva = document.querySelector('[data-especie].on')?.dataset.especie || 'todos';

    const filtrados = todosOsPets.filter(pet => {
      // Filtro de texto (nome, raça, cidade)
      const textoMatch = 
        pet.nome.toLowerCase().includes(busca) || 
        (pet.raca || '').toLowerCase().includes(busca) || 
        (pet.cidade || '').toLowerCase().includes(busca);
      
      // Filtro de tipo (perdido/encontrado)
      const tipoMatch = tipo === 'todos' || pet.status === tipo;
      
      // Filtro de região
      const regiaoMatch = regiao === 'todos' || pet.regiao === regiao;
      
      // Filtro de espécie (removendo acentos)
      const especiePet = pet.especie.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const especieFiltro = especieAtiva.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const especieMatch = especieAtiva === 'todos' || especiePet === especieFiltro;

      return textoMatch && tipoMatch && regiaoMatch && especieMatch;
    });

    renderizarPets(filtrados);
  }

  // ==========================================
  // 3. BUSCAR DADOS NO BANCO
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
  // 4. EVENTOS
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