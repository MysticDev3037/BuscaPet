/*
 * BUSCAPET — JavaScript da aplicação
 *
 * 1. BPStore: registros e regras de negócio no localStorage.
 * 2. BPLegal: minutas acadêmicas acessíveis pela interface.
 * 3. Interface: telas, navegação, formulários e eventos.
 *
 * Não há servidor, banco central ou autenticação nesta etapa.
 * Abra index.html junto de style.css e script.js.
 */

/* 1. DADOS E REGRAS */
/* Dados e persistência. Esta camada poderá ser substituída por chamadas a uma API. */
(() => {
  "use strict";
  const KEY = "buscapet.v2";
  const POLICY_VERSION = "0.2-academica-2026-09-25";
  const id = () =>
    "bp-" +
    (globalThis.crypto?.randomUUID?.() ||
      Date.now().toString(36) + Math.random().toString(36).slice(2));
  const today = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };
  function seed() {
    const date = today();
    return {
      version: 2,
      profile: {
        id: "local",
        name: "Tutor de demonstração",
        acceptedVersion: null,
        acceptedAt: null,
      },
      accounts: [
        { id: "local", name: "Tutor de demonstração", suspended: false },
        {
          id: "community",
          name: "Colaborador de demonstração",
          suspended: false,
        },
      ],
      alerts: [
        {
          id: "hex",
          ownerId: "local",
          name: "Hex",
          species: "cao",
          breed: "Golden Retriever",
          age: "7 anos",
          city: "Campo Grande - MS",
          region: "Leste",
          place: "Próximo ao Parque das Nações",
          seenDate: date,
          reward: 5000,
          description:
            "Dócil, usa coleira vermelha. Este alerta é um exemplo fictício para demonstrar o projeto.",
          type: "perdido",
        },
        {
          id: "bold",
          ownerId: "community",
          name: "Bold",
          species: "cao",
          breed: "Sem raça definida",
          age: "3 anos",
          city: "Campo Grande - MS",
          region: "Bálsamo",
          place: "Próximo à praça do bairro",
          seenDate: date,
          reward: 0,
          description:
            "Animal encontrado próximo à praça. Exemplo fictício, sem contato real.",
          type: "encontrado",
        },
        {
          id: "gargamel",
          ownerId: "community",
          name: "Gargamel",
          species: "gato",
          breed: "Gato cinza",
          age: "7 anos",
          city: "Campo Grande - MS",
          region: "Centro",
          place: "Região central",
          seenDate: date,
          reward: 1000,
          description:
            "Gato cinza com peito branco. Exemplo fictício para demonstração.",
          type: "perdido",
        },
      ].map((a) => ({
        ...a,
        status: "ativo",
        visibility: "visivel",
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        contact: "",
        contactPublic: false,
        image: "",
        demo: true,
      })),
      sightings: [],
      reports: [],
      audit: [],
      favorites: [],
    };
  }
  let state,
    issue = "",
    corrupt = false;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : seed();
    if (
      state.version !== 2 ||
      !Array.isArray(state.alerts) ||
      !Array.isArray(state.reports) ||
      !Array.isArray(state.accounts) ||
      !Array.isArray(state.sightings) ||
      !Array.isArray(state.audit) ||
      !Array.isArray(state.favorites) ||
      !state.profile
    )
      throw Error("Dados incompatíveis");
  } catch (error) {
    state = seed();
    if (
      error instanceof SyntaxError ||
      error.message === "Dados incompatíveis"
    ) {
      corrupt = true;
      issue =
        "Os dados salvos não puderam ser lidos. Exportar dados preserva o conteúdo original. Use “Restaurar exemplos” somente depois de guardar uma cópia.";
    } else
      issue =
        "O navegador bloqueou o armazenamento. Os registros ficarão apenas nesta sessão.";
  }
  function save(next, force = false) {
    if (corrupt && !force)
      throw Error(
        "Dados anteriores não puderam ser lidos. Exporte-os e restaure os exemplos antes de continuar.",
      );
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      issue = "";
      corrupt = false;
    } catch (error) {
      if (error.name === "QuotaExceededError")
        throw Error(
          "O espaço do navegador está cheio. Exporte os dados e use uma foto menor ou remova a foto do formulário.",
        );
      issue =
        "Armazenamento bloqueado: as alterações desta sessão serão perdidas ao fechar ou recarregar a página.";
    }
    state = next;
    return !issue;
  }
  function transaction(change) {
    const next = JSON.parse(JSON.stringify(state));
    change(next);
    return save(next);
  }
  function assertActive(s, userId) {
    if (s.accounts.find((u) => u.id === userId)?.suspended)
      throw Error(
        "Esta conta de demonstração está suspensa. Consulte a moderação.",
      );
  }
  function log(s, action, target, reason, actor = "moderador-demo") {
    s.audit.unshift({
      id: id(),
      action,
      target,
      reason,
      actor,
      at: new Date().toISOString(),
    });
  }
  window.BPStore = {
    KEY,
    POLICY_VERSION,
    id,
    today,
    get: () => JSON.parse(JSON.stringify(state)),
    issue: () => issue,
    accept(name) {
      return transaction((s) => {
        s.profile.name = name;
        s.accounts.find((x) => x.id === "local").name = name;
        s.profile.acceptedVersion = POLICY_VERSION;
        s.profile.acceptedAt = new Date().toISOString();
      });
    },
    publish(data, userId) {
      let key;
      transaction((s) => {
        assertActive(s, userId);
        if (userId !== "local" || s.profile.acceptedVersion !== POLICY_VERSION)
          throw Error(
            "Ative o perfil de tutor e aceite os termos para publicar.",
          );
        key = id();
        s.alerts.unshift({
          ...data,
          id: key,
          ownerId: userId,
          status: "ativo",
          visibility: "visivel",
          createdAt: new Date().toISOString(),
          resolvedAt: null,
          demo: false,
        });
      });
      return key;
    },
    edit(key, data, userId) {
      return transaction((s) => {
        assertActive(s, userId);
        const a = s.alerts.find((x) => x.id === key);
        if (!a || a.ownerId !== userId)
          throw Error("Somente o autor pode editar este alerta.");
        if (a.visibility !== "visivel")
          throw Error(
            "A publicação está sob moderação. Solicite revisão pela área de denúncias.",
          );
        Object.assign(a, data, { updatedAt: new Date().toISOString() });
      });
    },
    resolve(key, userId) {
      return transaction((s) => {
        assertActive(s, userId);
        const a = s.alerts.find((x) => x.id === key);
        if (!a || a.ownerId !== userId)
          throw Error("Somente o autor pode encerrar este alerta.");
        a.status = "reencontrado";
        a.resolvedAt = new Date().toISOString();
      });
    },
    favorite(key) {
      return transaction((s) => {
        s.favorites = s.favorites.includes(key)
          ? s.favorites.filter((x) => x !== key)
          : [...s.favorites, key];
      });
    },
    sighting(key, data, userId) {
      return transaction((s) => {
        assertActive(s, userId);
        const a = s.alerts.find((x) => x.id === key);
        if (!a || a.status !== "ativo" || a.visibility !== "visivel")
          throw Error("Este alerta não recebe novos avistamentos.");
        s.sightings.unshift({
          ...data,
          id: id(),
          alertId: key,
          userId,
          createdAt: new Date().toISOString(),
        });
      });
    },
    report(key, data, userId) {
      let result;
      transaction((s) => {
        assertActive(s, userId);
        const a = s.alerts.find((x) => x.id === key);
        if (!a || a.visibility !== "visivel")
          throw Error("A publicação não está disponível.");
        if (
          s.reports.some(
            (r) =>
              r.alertId === key &&
              r.by === userId &&
              ["pendente", "em_analise", "em_revisao"].includes(r.status),
          )
        )
          throw Error(
            "Você já tem uma denúncia em andamento para este alerta.",
          );
        result = id();
        s.reports.unshift({
          ...data,
          id: result,
          alertId: key,
          by: userId,
          status: "pendente",
          createdAt: new Date().toISOString(),
          decision: null,
          reason: "",
          appeal: "",
          history: [],
        });
        log(s, "Denúncia recebida", result, data.category, userId);
      });
      return result;
    },
    moderate(key, action, reason, mode) {
      return transaction((s) => {
        if (mode !== "moderador") throw Error("Selecione o modo de moderação.");
        const r = s.reports.find((x) => x.id === key);
        if (!r) throw Error("Denúncia não encontrada.");
        if (r.status === "concluida")
          throw Error(
            "Esta denúncia já foi decidida. Uma contestação permite revisão.",
          );
        const a = s.alerts.find((x) => x.id === r.alertId);
        if (!["analisar", "manter", "ocultar", "remover"].includes(action))
          throw Error("Decisão inválida.");
        if (reason.trim().length < 10)
          throw Error("Descreva o motivo com pelo menos 10 caracteres.");
        if (action === "analisar") r.status = "em_analise";
        else {
          r.status = "concluida";
          r.decision = action;
          if (a)
            a.visibility = {
              manter: "visivel",
              ocultar: "oculto",
              remover: "removido",
            }[action];
        }
        r.reason = reason;
        r.updatedAt = new Date().toISOString();
        r.history.push({ action, reason, at: r.updatedAt });
        log(s, action, r.id, reason);
      });
    },
    appeal(key, text, userId) {
      return transaction((s) => {
        const r = s.reports.find((x) => x.id === key);
        const a = s.alerts.find((x) => x.id === r?.alertId);
        if (
          !r ||
          r.status !== "concluida" ||
          (r.by !== userId && a?.ownerId !== userId)
        )
          throw Error("Esta decisão não está disponível para contestação.");
        if (text.trim().length < 10)
          throw Error("Explique a contestação com pelo menos 10 caracteres.");
        r.appeal = text;
        r.status = "em_revisao";
        r.history.push({
          action: "contestar",
          reason: text,
          at: new Date().toISOString(),
        });
        log(s, "Contestação", key, text, userId);
      });
    },
    account(key, suspended, reason, mode) {
      return transaction((s) => {
        if (mode !== "moderador") throw Error("Selecione o modo de moderação.");
        const u = s.accounts.find((x) => x.id === key);
        if (!u) throw Error("Conta não encontrada.");
        if (reason.trim().length < 10)
          throw Error(
            "Informe uma justificativa com pelo menos 10 caracteres.",
          );
        u.suspended = suspended;
        log(s, suspended ? "Suspender conta" : "Reativar conta", key, reason);
      });
    },
    export() {
      if (corrupt) return localStorage.getItem(KEY);
      return JSON.stringify(state, null, 2);
    },
    reset() {
      return save(seed(), true);
    },
    erase() {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      state = {
        ...seed(),
        alerts: [],
        sightings: [],
        reports: [],
        audit: [],
        favorites: [],
      };
      return save(state, true);
    },
  };
})();

/* 2. TERMOS E PRIVACIDADE */
/* Minutas específicas da demonstração. Não descrevem um serviço público já operante. */
window.BPLegal = {
  termos: `<p class="eyebrow">Versão 0.2 acadêmica · 25/09/2026</p><h1>Termos de Uso</h1>
  <div class="notice warn">Demonstração acadêmica do BuscaPet. Esta minuta precisa de revisão jurídica antes de uma operação pública. Use informações fictícias nos testes.</div>
  <h2>1. Finalidade e funcionamento</h2><p>O BuscaPet organiza alertas de animais perdidos ou encontrados e pistas de avistamento. Nesta versão, os registros ficam neste navegador. A publicação não é enviada a outras pessoas. O sistema não oferece atendimento de emergência, resgate, atendimento veterinário ou certificação de propriedade do animal.</p>
  <h2>2. Perfil de demonstração</h2><p>Os perfis de tutor, colaborador e moderador permitem testar papéis diferentes. Não existe autenticação nem controle de acesso seguro. Qualquer pessoa com acesso a este navegador pode mudar de papel e consultar os registros. Não informe senhas, documentos, endereços residenciais ou contatos reais.</p>
  <h2>3. Publicações e conduta</h2><p>Publique informações de boa-fé e apenas fotos que você possa utilizar. Não publique dados de terceiros sem fundamento adequado. São proibidos golpes, extorsão, ameaças, assédio, discriminação, maus-tratos, venda de animais, spam, acusações sem fundamento e uso abusivo das denúncias. Uma publicação não comprova a guarda ou a propriedade de um animal.</p>
  <h2>4. Contatos e recompensas</h2><p>A divulgação de um contato é opcional e depende de escolha explícita no formulário. Nesta demonstração, use apenas contato fictício. O BuscaPet não recebe, transfere, cobra ou garante recompensas. Não faça pagamentos antecipados para receber pistas. Antes de uma entrega, verifique as informações com cautela e procure local seguro.</p>
  <h2>5. Denúncias, medidas e revisão</h2><p>O botão Denunciar registra motivo e descrição e permite acompanhar o resultado. O moderador pode analisar, manter, ocultar ou remover a publicação. Medidas sobre contas exigem justificativa. O autor e quem denunciou podem contestar decisões concluídas. O histórico registra as ações no navegador. Denúncias não geram banimento automático e não são encaminhadas a autoridades nesta versão.</p>
  <h2>6. Limites e responsabilidades</h2><p>Não há garantia de reencontro, de exatidão de conteúdo de terceiros ou de disponibilidade contínua. O usuário responde por seus próprios atos conforme a lei. Estas disposições não afastam direitos dos usuários nem responsabilidades legalmente atribuídas aos responsáveis pela plataforma, inclusive por conduta própria, proteção de dados ou deveres de atuação aplicáveis.</p>
  <h2>7. Dados, aceite e alterações</h2><p>Consulte a Política de Privacidade. O aceite guarda localmente a versão dos termos, o nome de demonstração e a data. Ele não representa autorização genérica para uso de dados. Alterações relevantes deverão ser apresentadas ao usuário. A data deste documento identifica sua versão.</p>
  <h2>8. Canal desta demonstração</h2><p>As denúncias e contestações são exclusivamente locais. O projeto ainda não dispõe de canal externo de atendimento. Antes do lançamento, a equipe deverá identificar o responsável pela operação e disponibilizar contato real e acessível. Não use este protótipo para comunicar emergência ou crime.</p>`,
  privacidade: `<p class="eyebrow">Versão 0.2 acadêmica · 25/09/2026</p><h1>Política de Privacidade</h1>
  <div class="notice warn">Esta política descreve o protótipo local. Uma operação pública exigirá definição do controlador, canal de atendimento, fornecedores, bases legais e prazos de retenção.</div>
  <h2>1. Quais informações ficam salvas</h2><p>Nome de demonstração, versão e data de aceite dos termos, dados dos alertas, foto opcional, contato opcional, favoritos, avistamentos, denúncias, contestações e histórico de moderação. Não solicitamos senha, CPF ou endereço residencial. Descrições e fotos também podem revelar dados pessoais. Use exemplos fictícios.</p>
  <h2>2. Finalidade</h2><p>Os dados servem para demonstrar publicação, busca, atualização, denúncias e moderação. A foto é reduzida e convertida no navegador. Não há reconhecimento facial, rastreamento por GPS ou análise automatizada de propriedade do animal.</p>
  <h2>3. Armazenamento e acesso</h2><p>O aplicativo usa localStorage e não envia seus formulários a um servidor. Os registros ficam no mesmo navegador e origem até exclusão manual, restauração dos exemplos ou limpeza do navegador. A navegação privada pode descartá-los. Pessoas com acesso a esse navegador podem consultar e modificar tudo, inclusive o modo de moderação. Este armazenamento não é adequado a dados reais ou confidenciais.</p>
  <h2>4. Divulgação e compartilhamento</h2><p>A lista exibe dados do animal e local aproximado. O contato só aparece quando sua divulgação é marcada no formulário. Nesta versão, a visibilidade é simulada dentro do navegador. Exportar dados gera um arquivo com todos os registros, inclusive denúncias e histórico. Guarde-o com cuidado e não o envie ao GitHub. Links externos abrem serviços sujeitos às políticas deles. Se hospedado, o provedor da página pode tratar dados de acesso conforme sua própria política.</p>
  <h2>5. Controle dos registros</h2><p>Em Minha área, é possível editar os alertas do tutor de demonstração, exportar registros e apagar os dados locais. Ocultar ou remover uma publicação na moderação não apaga seus registros internos. O botão Apagar dados locais remove os registros funcionais deste protótipo. A plataforma não controla cópias já exportadas.</p>
  <h2>6. Evolução para a operação real</h2><p>O planejamento adota coleta mínima, localização pública aproximada e acesso administrativo restrito. A versão pública precisará mapear uma base legal por finalidade, documentar retenção, oferecer canal para direitos dos titulares, proteger acessos e definir resposta a incidentes. O aceite dos termos será separado de autorizações opcionais. A faixa etária e as medidas aplicáveis a menores precisarão de avaliação específica.</p>`,
  sobre: `<p class="eyebrow">Projeto Integrador · ADS</p><h1>Sobre esta versão</h1><p>BuscaPet: encontrar começa por conectar.</p>
  <h2>Funciona neste navegador</h2><p>Publicação com foto, edição, busca e filtros, favoritos, detalhes, avistamentos, encerramento, denúncias, decisões justificadas, contestações, suspensão local de perfis, exportação e exclusão dos dados.</p>
  <h2>Simulação identificada</h2><p>Perfis sem login seguro, permissões locais de tutor e moderador, mapa ilustrativo e estabelecimentos de exemplo. Uma suspensão impede ações na interface, mas não impede manipulação pelo navegador.</p>
  <h2>Próximas etapas</h2><p>API, banco de dados, autenticação, autorização no servidor, upload protegido, mapa real, atendimento às notificações, revisão jurídica e testes com usuários. Mensagens entre pessoas e notificações por proximidade ainda não estão implementadas.</p>
  <h2>Base jurídica de referência</h2><p>LGPD: princípios, bases legais, direitos e segurança. Marco Civil da Internet e julgamento dos Temas 533 e 987 do STF: responsabilidade por conteúdo de terceiros. CDC, quando aplicável: limites das cláusulas de exclusão de responsabilidade. O enquadramento da operação e eventuais regras adicionais dependem do serviço efetivamente oferecido.</p>
  <ul><li><a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm" target="_blank" rel="noopener noreferrer">LGPD · Lei 13.709/2018</a></li><li><a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm" target="_blank" rel="noopener noreferrer">Marco Civil · Lei 12.965/2014</a></li><li><a href="https://noticias.stf.jus.br/postsnoticias/stf-define-parametros-para-responsabilizacao-de-plataformas-por-conteudos-de-terceiros/" target="_blank" rel="noopener noreferrer">STF · decisão de 26/06/2025</a></li><li><a href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12975.htm" target="_blank" rel="noopener noreferrer">Decreto 12.975/2026</a></li><li><a href="https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" target="_blank" rel="noopener noreferrer">CDC · artigos 25 e 51</a></li></ul>`,
};

/* 3. TELAS E INTERAÇÕES */
/* Interface e eventos. JavaScript puro, sem dependências e sem autenticação real. */
(() => {
  "use strict";
  const S = window.BPStore,
    $ = (q, el = document) => el.querySelector(q),
    $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const safeId = (value) => encodeURIComponent(String(value));
  // Ícones vetoriais locais: não dependem de fontes ou de conexão externa.
  function icon(name) {
    const paths = {
      paw: '<ellipse cx="6" cy="8" rx="2" ry="2.7"/><ellipse cx="11" cy="5" rx="2" ry="2.7"/><ellipse cx="17" cy="6" rx="2" ry="2.7"/><ellipse cx="20" cy="11" rx="1.8" ry="2.5"/><path d="M5 18c0-3 4-7 7-7s7 4 7 7c0 5-5 1-7 1s-7 4-7-1Z"/>',
      home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
      map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z"/><path d="M9 3v16M15 5v16"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      heart:
        '<path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/>',
      user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/>',
      pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      chevron: '<path d="m6 9 6 6 6-6"/>',
      calendar:
        '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18"/>',
      reward:
        '<circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v12"/>',
    };
    return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.paw}</svg>`;
  }
  const species = { cao: "Cão", gato: "Gato", outro: "Outro" };
  const statuses = {
    pendente: "Pendente",
    em_analise: "Em análise",
    concluida: "Concluída",
    em_revisao: "Em revisão",
  };
  const decisionNames = {
    analisar: "Em análise",
    manter: "Manter publicação",
    ocultar: "Ocultar publicação",
    remover: "Remover publicação",
  };
  const reasons = [
    "Suspeita de golpe",
    "Informação falsa",
    "Exposição de dados",
    "Ameaça ou assédio",
    "Maus-tratos",
    "Outro",
  ];
  let mode = "tutor",
    filters = {
      q: "",
      species: "todos",
      type: "todos",
      region: "todos",
      status: "ativo",
    },
    reportFilter = "todas",
    timer;
  let uploadImage = "",
    routeGeneration = 0,
    imagePending = false;
  const actor = () => (mode === "tutor" ? "local" : "community");
  const localTime = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };
  const fmtDate = (d, withTime = false) => {
    if (!d) return "Não informado";
    const date = new Date(d.length === 10 ? d + "T12:00:00" : d);
    return Number.isNaN(date.valueOf())
      ? "Data inválida"
      : date.toLocaleString(
          "pt-BR",
          withTime
            ? { dateStyle: "short", timeStyle: "short" }
            : { dateStyle: "medium" },
        );
  };
  const money = (x) =>
    Number(x).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const normalize = (x) =>
    String(x)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const title = (heading, sub = "", button = "") =>
    `<div class="page-title"><div><h1 tabindex="-1">${heading}</h1>${sub ? `<p class="intro">${sub}</p>` : ""}</div>${button}</div>`;
  const stateNotice = () =>
    S.get().accounts.find((u) => u.id === actor())?.suspended
      ? '<div class="notice warn">Este perfil de demonstração está suspenso. Publicação e colaboração estão bloqueadas.</div>'
      : "";
  function toast(message) {
    clearTimeout(timer);
    $("#toast").textContent = message;
    timer = setTimeout(() => ($("#toast").textContent = ""), 5000);
    $("#storage-warning").textContent = S.issue();
  }
  function success(message) {
    toast(S.issue() ? message + " Apenas nesta sessão." : message);
  }
  function button(label, action, id = "", style = "secondary") {
    return `<button type="button" class="btn ${style}" data-action="${action}" data-id="${escape(id)}">${label}</button>`;
  }
  // As fotos dos exemplos foram extraídas do PDF fornecido pela equipe.
  const demoPhotos = {
    hex: "assets/hex.png",
    bold: "assets/bold.png",
    gargamel: "assets/gargamel.png",
  };
  function photo(a, cls = "photo") {
    const uploaded = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(
      a.image || "",
    );
    const src = uploaded ? a.image : a.demo ? demoPhotos[a.id] : "";
    return `<div class="${cls}">${src ? `<img src="${src}" alt="Foto de ${escape(a.name)}" loading="lazy">` : `<span class="photo-placeholder">${icon("paw")}<small>Sem foto</small></span>`}</div>`;
  }
  function card(a) {
    const favorite = S.get().favorites.includes(a.id);
    return `<article class="pet">
      ${photo(a)}
      <div class="pet-body">
        <div class="card-tags"><span class="tag ${a.type === "encontrado" ? "found" : ""}">${a.type === "perdido" ? "Pet perdido" : "Pet encontrado"}</span>${a.status === "reencontrado" ? '<span class="tag resolved">Reencontrado</span>' : ""}</div>
        <h3>${escape(a.name)}</h3>
        <p class="pet-description">${escape(a.breed || species[a.species])}${a.age ? " · " + escape(a.age) : ""}</p>
        <p class="pet-location">${icon("pin")} ${escape(a.region)}<span>${escape(a.city)}</span></p>
        <div class="card-bottom"><span>${fmtDate(a.seenDate)}</span>${a.reward > 0 ? `<strong>${money(a.reward)}</strong>` : "<span>Sem recompensa</span>"}</div>
        ${a.visibility !== "visivel" ? `<span class="tag hidden">${a.visibility === "oculto" ? "Oculto" : "Removido"} pela moderação</span>` : ""}
        <div class="card-footer"><span>${a.demo ? "Exemplo fictício" : "Alerta da comunidade"}</span><b>Ver alerta <span aria-hidden="true">↗</span></b></div>
      </div>
      <a class="card-link" href="#pet/${safeId(a.id)}" aria-label="Ver detalhes de ${escape(a.name)}"></a>
      <button class="fav" data-action="favorite" data-id="${escape(a.id)}" aria-label="${favorite ? "Desfavoritar" : "Favoritar"} ${escape(a.name)}" aria-pressed="${favorite}">${icon("heart")}</button>
    </article>`;
  }
  function empty(heading, text) {
    return `<div class="empty">${icon("paw")}<h2>${heading}</h2><p>${text}</p></div>`;
  }
  function page(id, html) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("section");
      el.id = id;
      el.className = "screen";
      $(".phone").appendChild(el);
    }
    el.innerHTML = html;
    return el;
  }
  function goto(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }
  function mount() {
    const root = $(".phone");
    root.insertAdjacentHTML(
      "afterbegin",
      `<header class="app-header"><a class="logo" href="#home" aria-label="BuscaPet, início">${icon("paw")}<span class="wordmark">Busca<strong>Pet</strong></span></a><div class="header-links"><a href="#services">Rede de apoio</a><a href="#sobre">Sobre o projeto</a><span class="mode-pill" id="mode-pill"></span></div></header><div class="demo-strip"><span>Protótipo acadêmico · dados apenas neste navegador</span><a href="#perfil">Trocar perfil</a></div><div class="storage-warning" id="storage-warning" role="status"></div>`,
    );
    root.insertAdjacentHTML(
      "beforeend",
      `<nav class="main-nav" aria-label="Navegação principal"><a href="#home" data-nav="home">${icon("home")}Início</a><a href="#map" data-nav="map">${icon("map")}Mapa</a><a href="#post" data-nav="post" class="post-link">${icon("plus")}Publicar</a><a href="#favoritos" data-nav="favoritos">${icon("heart")}Favoritos</a><a href="#perfil" data-nav="perfil">${icon("user")}Minha área</a></nav>`,
    );
    $(".app-header").insertBefore($(".main-nav"), $(".header-links"));
    const responsiveQuery = window.matchMedia?.("(min-width: 1024px)");
    responsiveQuery?.addEventListener("change", () => {
      const details = $("#filter-details");
      if (details) details.open = responsiveQuery.matches;
    });
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="toast" class="toast" role="status" aria-live="polite"></div><dialog id="dialog" class="dialog"></dialog>',
    );
    $("#splash .splash-main p").innerHTML = "Encontrar começa<br>por conectar.";
    $("#splash .splash-bottom p").textContent =
      "Uma rede de apoio para mais reencontros.";
    $$(".screen .nav").forEach((n) => n.remove());
    const map = $("#map");
    $(".maparea .search", map)?.remove();
    $(".maparea", map).insertAdjacentHTML(
      "afterbegin",
      '<div class="notice"><b>Mapa ilustrativo</b><br>Os marcadores não representam coordenadas reais. A busca funcional por região está na lista de alertas. <a href="#home">Ver alertas</a></div>',
    );
    $$(".map .pin").forEach((n) => n.setAttribute("aria-hidden", "true"));
    $(".mapcard", map).innerHTML =
      '<div class="mapphoto">🐾</div><div><b>Alertas da comunidade</b><br><small>Consulte a lista e os filtros por região</small></div><span>›</span>';
    $(".mapcard", map).href = "#home";
    $("#services").insertAdjacentHTML(
      "afterbegin",
      '<div class="page">' +
        title(
          "Rede de apoio",
          "Estabelecimentos ilustrativos do protótipo original.",
        ) +
        '<div class="notice">Os dados abaixo são exemplos, sem validação comercial. A busca e o cadastro de serviços serão desenvolvidos em outra etapa.</div></div>',
    );
    $$(".service:not(a)").forEach((n) => {
      n.tabIndex = 0;
      n.setAttribute("role", "button");
      n.dataset.action = "service-demo";
    });
    $("#clinic .sheet").insertAdjacentHTML(
      "afterbegin",
      '<div class="notice">Estabelecimento demonstrativo. Dados não verificados.</div>',
    );
    $("#clinic .btn").textContent = "Voltar para rede de apoio";
    $("#clinic .btn").href = "#services";
    $$('a[href="#login"]').forEach((a) => {
      if (a.closest("#splash")) a.href = "#perfil";
    });
    window.addEventListener("hashchange", render);
    window.addEventListener("storage", (e) => {
      if (e.key === S.KEY)
        toast("Os dados mudaram em outra aba. Recarregue antes de continuar.");
    });
    document.addEventListener("click", click);
    document.addEventListener("submit", submit);
    document.addEventListener("input", input);
    document.addEventListener("change", change);
    document.addEventListener("keydown", (e) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.matches('[data-action="service-demo"]')
      ) {
        e.preventDefault();
        toast(
          "Serviço ilustrativo. Cadastro e detalhes completos estão planejados.",
        );
      }
    });
    render();
  }
  function render() {
    routeGeneration++;
    imagePending = false;
    const parts = (location.hash.slice(1) || "home").split("/");
    const route = parts[0];
    let key = "";
    try {
      key = decodeURIComponent(parts[1] || "");
    } catch (e) {}
    let section = route;
    if (["home", "favoritos"].includes(route))
      renderHome(route === "favoritos");
    else if (route === "pet") renderDetail(key);
    else if (route === "post") renderPost();
    else if (route === "publicar") renderForm(key || "perdido");
    else if (route === "editar") renderForm("", key);
    else if (["perfil", "login", "signup", "recovery"].includes(route)) {
      section = "perfil";
      renderProfile();
    } else if (route === "avistamento") renderSighting(key);
    else if (route === "denunciar") renderReport(key);
    else if (route === "denuncias") renderReports();
    else if (route === "admin") renderAdmin();
    else if (window.BPLegal[route])
      page(
        route,
        `<div class="page narrow"><a href="#perfil" class="back-link">‹ Minha área</a><article class="legal">${window.BPLegal[route]}</article></div>`,
      );
    else if (!["map", "services", "clinic", "splash"].includes(route)) {
      section = "home";
      renderHome(false);
    }
    $$(".screen").forEach((el) => {
      el.classList.toggle("current", el.id === section);
      el.hidden = el.id !== section;
    });
    const current = document.getElementById(section);
    if (current) {
      current.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const h = $("h1", current);
      if (h) {
        h.setAttribute("tabindex", "-1");
        h.focus({ preventScroll: true });
      }
    }
    $$(".main-nav a").forEach((a) => {
      const active =
        a.dataset.nav === section ||
        (a.dataset.nav === "post" &&
          ["publicar", "editar"].includes(section)) ||
        (a.dataset.nav === "perfil" &&
          ["admin", "denuncias"].includes(section));
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#mode-pill").textContent =
      mode === "tutor"
        ? "Tutor · demo"
        : mode === "moderador"
          ? "Moderação · demo"
          : "Colaborador · demo";
    $$(".data-table").forEach((table) => {
      const headings = $$("thead th", table).map((cell) => cell.textContent);
      $$("tbody tr", table).forEach((row) => {
        $$("td", row).forEach(
          (cell, index) => (cell.dataset.label = headings[index] || ""),
        );
      });
    });
    $("#storage-warning").textContent = S.issue();
    document.title =
      "BuscaPet | " +
      ({
        home: "Alertas",
        perfil: "Minha área",
        admin: "Moderação",
        post: "Publicar",
      }[section] || "Protótipo funcional");
  }
  function renderHome(favorites) {
    const other = document.getElementById(favorites ? "home" : "favoritos");
    if (other) other.innerHTML = "";
    const regions = [
      ...new Set(
        S.get()
          .alerts.filter((a) => a.visibility === "visivel")
          .map((a) => a.region),
      ),
    ].sort();
    page(
      favorites ? "favoritos" : "home",
      `
      <div class="page catalog-page">
        <div class="catalog-intro"><div><p class="eyebrow">Encontrar começa por conectar</p><h1 tabindex="-1">${favorites ? "Seus favoritos" : "Quem você pode ajudar hoje?"}</h1><p class="intro">${favorites ? "Acompanhe os alertas que você salvou neste navegador." : "Uma foto, uma pista, um reencontro. Faça parte dessa busca."}</p></div><a class="btn primary publish-desktop" href="#post">${icon("plus")} Publicar alerta</a></div>
        ${stateNotice()}
        <div class="browse-layout">
          <aside class="browse-sidebar" aria-label="Busca e filtros">
            <label class="search">${icon("search")}<span class="sr-only">Buscar alertas</span><input id="query" value="${escape(filters.q)}" placeholder="Nome, raça ou cidade..."></label>
            <details class="filters-panel" id="filter-details" ${window.matchMedia?.("(min-width: 1024px)").matches ? "open" : ""}>
              <summary>Filtrar alertas <span>${icon("chevron")}</span></summary>
              <div class="filter-controls">
                <label>Tipo de alerta<select id="filter-type" aria-label="Tipo de alerta">${[
                  ["todos", "Todos os alertas"],
                  ["perdido", "Perdidos"],
                  ["encontrado", "Encontrados"],
                ]
                  .map(
                    ([v, n]) =>
                      `<option value="${v}" ${filters.type === v ? "selected" : ""}>${n}</option>`,
                  )
                  .join("")}</select></label>
                <label>Região<select id="filter-region" aria-label="Região"><option value="todos">Todas as regiões</option>${regions.map((r) => `<option ${filters.region === r ? "selected" : ""}>${escape(r)}</option>`).join("")}</select></label>
                <label>Situação<select id="filter-status" aria-label="Situação"><option value="ativo" ${filters.status === "ativo" ? "selected" : ""}>Em busca</option><option value="reencontrado" ${filters.status === "reencontrado" ? "selected" : ""}>Reencontrados</option><option value="todos" ${filters.status === "todos" ? "selected" : ""}>Todas as situações</option></select></label>
                <button class="plain clear-filters" data-action="clear-filters">Limpar filtros</button>
              </div>
            </details>
            <div class="support-note"><b>Você pode fazer a diferença.</b><p>Viu um pet parecido? Abra o alerta e registre uma pista.</p><a href="#services">Conhecer a rede de apoio ↗</a></div>
          </aside>
          <div class="browse-results">
            <div class="catalog-toolbar"><div class="chips" role="group" aria-label="Filtrar por espécie">${[
              ["todos", "Todos"],
              ["cao", "Cães"],
              ["gato", "Gatos"],
              ["outro", "Outros"],
            ]
              .map(
                ([v, n]) =>
                  `<button data-filter-species="${v}" class="${filters.species === v ? "on" : ""}" aria-pressed="${filters.species === v}">${n}</button>`,
              )
              .join(
                "",
              )}</div><span id="result-count" role="status" aria-live="polite"></span></div>
            <div id="results" class="list alert-grid"></div>
          </div>
        </div>
      </div>`,
    );
    updateResults(favorites);
  }
  function updateResults(favorites = location.hash.startsWith("#favoritos")) {
    const s = S.get(),
      q = normalize(filters.q);
    const alerts = s.alerts.filter(
      (a) =>
        a.visibility === "visivel" &&
        (!favorites || s.favorites.includes(a.id)) &&
        (filters.species === "todos" || a.species === filters.species) &&
        (filters.type === "todos" || a.type === filters.type) &&
        (filters.status === "todos" || a.status === filters.status) &&
        (filters.region === "todos" || a.region === filters.region) &&
        normalize(
          [a.name, a.breed, a.city, a.region, a.place].join(" "),
        ).includes(q),
    );
    $("#results").innerHTML = alerts.length
      ? alerts.map(card).join("")
      : empty(
          "Nenhum alerta por aqui",
          "Altere os filtros ou publique um novo alerta.",
        );
    $("#result-count").textContent =
      alerts.length +
      (alerts.length === 1 ? " alerta encontrado" : " alertas encontrados");
  }
  function renderDetail(key) {
    const s = S.get(),
      a = s.alerts.find((x) => x.id === key),
      own = a?.ownerId === actor() && mode === "tutor";
    if (!a || (a.visibility !== "visivel" && !own && mode !== "moderador"))
      return page(
        "pet",
        `<div class="page">${empty("Publicação indisponível", "O alerta não existe ou está indisponível pela moderação.")}<a class="btn secondary" href="#home">Voltar aos alertas</a></div>`,
      );
    const sightings = s.sightings.filter((x) => x.alertId === key);
    const active = a.status === "ativo" && a.visibility === "visivel";
    page(
      "pet",
      `<div class="page"><a class="back-link" href="#home">‹ Voltar aos alertas</a><div class="detail-layout"><div>${photo(a, "detail-photo")}<div class="actions">${button(s.favorites.includes(key) ? icon("heart") + " Favoritado" : icon("heart") + " Salvar favorito", "favorite", key)}${a.visibility === "visivel" ? `<a class="btn secondary" href="#denunciar/${safeId(key)}">Denunciar</a>` : ""}</div>${a.demo ? '<p class="hint">Este animal e este alerta são exemplos fictícios.</p>' : ""}</div><div><div class="fact-line"><span class="tag ${a.type === "encontrado" ? "found" : ""}">${a.type === "perdido" ? "Pet perdido" : "Pet encontrado"}</span><span class="tag ${a.status === "reencontrado" ? "resolved" : ""}">${a.status === "reencontrado" ? "Reencontro concluído" : "Em busca"}</span></div><h1>${escape(a.name)}</h1><div class="tags"><span class="tag">${species[a.species]}</span><span class="tag">${escape(a.breed || "Raça não informada")}</span>${a.age ? `<span class="tag">${escape(a.age)}</span>` : ""}</div>${a.visibility !== "visivel" ? '<div class="notice warn">Publicação ' + (a.visibility === "oculto" ? "oculta" : "removida") + ' da lista pública pela moderação. <a href="#denuncias">Ver decisão e contestar</a></div>' : ""}<div class="detail"><div><span class="ico">${icon("pin")}</span><p><small>Local aproximado</small><b>${escape(a.region)} · ${escape(a.city)}</b><small>${escape(a.place)}</small></p></div><div><span class="ico">${icon("calendar")}</span><p><small>${a.type === "perdido" ? "Última vez visto" : "Encontrado em"}</small><b>${fmtDate(a.seenDate)}</b></p></div>${a.reward > 0 ? `<div><span class="ico">${icon("reward")}</span><p><small>Recompensa informada pelo autor</small><b>${money(a.reward)}</b></p></div>` : ""}</div><h2 class="section-heading">Características e informações</h2><p class="desc">${escape(a.description)}</p>${a.contactPublic && a.contact ? `<div class="notice contact-value"><b>Contato informado</b><br>${escape(a.contact)}<br><small>Informação fornecida pelo autor. Não faça pagamentos antecipados por pistas.</small></div>` : '<p class="hint">O autor não divulgou contato. Registre uma pista no próprio alerta.</p>'}<div class="actions">${active ? `<a class="btn primary" href="#avistamento/${safeId(key)}">Registrar avistamento</a>` : ""}${own && a.visibility === "visivel" ? `<a class="btn secondary" href="#editar/${safeId(key)}">Editar alerta</a>` : ""}${own && a.status === "ativo" ? button("Confirmar reencontro", "resolve", key) : ""}</div>${a.resolvedAt ? `<div class="notice">Reencontro registrado em ${fmtDate(a.resolvedAt, true)}.</div>` : ""}</div></div><h2 class="section-heading">Avistamentos <span class="count-line">(${sightings.length})</span></h2><div class="timeline">${sightings.length ? sightings.map((v) => `<article><b>${icon("pin")} ${escape(v.place)}</b><p>${escape(v.description)}</p><small>Visto em ${fmtDate(v.seenAt, true)} · registrado em ${fmtDate(v.createdAt, true)}</small></article>`).join("") : '<p class="hint">Nenhuma pista registrada ainda.</p>'}</div></div>`,
    );
  }
  function renderPost() {
    page(
      "post",
      `<div class="page narrow"><p class="eyebrow">Uma informação pode ajudar</p>${title("Encontrou ou perdeu um pet?", "Escolha o tipo de alerta para começar.")}${stateNotice()}<div class="choices"><a class="choice" href="#publicar/perdido"><span class="choiceicon">${icon("paw")}</span><div><h3>Perdi meu pet</h3><p>Informe características e o último local visto.</p></div><b>›</b></a><a class="choice" href="#publicar/encontrado"><span class="choiceicon">${icon("heart")}</span><div><h3>Encontrei um pet</h3><p>Ajude a localizar a pessoa responsável.</p></div><b>›</b></a></div><div class="notice">Use a região ou um ponto de referência. Evite endereço residencial e dados pessoais de terceiros.</div></div>`,
    );
  }
  function field(label, name, value = "", extra = "", type = "text") {
    return `<label>${label}<input class="control" name="${name}" type="${type}" value="${escape(value)}" ${extra}></label>`;
  }
  function renderForm(type, key = "") {
    const other = document.getElementById(key ? "publicar" : "editar");
    if (other) other.innerHTML = "";
    const a = key ? S.get().alerts.find((x) => x.id === key) : null;
    if (
      mode !== "tutor" ||
      (key && (!a || a.ownerId !== "local" || a.visibility !== "visivel"))
    )
      return page(
        key ? "editar" : "publicar",
        `<div class="page narrow">${empty("Perfil de tutor necessário", "A publicação e a edição pertencem ao tutor de demonstração.")}<a class="btn primary" href="#perfil">Abrir Minha área</a></div>`,
      );
    type =
      a?.type || (["perdido", "encontrado"].includes(type) ? type : "perdido");
    uploadImage = a?.image || "";
    page(
      key ? "editar" : "publicar",
      `<div class="page narrow form-page"><a href="#post" class="back-link">‹ Voltar</a>${title(key ? "Editar alerta" : type === "perdido" ? "Meu pet desapareceu" : "Encontrei um pet", "Os campos com * são obrigatórios.")}${stateNotice()}<form class="form" id="alert-form" data-id="${escape(key)}"><input type="hidden" name="type" value="${type}"><div class="form-grid">${field("Nome ou identificação *", "name", a?.name || "", 'required maxlength="60" placeholder="Ex.: Luna ou Cão caramelo"')}<label>Espécie *<select class="control" name="species" required>${Object.entries(
        species,
      )
        .map(
          ([v, n]) =>
            `<option value="${v}" ${a?.species === v ? "selected" : ""}>${n}</option>`,
        )
        .join(
          "",
        )}</select></label>${field("Raça ou aparência", "breed", a?.breed || "", 'maxlength="60" placeholder="Ex.: sem raça definida"')}${field("Idade aproximada", "age", a?.age || "", 'maxlength="25" placeholder="Ex.: 2 anos"')}${field("Cidade / UF *", "city", a?.city || "", 'required maxlength="80" placeholder="Ex.: Campo Grande - MS"')}${field("Bairro ou região *", "region", a?.region || "", 'required maxlength="60" placeholder="Ex.: Centro"')}${field("Ponto de referência *", "place", a?.place || "", 'required maxlength="120" placeholder="Use um local aproximado"')}${field("Data em que foi visto *", "seenDate", a?.seenDate || S.today(), `required max="${S.today()}"`, "date")}<label class="full">Descrição e características *<textarea class="control" name="description" required minlength="10" maxlength="1200" placeholder="Cor, coleira, comportamento e informações que ajudem na identificação">${escape(a?.description || "")}</textarea></label>${field("Recompensa opcional (R$)", "reward", a?.reward || "", 'min="0" max="1000000" step="0.01" placeholder="0,00"', "number")}${field("Contato fictício opcional", "contact", a?.contact || "", 'maxlength="100" placeholder="Somente para testar a apresentação"')}<label class="check-label full"><input type="checkbox" name="contactPublic" ${a?.contactPublic ? "checked" : ""}><span>Quero mostrar o contato informado no alerta.<span class="hint">A escolha é opcional. Para o protótipo, informe apenas dados fictícios.</span></span></label><label class="full">Foto opcional<input class="control" type="file" id="photo-input" accept="image/jpeg,image/png,image/webp"><span class="hint">JPG, PNG ou WebP, até 8 MB. A foto será reduzida e salva neste navegador.</span><img class="photo-preview" id="photo-preview" alt="Prévia da foto" ${uploadImage ? `src="${uploadImage}"` : "hidden"}></label><div class="full">${button("Remover foto", "remove-photo", "", "secondary small")}</div></div><label class="check-label"><input type="checkbox" name="contentRights" required><span>Confirmo que posso usar a foto e as informações e que não estou expondo dados de terceiros indevidamente.</span></label>${!key && S.get().profile.acceptedVersion !== S.POLICY_VERSION ? '<label class="check-label"><input type="checkbox" name="acceptTerms" required><span>Aceito os <a href="#termos" target="_blank">Termos de Uso</a> e li a <a href="#privacidade" target="_blank">Política de Privacidade</a> da demonstração.</span></label>' : ""}<div class="form-error" role="alert"></div><div class="actions"><button class="btn primary" type="submit">${key ? "Salvar alterações" : "Publicar alerta"}</button><a class="btn secondary" href="#home">Cancelar</a></div></form></div>`,
    );
  }
  function renderSighting(key) {
    const a = S.get().alerts.find(
      (x) => x.id === key && x.status === "ativo" && x.visibility === "visivel",
    );
    if (!a)
      return page(
        "avistamento",
        `<div class="page">${empty("Alerta indisponível", "Este alerta não recebe novas pistas.")}<a href="#home">Voltar</a></div>`,
      );
    page(
      "avistamento",
      `<div class="page narrow"><a class="back-link" href="#pet/${safeId(key)}">‹ ${escape(a.name)}</a>${title("Viu este pet?", "Informe o local aproximado e o momento do avistamento.")}${stateNotice()}<form class="form" id="sighting-form" data-id="${escape(key)}">${field("Local aproximado *", "place", "", 'required maxlength="120" placeholder="Ex.: perto da praça do Centro"')}${field("Data e hora *", "seenAt", localTime(), `required max="${localTime()}"`, "datetime-local")}<label>Observação *<textarea class="control" name="description" required minlength="5" maxlength="600" placeholder="O que você viu? Evite dados pessoais de terceiros."></textarea></label><div class="form-error" role="alert"></div><button class="btn primary">Registrar pista</button></form></div>`,
    );
  }
  function renderReport(key) {
    const a = S.get().alerts.find(
      (x) => x.id === key && x.visibility === "visivel",
    );
    if (!a)
      return page(
        "denunciar",
        `<div class="page">${empty("Publicação indisponível", "Volte à lista de alertas.")}<a href="#home">Voltar</a></div>`,
      );
    page(
      "denunciar",
      `<div class="page narrow"><a class="back-link" href="#pet/${safeId(key)}">‹ ${escape(a.name)}</a>${title("Denunciar publicação", "Descreva o problema para que a moderação possa avaliar.")}<div class="notice">A denúncia gera um registro local. Ela não remove automaticamente a publicação e não é enviada a autoridades.</div><form class="form" id="report-form" data-id="${escape(key)}"><label>Motivo *<select class="control" name="category" required><option value="">Selecione</option>${reasons.map((r) => `<option>${r}</option>`).join("")}</select></label><label>O que aconteceu? *<textarea class="control" name="description" required minlength="10" maxlength="1000" placeholder="Explique o problema sem incluir dados pessoais desnecessários."></textarea></label><div class="form-error" role="alert"></div><button class="btn primary">Enviar denúncia</button></form></div>`,
    );
  }
  function reportCard(r, admin = false) {
    const a = S.get().alerts.find((x) => x.id === r.alertId);
    return `<article class="report-card"><div class="page-title"><div><h3>${escape(a?.name || "Alerta indisponível")} · ${escape(r.category)}</h3><div class="meta">Protocolo ${escape(r.id.slice(-8))} · ${fmtDate(r.createdAt, true)}</div></div><span class="report-status">${statuses[r.status]}</span></div><p>${escape(r.description)}</p>${r.reason ? `<div class="notice"><b>${escape(decisionNames[r.decision] || "Última análise")}</b><br>${escape(r.reason)}</div>` : ""}${r.appeal ? `<p><b>Contestação:</b> ${escape(r.appeal)}</p>` : ""}<div class="actions">${a ? `<a href="#pet/${safeId(a.id)}" class="btn secondary small">Consultar publicação</a>` : ""}${!admin && r.status === "concluida" ? button("Contestar decisão", "appeal", r.id, "secondary small") : ""}</div>${admin && r.status !== "concluida" ? `<form class="form moderation-form" data-id="${escape(r.id)}"><label>Medida<select class="control" name="decision"><option value="analisar">Marcar em análise</option><option value="manter">Manter / restaurar publicação</option><option value="ocultar">Ocultar publicação</option><option value="remover">Remover publicação da lista</option></select></label><label>Justificativa *<textarea class="control" name="reason" required minlength="10" maxlength="800" placeholder="Explique a decisão. Ela ficará visível às partes envolvidas."></textarea></label><div class="form-error" role="alert"></div><button class="btn primary">Registrar decisão</button></form>` : ""}${r.history.length ? `<details><summary>Histórico da denúncia</summary><div class="timeline">${r.history.map((h) => `<article><b>${escape(decisionNames[h.action] || "Contestação")}</b><p>${escape(h.reason)}</p><small>${fmtDate(h.at, true)}</small></article>`).join("")}</div></details>` : ""}</article>`;
  }
  function renderReports() {
    const s = S.get(),
      list = s.reports.filter(
        (r) =>
          r.by === actor() ||
          s.alerts.find((a) => a.id === r.alertId)?.ownerId === actor(),
      );
    page(
      "denuncias",
      `<div class="page narrow"><a class="back-link" href="#perfil">‹ Minha área</a>${title("Denúncias e decisões", "Acompanhe suas denúncias e decisões sobre seus alertas.")}${list.length ? list.map((r) => reportCard(r)).join("") : empty("Nenhuma denúncia", "As denúncias deste perfil aparecerão aqui.")}</div>`,
    );
  }
  function renderProfile() {
    const s = S.get(),
      mine = s.alerts.filter((a) => a.ownerId === actor()),
      accepted = s.profile.acceptedVersion === S.POLICY_VERSION;
    page(
      "perfil",
      `<div class="page">${title("Minha área", "Perfis de demonstração para testar o projeto.")}<div class="notice warn">Sem login real: os papéis abaixo simulam permissões. Qualquer pessoa neste navegador pode alterná-los.</div><div class="mode-options">${[
        ["tutor", "Tutor"],
        ["colaborador", "Colaborador"],
        ["moderador", "Moderador"],
      ]
        .map(
          ([v, n]) =>
            `<button data-action="mode" data-id="${v}" class="${mode === v ? "active" : ""}" aria-pressed="${mode === v}">${n}</button>`,
        )
        .join(
          "",
        )}</div>${stateNotice()}${mode === "tutor" ? `<form class="form" id="profile-form" style="max-width:550px">${field("Nome de demonstração", "name", s.profile.name, 'required maxlength="60"')}<label class="check-label"><input type="checkbox" name="terms" required ${accepted ? "checked" : ""}><span>Aceito os <a href="#termos">Termos de Uso</a> e li a <a href="#privacidade">Política de Privacidade</a> desta demonstração.</span></label><div class="form-error" role="alert"></div><button class="btn primary">Salvar perfil e aceite</button>${accepted ? `<p class="hint">Aceite registrado em ${fmtDate(s.profile.acceptedAt, true)}. Versão ${escape(s.profile.acceptedVersion)}.</p>` : ""}</form>` : ""}<div class="actions"><a class="btn secondary" href="#denuncias">Denúncias e decisões</a>${mode === "moderador" ? '<a class="btn primary" href="#admin">Abrir painel de moderação</a>' : ""}<a class="btn secondary" href="#termos">Termos de Uso</a><a class="btn secondary" href="#privacidade">Privacidade</a><a class="btn secondary" href="#services">Rede de apoio</a><a class="btn secondary" href="#sobre">Sobre esta versão</a></div>${mode !== "moderador" ? `<h2 class="section-heading">Alertas deste perfil</h2><div class="list alert-grid">${mine.length ? mine.map(card).join("") : empty("Nenhum alerta", "Publique um pet para começar.")}</div>` : ""}<h2 class="section-heading">Dados da demonstração</h2><p class="hint">Exportar inclui todos os dados locais, denúncias e histórico. Não envie esse arquivo ao GitHub.</p><div class="actions">${button("Exportar dados", "export")}${button("Restaurar exemplos", "reset")}${button("Apagar dados locais", "erase", "", "danger")}</div></div>`,
    );
  }
  function renderAdmin() {
    if (mode !== "moderador")
      return page(
        "admin",
        `<div class="page narrow">${empty("Modo de moderação", "Abra Minha área e selecione Moderador para demonstrar o painel.")}<a href="#perfil" class="btn primary">Minha área</a></div>`,
      );
    const s = S.get(),
      reports = s.reports.filter(
        (r) => reportFilter === "todas" || r.status === reportFilter,
      );
    page(
      "admin",
      `<div class="page"><p class="eyebrow">Administração do BuscaPet</p>${title("Moderação", "Denúncias, decisões justificadas e histórico de ações.")}<div class="notice warn">Painel local de demonstração. Autenticação, autorização e registros protegidos no servidor ainda serão desenvolvidos.</div><div class="stats"><div><b>${s.reports.filter((r) => r.status === "pendente").length}</b><span>Pendentes</span></div><div><b>${s.reports.filter((r) => ["em_analise", "em_revisao"].includes(r.status)).length}</b><span>Em análise ou revisão</span></div><div><b>${s.reports.filter((r) => r.status === "concluida").length}</b><span>Concluídas</span></div></div><label>Filtrar denúncias <select class="control" id="report-filter" style="max-width:300px"><option value="todas">Todas</option>${Object.entries(
        statuses,
      )
        .map(
          ([v, n]) =>
            `<option value="${v}" ${reportFilter === v ? "selected" : ""}>${n}</option>`,
        )
        .join(
          "",
        )}</select></label>${reports.length ? reports.map((r) => reportCard(r, true)).join("") : empty("Nenhuma denúncia nesta fila", "Envie uma denúncia em um alerta para testar o fluxo.")}<h2 class="section-heading">Contas de demonstração</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Perfil</th><th>Situação</th><th>Medida</th></tr></thead><tbody>${s.accounts.map((u) => `<tr><td>${escape(u.name)}</td><td>${u.suspended ? "Suspenso" : "Ativo"}</td><td>${button(u.suspended ? "Reativar" : "Suspender", "account", u.id, "secondary small")}</td></tr>`).join("")}</tbody></table></div><h2 class="section-heading">Registro de ações</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Quando</th><th>Quem / ação</th><th>Referência</th><th>Justificativa</th></tr></thead><tbody>${s.audit.length ? s.audit.map((e) => `<tr><td>${fmtDate(e.at, true)}</td><td>${escape(e.actor)}<br><b>${escape(e.action)}</b></td><td>${escape(e.target.slice(-8))}</td><td>${escape(e.reason)}</td></tr>`).join("") : '<tr><td colspan="4">Nenhuma ação registrada.</td></tr>'}</tbody></table></div></div>`,
    );
  }
  function dialog(titleText, body) {
    const d = $("#dialog");
    d.innerHTML = `<h2>${titleText}</h2>${body}`;
    d.showModal();
  }
  function confirmAction(titleText, text, action, key = "") {
    dialog(
      titleText,
      `<p>${text}</p><div class="actions">${button("Cancelar", "close-dialog")}${button("Confirmar", action, key, "primary")}</div>`,
    );
  }
  function click(e) {
    if (
      e.target.closest("#filter-details summary") &&
      window.matchMedia?.("(min-width: 1024px)").matches
    ) {
      e.preventDefault();
      return;
    }
    const filter = e.target.closest("[data-filter-species]");
    if (filter) {
      filters.species = filter.dataset.filterSpecies;
      $$("[data-filter-species]").forEach((b) => {
        b.classList.toggle("on", b === filter);
        b.setAttribute("aria-pressed", b === filter);
      });
      updateResults();
      return;
    }
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action,
      key = target.dataset.id;
    try {
      if (action === "favorite") {
        S.favorite(key);
        if (["home", "favoritos"].includes(location.hash.slice(1) || "home"))
          updateResults();
        else render();
        success("Favoritos atualizados.");
      } else if (action === "clear-filters") {
        filters = {
          q: "",
          species: "todos",
          type: "todos",
          region: "todos",
          status: "ativo",
        };
        render();
      } else if (action === "mode") {
        mode = ["tutor", "colaborador", "moderador"].includes(key)
          ? key
          : "tutor";
        render();
      } else if (action === "remove-photo") {
        uploadImage = "";
        $("#photo-preview").hidden = true;
        $("#photo-input").value = "";
      } else if (action === "resolve")
        confirmAction(
          "Confirmar reencontro",
          "O alerta ficará como reencontrado e deixará de receber avistamentos.",
          "confirm-resolve",
          key,
        );
      else if (action === "confirm-resolve") {
        S.resolve(key, actor());
        $("#dialog").close();
        render();
        success("Reencontro registrado!");
      } else if (action === "export") {
        const blob = new Blob([S.export()], { type: "application/json" }),
          url = URL.createObjectURL(blob),
          a = document.createElement("a");
        a.href = url;
        a.download = "buscapet-dados-" + S.today() + ".json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast("Exportação iniciada. Guarde o arquivo fora do repositório.");
      } else if (action === "reset")
        confirmAction(
          "Restaurar exemplos?",
          "Todos os registros atuais serão substituídos pelos exemplos iniciais. Exporte os dados que deseja guardar antes de confirmar.",
          "confirm-reset",
        );
      else if (action === "erase")
        confirmAction(
          "Apagar dados locais?",
          "Alertas, fotos, denúncias, favoritos, aceite e histórico deste navegador serão apagados. Cópias exportadas não são afetadas.",
          "confirm-erase",
        );
      else if (action === "confirm-reset" || action === "confirm-erase") {
        action === "confirm-reset" ? S.reset() : S.erase();
        $("#dialog").close();
        mode = "tutor";
        filters = {
          q: "",
          species: "todos",
          type: "todos",
          region: "todos",
          status: "ativo",
        };
        render();
        success("Dados locais atualizados.");
      } else if (action === "close-dialog") $("#dialog").close();
      else if (action === "appeal")
        dialog(
          "Contestar decisão",
          `<form id="appeal-form" class="form" data-id="${escape(key)}"><label>Explique seu pedido de revisão<textarea class="control" name="reason" required minlength="10" maxlength="800"></textarea></label><div class="form-error" role="alert"></div><div class="actions">${button("Cancelar", "close-dialog")}<button class="btn primary">Enviar contestação</button></div></form>`,
        );
      else if (action === "account") {
        const u = S.get().accounts.find((x) => x.id === key);
        dialog(
          (u.suspended ? "Reativar" : "Suspender") + " conta",
          `<p>${escape(u.name)}</p><form id="account-form" class="form" data-id="${escape(key)}"><label>Justificativa<textarea class="control" name="reason" required minlength="10" maxlength="800"></textarea></label><div class="form-error" role="alert"></div><div class="actions">${button("Cancelar", "close-dialog")}<button class="btn primary">Confirmar medida</button></div></form>`,
        );
      } else if (action === "service-demo")
        toast(
          "Serviço ilustrativo. Cadastro e detalhes completos estão planejados.",
        );
    } catch (error) {
      toast(error.message);
    }
  }
  function input(e) {
    if (e.target.id === "query") {
      filters.q = e.target.value;
      updateResults();
    }
  }
  async function change(e) {
    if (e.target.id.startsWith("filter-")) {
      filters[e.target.id.slice(7)] = e.target.value;
      updateResults();
    } else if (e.target.id === "report-filter") {
      reportFilter = e.target.value;
      render();
    } else if (e.target.id === "photo-input") {
      const file = e.target.files[0];
      if (!file) return;
      const generation = routeGeneration;
      imagePending = true;
      try {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
          throw Error("Selecione uma foto JPG, PNG ou WebP.");
        if (file.size > 8 * 1024 * 1024)
          throw Error("A foto deve ter até 8 MB.");
        const url = URL.createObjectURL(file),
          img = new Image();
        try {
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () =>
              reject(Error("Não foi possível ler essa foto."));
            img.src = url;
          });
          const scale = Math.min(1, 900 / Math.max(img.width, img.height)),
            canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const result = canvas.toDataURL("image/jpeg", 0.76);
          if (result.length > 600000)
            throw Error("Foto muito detalhada. Escolha uma imagem menor.");
          if (generation === routeGeneration) {
            uploadImage = result;
            $("#photo-preview").src = result;
            $("#photo-preview").hidden = false;
          }
        } finally {
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        toast(error.message);
        e.target.value = "";
      } finally {
        if (generation === routeGeneration) imagePending = false;
      }
    }
  }
  function submit(e) {
    const form = e.target;
    if (!form.matches("form")) return;
    e.preventDefault();
    const fd = new FormData(form),
      value = (n) => String(fd.get(n) || "").trim(),
      key = form.dataset.id;
    const errorEl = $(".form-error", form);
    if (errorEl) errorEl.textContent = "";
    try {
      if (form.id === "profile-form") {
        if (value("name").length < 2)
          throw Error("Informe um nome com pelo menos 2 caracteres.");
        if (!fd.has("terms"))
          throw Error("Leia e aceite os termos da demonstração.");
        S.accept(value("name"));
        render();
        success("Perfil e aceite salvos.");
      } else if (form.id === "alert-form") {
        if (imagePending) throw Error("Aguarde o processamento da foto.");
        if (
          !value("name") ||
          !value("city") ||
          !value("region") ||
          !value("place") ||
          value("description").length < 10
        )
          throw Error("Preencha os campos obrigatórios e descreva o pet.");
        if (!value("seenDate") || value("seenDate") > S.today())
          throw Error("A data não pode ser futura.");
        if (!fd.has("contentRights"))
          throw Error("Confirme o uso das informações.");
        if (fd.has("contactPublic") && !value("contact"))
          throw Error("Informe o contato ou desmarque sua divulgação.");
        const reward = Number(value("reward") || 0);
        if (!Number.isFinite(reward) || reward < 0 || reward > 1000000)
          throw Error("Recompensa inválida.");
        const data = {
          type: value("type"),
          name: value("name"),
          species: value("species"),
          breed: value("breed"),
          age: value("age"),
          city: value("city"),
          region: value("region"),
          place: value("place"),
          seenDate: value("seenDate"),
          description: value("description"),
          reward,
          contact: value("contact"),
          contactPublic: fd.has("contactPublic"),
          image: uploadImage,
        };
        if (!key && S.get().profile.acceptedVersion !== S.POLICY_VERSION) {
          if (!fd.has("acceptTerms"))
            throw Error(
              "Leia e aceite os termos da demonstração antes de publicar.",
            );
          S.accept(S.get().profile.name);
        }
        const result = key
          ? (S.edit(key, data, actor()), key)
          : S.publish(data, actor());
        filters = {
          q: "",
          species: "todos",
          type: "todos",
          region: "todos",
          status: "ativo",
        };
        goto("#pet/" + safeId(result));
        success(
          key ? "Alerta atualizado." : "Alerta publicado neste navegador!",
        );
      } else if (form.id === "sighting-form") {
        const date = new Date(value("seenAt"));
        if (!value("place") || value("description").length < 5)
          throw Error("Informe o local e descreva a pista.");
        if (Number.isNaN(date.valueOf()) || date > new Date())
          throw Error("Informe uma data válida, sem horário futuro.");
        S.sighting(
          key,
          {
            place: value("place"),
            seenAt: date.toISOString(),
            description: value("description"),
          },
          actor(),
        );
        goto("#pet/" + safeId(key));
        success("Avistamento registrado.");
      } else if (form.id === "report-form") {
        if (
          !reasons.includes(value("category")) ||
          value("description").length < 10
        )
          throw Error("Selecione um motivo e explique o problema.");
        S.report(
          key,
          { category: value("category"), description: value("description") },
          actor(),
        );
        goto("#denuncias");
        success("Denúncia registrada. Acompanhe o protocolo nesta página.");
      } else if (form.matches(".moderation-form")) {
        S.moderate(key, value("decision"), value("reason"), mode);
        render();
        success("Decisão e justificativa registradas.");
      } else if (form.id === "appeal-form") {
        S.appeal(key, value("reason"), actor());
        $("#dialog").close();
        render();
        success("Contestação registrada para revisão.");
      } else if (form.id === "account-form") {
        const u = S.get().accounts.find((x) => x.id === key);
        S.account(key, !u.suspended, value("reason"), mode);
        $("#dialog").close();
        render();
        success("Situação da conta atualizada.");
      }
    } catch (error) {
      if (errorEl) errorEl.textContent = error.message;
      else toast(error.message);
    }
  }
  mount();
})();
