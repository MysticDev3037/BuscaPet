// global.js - Menu inferior, botões flutuantes e acessibilidade

document.addEventListener('DOMContentLoaded', () => {
  // 1. Remove qualquer menu antigo que tenha ficado no HTML para não duplicar
  const menusAntigos = document.querySelectorAll('.main-nav, .nav');
  menusAntigos.forEach(menu => menu.remove());

  // 2. Cria o container global se não existir
  let globalUi = document.getElementById('global-ui');
  if (!globalUi) {
    globalUi = document.createElement('div');
    globalUi.id = 'global-ui';
    document.body.appendChild(globalUi);
  }

  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

  // 3. Monta o HTML do Menu Inferior e dos Botões Flutuantes
  globalUi.innerHTML = `
    <nav class="bottom-nav" aria-label="Navegação principal" style="position: fixed; bottom: 0; left: 0; right: 0; background: white; display: flex; justify-content: space-around; padding: 10px 0; border-top: 1px solid var(--line); z-index: 1000; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);">
      <a href="index.html" class="${paginaAtual === 'index.html' ? 'active' : ''}" style="display: flex; flex-direction: column; align-items: center; font-size: 10px; color: ${paginaAtual === 'index.html' ? 'var(--p)' : '#716586'}; text-decoration: none; font-weight: bold;">
        <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22"><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></svg>
        Início
      </a>
      <a href="mapa.html" class="${paginaAtual === 'mapa.html' ? 'active' : ''}" style="display: flex; flex-direction: column; align-items: center; font-size: 10px; color: ${paginaAtual === 'mapa.html' ? 'var(--p)' : '#716586'}; text-decoration: none; font-weight: bold;">
        <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z"/><path d="M9 3v16M15 5v16"/></svg>
        Mapa
      </a>
      <a href="cadastro.html" class="post-link ${paginaAtual === 'cadastro.html' ? 'active' : ''}" style="display: flex; flex-direction: column; align-items: center; font-size: 10px; color: white; text-decoration: none; font-weight: bold; background: var(--p); width: 55px; height: 55px; border-radius: 50%; margin-top: -25px; justify-content: center; box-shadow: 0 5px 15px rgba(109,40,232,0.3);">
        <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="26" height="26" style="margin-top: 5px;"><path d="M12 5v14M5 12h14"/></svg>
      </a>
      <a href="favoritos.html" class="${paginaAtual === 'favoritos.html' ? 'active' : ''}" style="display: flex; flex-direction: column; align-items: center; font-size: 10px; color: ${paginaAtual === 'favoritos.html' ? 'var(--p)' : '#716586'}; text-decoration: none; font-weight: bold;">
        <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></svg>
        Favoritos
      </a>
      <a href="minha-area.html" class="${paginaAtual === 'minha-area.html' ? 'active' : ''}" style="display: flex; flex-direction: column; align-items: center; font-size: 10px; color: ${paginaAtual === 'minha-area.html' ? 'var(--p)' : '#716586'}; text-decoration: none; font-weight: bold;">
        <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></svg>
        Minha área
      </a>
    </nav>

    <!-- Botão de Acessibilidade -->
    <button class="btn-acessibilidade" id="btn-acessibilidade" aria-label="Abrir menu de acessibilidade" style="position: fixed; bottom: 90px; right: 20px; width: 55px; height: 55px; border-radius: 50%; background: var(--p); color: white; border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999;">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
    </button>
    <div class="menu-acessibilidade" id="menu-acessibilidade" style="position: fixed; bottom: 155px; right: 20px; background: white; border: 1px solid var(--line); border-radius: 16px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: none; flex-direction: column; gap: 8px; z-index: 9999; width: 200px;">
      <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #666; text-align: center;">Acessibilidade</h4>
      <button type="button" data-action="text-size" data-value="smaller" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">A− Diminuir texto</button>
      <button type="button" data-action="text-size" data-value="larger" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">A+ Aumentar texto</button>
      <button type="button" data-action="contrast" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">◐ Alto contraste</button>
    </div>
  `;

  // 4. Lógica de Acessibilidade
  const btnAcess = document.getElementById('btn-acessibilidade');
  const menuAcess = document.getElementById('menu-acessibilidade');
  
  if (btnAcess && menuAcess) {
    btnAcess.addEventListener('click', () => menuAcess.style.display = menuAcess.style.display === 'flex' ? 'none' : 'flex');
    
    document.addEventListener('click', (e) => {
      if (!btnAcess.contains(e.target) && !menuAcess.contains(e.target)) {
        menuAcess.style.display = 'none';
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