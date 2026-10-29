// global.js - Menu no topo, botões flutuantes e acessibilidade

document.addEventListener('DOMContentLoaded', () => {
  // 1. Encontra o cabeçalho da página
  const header = document.querySelector('.app-header');
  if (!header) return;

  // 2. Remove qualquer menu antigo que tenha ficado no HTML para não duplicar
  const menusAntigos = document.querySelectorAll('.main-nav');
  menusAntigos.forEach(menu => menu.remove());

  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

  // 3. Monta o HTML do Menu (para ir dentro do header)
  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  nav.setAttribute('aria-label', 'Navegação principal');
  nav.innerHTML = `
    <a href="index.html" class="${paginaAtual === 'index.html' ? 'active' : ''}">Início</a>
    <a href="mapa.html" class="${paginaAtual === 'mapa.html' ? 'active' : ''}">Mapa</a>
    <a href="cadastro.html" class="post-link ${paginaAtual === 'cadastro.html' ? 'active' : ''}">+ Publicar</a>
    <a href="favoritos.html" class="${paginaAtual === 'favoritos.html' ? 'active' : ''}">Favoritos</a>
    <a href="minha-area.html" class="${paginaAtual === 'minha-area.html' ? 'active' : ''}">Minha área</a>
  `;

  // 4. Insere o menu no cabeçalho (antes dos links da direita, se houver)
  const headerLinks = header.querySelector('.header-links');
  if (headerLinks) {
    header.insertBefore(nav, headerLinks);
  } else {
    header.appendChild(nav);
  }

  // 5. Cria os botões flutuantes (Favoritos e Acessibilidade) no final do body
  let globalUi = document.getElementById('global-ui');
  if (!globalUi) {
    globalUi = document.createElement('div');
    globalUi.id = 'global-ui';
    document.body.appendChild(globalUi);
  }

  globalUi.innerHTML = `
    <!-- Botão Flutuante: Favoritos -->
    <a href="favoritos.html" class="float-btn btn-favoritos-float" title="Meus Favoritos" style="position: fixed; bottom: 100px; right: 30px; width: 55px; height: 55px; border-radius: 50%; background: #e11d48; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999; text-decoration: none;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></svg>
    </a>

    <!-- Botão Flutuante: Acessibilidade -->
    <button class="btn-acessibilidade" id="btn-acessibilidade" aria-label="Abrir menu de acessibilidade" style="position: fixed; bottom: 30px; right: 30px; width: 55px; height: 55px; border-radius: 50%; background: var(--p); color: white; border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999;">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
    </button>
    
    <!-- Menu de Acessibilidade -->
    <div class="menu-acessibilidade" id="menu-acessibilidade" style="position: fixed; bottom: 95px; right: 30px; background: white; border: 1px solid var(--line); border-radius: 16px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: none; flex-direction: column; gap: 8px; z-index: 9999; width: 200px;">
      <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #666; text-align: center;">Acessibilidade</h4>
      <button type="button" data-action="text-size" data-value="smaller" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">A− Diminuir texto</button>
      <button type="button" data-action="text-size" data-value="larger" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">A+ Aumentar texto</button>
      <button type="button" data-action="contrast" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">◐ Alto contraste</button>
    </div>
  `;

  // 6. Lógica de Acessibilidade
  const btnAcess = document.getElementById('btn-acessibilidade');
  const menuAcess = document.getElementById('menu-acessibilidade');
  
  if (btnAcess && menuAcess) {
    btnAcess.addEventListener('click', () => menuAcess.classList.toggle('aberto'));
    
    document.addEventListener('click', (e) => {
      if (!btnAcess.contains(e.target) && !menuAcess.contains(e.target)) {
        menuAcess.classList.remove('aberto');
      }
    });

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
});