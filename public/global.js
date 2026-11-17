// global.js - Menu no topo, botões flutuantes e acessibilidade (padrão antigo + ações novas)

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.app-header');
  if (!header) return;

  // Remove menus antigos para não duplicar
  document.querySelectorAll('.main-nav').forEach(menu => menu.remove());

  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

  // 1. Monta o menu no cabeçalho (padrão antigo)
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

  const headerLinks = header.querySelector('.header-links');
  if (headerLinks) header.insertBefore(nav, headerLinks);
  else header.appendChild(nav);

  // 2. Botões flutuantes + menu de acessibilidade (padrão antigo: 160px / 90px)
  let globalUi = document.getElementById('global-ui');
  if (!globalUi) {
    globalUi = document.createElement('div');
    globalUi.id = 'global-ui';
    document.body.appendChild(globalUi);
  }

  globalUi.innerHTML = `
    <!-- Botão Flutuante: Favoritos (padrão antigo) -->
    <a href="favoritos.html" class="float-btn btn-favoritos-float" title="Meus Favoritos" style="position: fixed; bottom: 160px; right: 20px; width: 55px; height: 55px; border-radius: 50%; background: #e11d48; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999; text-decoration: none;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></svg>
    </a>

    <!-- Botão Flutuante: Acessibilidade (padrão antigo) -->
    <button class="btn-acessibilidade" id="btn-acessibilidade" aria-label="Abrir menu de acessibilidade" style="position: fixed; bottom: 90px; right: 20px; width: 55px; height: 55px; border-radius: 50%; background: var(--p); color: white; border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999;">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
    </button>

    <!-- Menu de Acessibilidade (padrão antigo, agora com mais ações) -->
    <div class="menu-acessibilidade" id="menu-acessibilidade" style="position: fixed; bottom: 155px; right: 20px; background: white; border: 1px solid var(--line); border-radius: 16px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: none; flex-direction: column; gap: 8px; z-index: 9999; width: 220px; max-height: 70vh; overflow-y: auto;">
      <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #666; text-align: center;">Acessibilidade</h4>
      <button type="button" data-action="text-size" data-value="larger" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">A+ Aumentar texto</button>
      <button type="button" data-action="text-size" data-value="smaller" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">A− Diminuir texto</button>
      <button type="button" data-action="spacing" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">↔ Espaçamento de texto</button>
      <button type="button" data-action="contrast" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">◐ Alto contraste</button>
      <button type="button" data-action="dark" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">🌙 Modo escuro</button>
      <button type="button" data-action="dyslexia" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">📖 Fonte para dislexia</button>
      <button type="button" data-action="highlight-links" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">🔗 Destacar links</button>
      <button type="button" data-action="read-aloud" style="background: #f4f4f8; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left;">🔊 Ler em voz alta</button>
      <button type="button" data-action="reset" style="background: #fff0f0; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; text-align: left; color: #a92b48;">↺ Resetar preferências</button>
    </div>
  `;

  // 3. Lógica do menu (padrão antigo: classList.toggle('aberto'))
  const btnAcess = document.getElementById('btn-acessibilidade');
  const menuAcess = document.getElementById('menu-acessibilidade');

  if (btnAcess && menuAcess) {
    btnAcess.addEventListener('click', () => {
      const aberto = menuAcess.style.display === 'flex';
      menuAcess.style.display = aberto ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
      if (!btnAcess.contains(e.target) && !menuAcess.contains(e.target)) {
        menuAcess.style.display = 'none';
      }
    });

    // Ações (antigas + novas)
    const acoes = {
      'text-size': (v) => {
        document.documentElement.classList.remove('a11y-small-text', 'a11y-large-text');
        if (v === 'larger') document.documentElement.classList.add('a11y-large-text');
        if (v === 'smaller') document.documentElement.classList.add('a11y-small-text');
      },
      'spacing': () => document.documentElement.classList.toggle('a11y-spacing'),
      'contrast': () => document.documentElement.classList.toggle('a11y-high-contrast'),
      'dark': () => document.documentElement.classList.toggle('a11y-dark'),
      'dyslexia': () => document.documentElement.classList.toggle('a11y-dyslexia'),
      'highlight-links': () => document.documentElement.classList.toggle('a11y-highlight-links'),
      'read-aloud': () => {
        const texto = document.querySelector('main')?.innerText || document.body.innerText;
        const utter = new SpeechSynthesisUtterance(texto.slice(0, 3000));
        utter.lang = 'pt-BR';
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      },
      'reset': () => {
        document.documentElement.className = '';
        speechSynthesis.cancel();
      },
    };

    menuAcess.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const value = btn.dataset.value;
        if (acoes[action]) acoes[action](value);
      });
    });
  }
});