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
  const DEMO_ALERTS_VERSION = 1;
  const DEMO_SIGHTINGS_VERSION = 1;
  const id = () =>
    "bp-" +
    (globalThis.crypto?.randomUUID?.() ||
      Date.now().toString(36) + Math.random().toString(36).slice(2));
  const today = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };
  const daysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };
  const hoursAgo = (hours) =>
    new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  function demoSightings() {
    return [
      {
        id: "sighting-demo-hex-1",
        alertId: "hex",
        userId: "community",
        place: "Próximo à entrada do Parque das Nações",
        seenAt: hoursAgo(1),
        description:
          "Exemplo fictício: cão dourado visto caminhando perto da entrada do parque.",
        createdAt: hoursAgo(1),
        demo: true,
      },
      {
        id: "sighting-demo-mel-1",
        alertId: "mel-demo",
        userId: "local",
        place: "Região da Praça Ary Coelho",
        seenAt: hoursAgo(3),
        description:
          "Exemplo fictício: cadela caramelo com coleira azul seguindo em direção ao Centro.",
        createdAt: hoursAgo(2),
        demo: true,
      },
      {
        id: "sighting-demo-luna-1",
        alertId: "luna-demo",
        userId: "community",
        place: "Próximo ao Mercado Municipal",
        seenAt: hoursAgo(8),
        description:
          "Exemplo fictício: gato de olhos azuis avistado perto do mercado.",
        createdAt: hoursAgo(7),
        demo: true,
      },
    ];
  }
  function seed() {
    const date = today();
    return {
      version: 2,
      demoAlertsVersion: DEMO_ALERTS_VERSION,
      demoSightingsVersion: DEMO_SIGHTINGS_VERSION,
      profile: {
        id: "local",
        name: "Tutor de demonstração",
        acceptedVersion: null,
        acceptedAt: null,
      },
      session: { userId: null },
      accounts: [
        {
          id: "admin",
          name: "Administrador",
          role: "admin",
          suspended: false,
          email: "admin@buscapet.local",
          password: "admin123",
        },
        {
          id: "local",
          name: "Tutor de demonstração",
          role: "tutor",
          suspended: false,
          email: "tutor@buscapet.local",
          password: "tutor123",
        },
        {
          id: "community",
          name: "Colaborador de demonstração",
          role: "colaborador",
          suspended: false,
          email: "colaborador@buscapet.local",
          password: "colaborador123",
        },
        {
          id: "moderador-demo",
          name: "Moderador de demonstração",
          role: "moderador",
          suspended: false,
          email: "moderador@buscapet.local",
          password: "moderador123",
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
        {
          id: "mel-demo",
          ownerId: "local",
          name: "Mel",
          species: "cao",
          breed: "Labrador",
          age: "2 anos",
          city: "Campo Grande - MS",
          region: "Centro",
          place: "Próximo à Praça Ary Coelho",
          seenDate: daysAgo(1),
          reward: 0,
          description:
            "Cadela caramelo, com coleira azul. Exemplo fictício para demonstração.",
          type: "perdido",
        },
        {
          id: "tico-demo",
          ownerId: "community",
          name: "Tico",
          species: "gato",
          breed: "Sem raça definida",
          age: "1 ano",
          city: "Campo Grande - MS",
          region: "Leste",
          place: "Região do bairro Tiradentes",
          seenDate: daysAgo(2),
          reward: 0,
          description:
            "Gato branco e amarelo, dócil e sem identificação. Exemplo fictício.",
          type: "encontrado",
        },
        {
          id: "amora-demo",
          ownerId: "local",
          name: "Amora",
          species: "cao",
          breed: "Poodle",
          age: "5 anos",
          city: "Campo Grande - MS",
          region: "Bálsamo",
          place: "Próximo ao terminal do bairro",
          seenDate: daysAgo(3),
          reward: 300,
          description:
            "Porte pequeno, pelo escuro e uma mancha branca no peito. Exemplo fictício.",
          type: "perdido",
        },
        {
          id: "luna-demo",
          ownerId: "community",
          name: "Luna",
          species: "gato",
          breed: "Siamês",
          age: "3 anos",
          city: "Campo Grande - MS",
          region: "Centro",
          place: "Próximo ao Mercado Municipal",
          seenDate: daysAgo(4),
          reward: 0,
          description:
            "Gata de olhos azuis, assustada com barulhos. Exemplo fictício.",
          type: "perdido",
        },
        {
          id: "thor-demo",
          ownerId: "local",
          name: "Thor",
          species: "cao",
          breed: "Pastor Alemão",
          age: "4 anos",
          city: "Campo Grande - MS",
          region: "Leste",
          place: "Região do Parque dos Poderes",
          seenDate: daysAgo(5),
          reward: 1000,
          description:
            "Porte grande, usa coleira preta e atende pelo nome. Exemplo fictício.",
          type: "perdido",
        },
        {
          id: "pipoca-demo",
          ownerId: "community",
          name: "Pipoca",
          species: "cao",
          breed: "Sem raça definida",
          age: "Filhote",
          city: "Campo Grande - MS",
          region: "Bálsamo",
          place: "Próximo a uma praça do bairro",
          seenDate: daysAgo(6),
          reward: 0,
          description:
            "Filhote branco com manchas marrons, encontrado com segurança. Exemplo fictício.",
          type: "encontrado",
        },
        {
          id: "nina-demo",
          ownerId: "local",
          name: "Nina",
          species: "gato",
          breed: "Gato rajado",
          age: "6 anos",
          city: "Campo Grande - MS",
          region: "Centro",
          place: "Região da Rua 14 de Julho",
          seenDate: daysAgo(7),
          reward: 0,
          description:
            "Gata rajada, pequena e muito arisca. Exemplo fictício para demonstração.",
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
      sightings: demoSightings(),
      reports: [],
      chatMessages: [],
      chatPresence: { community: true },
      audit: [],
      favorites: [],
    };
  }
  let state,
    issue = "",
    corrupt = false,
    migrateDemoAlerts = false,
    migrateDemoSightings = false;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : seed();
    if (!state.session) state.session = { userId: null };
    if (!Array.isArray(state.accounts)) throw Error("Dados incompatíveis");
    if (!Array.isArray(state.chatMessages)) state.chatMessages = [];
    if (!state.chatPresence || typeof state.chatPresence !== "object")
      state.chatPresence = {};
    if (!Object.prototype.hasOwnProperty.call(state.chatPresence, "community"))
      state.chatPresence.community = true;
    state.accounts = state.accounts.map((u, index) => {
      const role = u.role || (u.id === "local" ? "tutor" : u.id === "community" ? "colaborador" : "moderador");
      const email = u.email || {
        admin: "admin@buscapet.local",
        local: "tutor@buscapet.local",
        community: "colaborador@buscapet.local",
        "moderador-demo": "moderador@buscapet.local",
      }[u.id] || `perfil${index + 1}@buscapet.local`;
      const password = u.password || {
        admin: "admin123",
        local: "tutor123",
        community: "colaborador123",
        "moderador-demo": "moderador123",
      }[u.id] || "123456";
      return {
        ...u,
        role,
        email,
        password,
        phone: u.phone || "",
        address:
          u.address && typeof u.address === "object"
            ? u.address
            : {
                street: "",
                number: "",
                complement: "",
                neighborhood: "",
                postalCode: "",
                city: "",
                state: "",
              },
        profilePhoto: u.profilePhoto || "",
        suspended: !!u.suspended,
        acceptedVersion:
          u.acceptedVersion ||
          (u.id === "local" ? state.profile?.acceptedVersion : null),
        acceptedAt:
          u.acceptedAt || (u.id === "local" ? state.profile?.acceptedAt : null),
      };
    });
    if (
      state.version !== 2 ||
      !Array.isArray(state.alerts) ||
      !Array.isArray(state.reports) ||
      !Array.isArray(state.sightings) ||
      !Array.isArray(state.audit) ||
      !Array.isArray(state.favorites) ||
      !state.profile
    )
      throw Error("Dados incompatíveis");
    if (Number(state.demoAlertsVersion || 0) < DEMO_ALERTS_VERSION) {
      const existingAlertIds = new Set(state.alerts.map((alert) => alert.id));
      state.alerts.push(
        ...seed().alerts.filter((alert) => !existingAlertIds.has(alert.id)),
      );
      state.demoAlertsVersion = DEMO_ALERTS_VERSION;
      migrateDemoAlerts = true;
    }
    if (Number(state.demoSightingsVersion || 0) < DEMO_SIGHTINGS_VERSION) {
      const existingSightingIds = new Set(
        state.sightings.map((sighting) => sighting.id),
      );
      state.sightings.push(
        ...demoSightings().filter(
          (sighting) => !existingSightingIds.has(sighting.id),
        ),
      );
      state.demoSightingsVersion = DEMO_SIGHTINGS_VERSION;
      migrateDemoSightings = true;
    }
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
  if (migrateDemoAlerts || migrateDemoSightings) {
    try {
      save(state);
    } catch (error) {
      issue = error.message;
    }
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
  function assertSignedIn(s, userId) {
    if (!userId || s.session?.userId !== userId)
      throw Error("Entre com a conta responsável por esta ação.");
    assertActive(s, userId);
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
  function profileDetails(data) {
    const name = String(data.name || "").trim().replace(/\s+/g, " ");
    const email = String(data.email || "").trim().toLowerCase();
    const phone = String(data.phone || "").replace(/\D/g, "");
    const source = data.address || {};
    const address = {
      street: String(source.street || "").trim(),
      number: String(source.number || "").trim(),
      complement: String(source.complement || "").trim(),
      neighborhood: String(source.neighborhood || "").trim(),
      postalCode: String(source.postalCode || "").replace(/\D/g, ""),
      city: String(source.city || "").trim(),
      state: String(source.state || "").trim().toUpperCase(),
    };
    if (
      name.split(" ").length < 2 ||
      name.split(" ").some((part) => part.length < 2)
    )
      throw Error("Informe seu nome completo, com nome e sobrenome.");
    if (
      email.length > 254 ||
      !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(
        email,
      )
    )
      throw Error("Informe um endereço de e-mail válido.");
    if (
      ![10, 11].includes(phone.length) ||
      ![
        11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32,
        33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53,
        54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
        79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96,
        97, 98, 99,
      ].includes(Number(phone.slice(0, 2))) ||
      (phone.length === 11 && phone[2] !== "9") ||
      (phone.length === 10 && !/[2-5]/.test(phone[2])) ||
      /^(\d)\1+$/.test(phone) ||
      (phone.length === 11 && /^9(\d)\1{7}$/.test(phone.slice(2))) ||
      (phone.length === 10 && /^[2-5](\d)\1{6}$/.test(phone.slice(2)))
    )
      throw Error("Informe um telefone brasileiro válido com DDD.");
    if (
      !address.street ||
      !address.number ||
      !address.neighborhood ||
      address.postalCode.length !== 8 ||
      !address.city ||
      ![
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
        "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
        "RR", "SC", "SP", "SE", "TO",
      ].includes(address.state)
    )
      throw Error("Preencha todos os campos obrigatórios do endereço.");
    return { name, email, phone, address };
  }
  window.BPStore = {
    KEY,
    POLICY_VERSION,
    id,
    today,
    get: () => JSON.parse(JSON.stringify(state)),
    issue: () => issue,
    syncExternal(raw) {
      if (typeof raw !== "string") return false;
      const next = JSON.parse(raw);
      if (
        next.version !== 2 ||
        !Array.isArray(next.alerts) ||
        !Array.isArray(next.sightings) ||
        !Array.isArray(next.accounts) ||
        !Array.isArray(next.chatMessages)
      )
        throw Error("Os dados atualizados em outra aba são incompatíveis.");
      state = next;
      return true;
    },
    login(email, password) {
      return transaction((s) => {
        const user = s.accounts.find(
          (u) =>
            u.email &&
            u.email.toLowerCase() === String(email || "").trim().toLowerCase(),
        );
        const expectedPassword =
          user?.password ||
          {
            admin: "admin123",
            local: "tutor123",
            community: "colaborador123",
            "moderador-demo": "moderador123",
          }[user?.id] ||
          "123456";
        if (!user || String(expectedPassword) !== String(password || ""))
          throw Error("E-mail ou senha inválidos.");
        if (user.suspended)
          throw Error("Este perfil está suspenso. Consulte a moderação.");
        user.password = expectedPassword;
        s.session = { userId: user.id };
        s.chatPresence[user.id] = true;
        return user;
      });
    },
    logout() {
      return transaction((s) => {
        if (s.session?.userId) s.chatPresence[s.session.userId] = false;
        s.session = { userId: null };
      });
    },
    setChatPresence(isOnline, userId) {
      return transaction((s) => {
        assertSignedIn(s, userId);
        s.chatPresence[userId] = !!isOnline;
      });
    },
    sendChatMessage(recipientId, text, attachment, userId) {
      let result;
      transaction((s) => {
        assertSignedIn(s, userId);
        const recipient = s.accounts.find((u) => u.id === recipientId);
        const body = String(text || "").trim();
        if (!recipient || recipient.id === userId || recipient.suspended)
          throw Error("Este contato não está disponível.");
        if (!body && !attachment)
          throw Error("Escreva uma mensagem ou selecione um anexo.");
        if (body.length > 2000)
          throw Error("A mensagem deve ter no máximo 2.000 caracteres.");
        if (
          attachment &&
          (!["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"].includes(attachment.type) ||
            typeof attachment.data !== "string" ||
            attachment.data.length > 750000 ||
            !attachment.data.startsWith(`data:${attachment.type};base64,`))
        )
          throw Error("Anexo inválido ou maior que 500 KB.");
        result = id();
        s.chatMessages.push({
          id: result,
          senderId: userId,
          recipientId,
          text: body,
          attachment: attachment
            ? {
                name: String(attachment.name).slice(0, 120),
                type: attachment.type,
                data: attachment.data,
              }
            : null,
          createdAt: new Date().toISOString(),
          readAt: null,
        });
      });
      return result;
    },
    markChatRead(contactId, userId) {
      return transaction((s) => {
        assertSignedIn(s, userId);
        const now = new Date().toISOString();
        s.chatMessages.forEach((message) => {
          if (
            message.senderId === contactId &&
            message.recipientId === userId &&
            !message.readAt
          )
            message.readAt = now;
        });
      });
    },
    accept(name, userId) {
      return transaction((s) => {
        const user = s.accounts.find((x) => x.id === userId);
        if (!user || user.role !== "tutor" || s.session?.userId !== userId)
          throw Error("Entre em um perfil de tutor para aceitar os termos.");
        user.name = name;
        user.acceptedVersion = POLICY_VERSION;
        user.acceptedAt = new Date().toISOString();
        if (userId === "local") {
          s.profile.name = name;
          s.profile.acceptedVersion = user.acceptedVersion;
          s.profile.acceptedAt = user.acceptedAt;
        }
      });
    },
    updateProfile(data, userId) {
      return transaction((s) => {
        assertSignedIn(s, userId);
        const user = s.accounts.find((account) => account.id === userId);
        if (!user) throw Error("Perfil não encontrado.");
        const details = profileDetails(data);
        if (
          s.accounts.some(
            (account) =>
              account.id !== userId &&
              account.email?.toLowerCase() === details.email,
          )
        )
          throw Error("Já existe um perfil cadastrado com este e-mail.");
        if (
          data.profilePhoto &&
          (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(
            data.profilePhoto,
          ) ||
            data.profilePhoto.length > 600000)
        )
          throw Error("A foto de perfil está inválida ou é muito grande.");
        Object.assign(user, details, {
          profilePhoto: data.profilePhoto || "",
        });
        if (userId === "local") s.profile.name = details.name;
      });
    },
    changePassword(currentPassword, nextPassword, userId) {
      return transaction((s) => {
        assertSignedIn(s, userId);
        const user = s.accounts.find((account) => account.id === userId);
        if (!user || String(user.password) !== String(currentPassword || ""))
          throw Error("A senha atual não confere.");
        if (String(nextPassword || "").length < 8)
          throw Error("A nova senha deve ter pelo menos 8 caracteres.");
        if (String(nextPassword) === String(currentPassword))
          throw Error("Escolha uma senha diferente da atual.");
        user.password = String(nextPassword);
      });
    },
    createProfile(data) {
      let createdId;
      return transaction((s) => {
        const allowedRoles = ["tutor", "colaborador", "moderador"];
        const role = allowedRoles.includes(data.role) ? data.role : "tutor";
        const creator = s.accounts.find((u) => u.id === s.session?.userId);
        const details = profileDetails(data);
        const password = String(data.password || "");
        if (creator?.role !== "admin" && (creator || role !== "tutor"))
          throw Error("Somente o administrador pode criar perfis de colaborador ou moderador.");
        if (password.length < 8)
          throw Error("A senha deve ter pelo menos 8 caracteres.");
        if (
          s.accounts.some(
            (u) => u.email && u.email.toLowerCase() === details.email,
          )
        )
          throw Error("Já existe um perfil cadastrado com este e-mail.");
        if (
          data.profilePhoto &&
          (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(
            data.profilePhoto,
          ) ||
            data.profilePhoto.length > 600000)
        )
          throw Error("A foto de perfil está inválida ou é muito grande.");
        createdId = id();
        s.accounts.push({
          id: createdId,
          ...details,
          role,
          password,
          profilePhoto: data.profilePhoto || "",
          suspended: false,
          acceptedVersion: null,
          acceptedAt: null,
        });
        log(
          s,
          "Perfil criado",
          createdId,
          `role:${role}`,
          creator?.id || "cadastro-tutor",
        );
      });
    },
    publish(data, userId) {
      let key;
      transaction((s) => {
        assertSignedIn(s, userId);
        const user = s.accounts.find((u) => u.id === userId);
        if (
          user?.role !== "tutor" ||
          (user.acceptedVersion !== POLICY_VERSION &&
            !(userId === "local" &&
              s.profile.acceptedVersion === POLICY_VERSION))
        )
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
        assertSignedIn(s, userId);
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
        assertSignedIn(s, userId);
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
    moderate(key, action, reason) {
      return transaction((s) => {
        const user = s.accounts.find((u) => u.id === s.session?.userId);
        if (!["moderador", "admin"].includes(user?.role))
          throw Error("Entre com um perfil autorizado para moderar.");
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
        log(s, action, r.id, reason, user.id);
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
    account(key, suspended, reason) {
      return transaction((s) => {
        const user = s.accounts.find((u) => u.id === s.session?.userId);
        if (user?.role !== "admin")
          throw Error("Somente o administrador pode gerenciar perfis.");
        const u = s.accounts.find((x) => x.id === key);
        if (!u) throw Error("Conta não encontrada.");
        if (u.role === "admin")
          throw Error("A conta de administrador não pode ser alterada por este painel.");
        if (reason.trim().length < 10)
          throw Error(
            "Informe uma justificativa com pelo menos 10 caracteres.",
          );
        u.suspended = suspended;
        log(s, suspended ? "Suspender conta" : "Reativar conta", key, reason, user.id);
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
  <h2>2. Perfil de demonstração</h2><p>O login local apresenta funções diferentes para tutor, colaborador, moderador e administrador. O administrador pode cadastrar perfis; o tutor pode se cadastrar. Esta separação é apenas visual e não constitui autenticação ou controle de acesso seguro: dados cadastrais, fotos e credenciais ficam no navegador e podem ser alterados por quem o utiliza. Use somente dados fictícios; não informe senhas reais, documentos, endereços residenciais ou contatos reais.</p>
  <h2>3. Publicações e conduta</h2><p>Publique informações de boa-fé e apenas fotos que você possa utilizar. Não publique dados de terceiros sem fundamento adequado. São proibidos golpes, extorsão, ameaças, assédio, discriminação, maus-tratos, venda de animais, spam, acusações sem fundamento e uso abusivo das denúncias. Uma publicação não comprova a guarda ou a propriedade de um animal.</p>
  <h2>4. Contatos, chat e recompensas</h2><p>A divulgação de um contato é opcional e depende de escolha explícita no formulário. O chat é apenas demonstrativo: mensagens e anexos ficam no navegador e não são entregues a outras pessoas. Não use dados pessoais, conteúdo sensível ou anexos reais. O BuscaPet não recebe, transfere, cobra ou garante recompensas. Não faça pagamentos antecipados para receber pistas. Antes de uma entrega, verifique as informações com cautela e procure local seguro.</p>
  <h2>5. Denúncias, medidas e revisão</h2><p>O botão Denunciar registra motivo e descrição e permite acompanhar o resultado. O moderador pode analisar, manter, ocultar ou remover a publicação. Medidas sobre contas exigem justificativa. O autor e quem denunciou podem contestar decisões concluídas. O histórico registra as ações no navegador. Denúncias não geram banimento automático e não são encaminhadas a autoridades nesta versão.</p>
  <h2>6. Limites e responsabilidades</h2><p>Não há garantia de reencontro, de exatidão de conteúdo de terceiros ou de disponibilidade contínua. O usuário responde por seus próprios atos conforme a lei. Estas disposições não afastam direitos dos usuários nem responsabilidades legalmente atribuídas aos responsáveis pela plataforma, inclusive por conduta própria, proteção de dados ou deveres de atuação aplicáveis.</p>
  <h2>7. Dados, aceite e alterações</h2><p>Consulte a Política de Privacidade. O aceite guarda localmente a versão dos termos, o nome de demonstração e a data. Ele não representa autorização genérica para uso de dados. Alterações relevantes deverão ser apresentadas ao usuário. A data deste documento identifica sua versão.</p>
  <h2>8. Canal desta demonstração</h2><p>As denúncias e contestações são exclusivamente locais. O projeto ainda não dispõe de canal externo de atendimento. Antes do lançamento, a equipe deverá identificar o responsável pela operação e disponibilizar contato real e acessível. Não use este protótipo para comunicar emergência ou crime.</p>`,
  privacidade: `<p class="eyebrow">Versão 0.2 acadêmica · 25/09/2026</p><h1>Política de Privacidade</h1>
  <div class="notice warn">Esta política descreve o protótipo local. Uma operação pública exigirá definição do controlador, canal de atendimento, fornecedores, bases legais e prazos de retenção.</div>
  <h2>1. Quais informações ficam salvas</h2><p>Nome completo, e-mail, telefone, endereço, foto opcional do perfil, senha local de demonstração, versão e data de aceite dos termos, dados dos alertas, foto opcional, contato opcional, favoritos, avistamentos, denúncias, contestações, histórico de moderação e, no chat demonstrativo, mensagens e anexos. Use apenas dados fictícios: essas informações ficam no navegador sem proteção adequada e não devem ser dados reais.</p>
  <h2>2. Finalidade</h2><p>Os dados servem para demonstrar publicação, busca, atualização, denúncias e moderação. A foto é reduzida e convertida no navegador. Não há reconhecimento facial, rastreamento por GPS ou análise automatizada de propriedade do animal.</p>
  <h2>3. Armazenamento e acesso</h2><p>O aplicativo usa localStorage e não envia seus formulários a um servidor. Os dados cadastrais, fotos, credenciais, registros, mensagens e anexos ficam no mesmo navegador e origem até exclusão manual, restauração dos exemplos ou limpeza do navegador. A validação de e-mail verifica apenas o formato; não confirma a existência da caixa postal. A presença online/offline e a entrega de mensagens são simuladas e não comunicam com outros dispositivos. Pessoas com acesso ao navegador podem consultar e modificar os dados ou simular outro perfil. Este armazenamento não é adequado a dados reais ou confidenciais.</p>
  <h2>4. Divulgação e compartilhamento</h2><p>A lista exibe dados do animal e local aproximado. O contato só aparece quando sua divulgação é marcada no formulário. Nesta versão, a visibilidade é simulada dentro do navegador. Exportar dados gera um arquivo com todos os registros, inclusive denúncias e histórico. Guarde-o com cuidado e não o envie ao GitHub. Links externos abrem serviços sujeitos às políticas deles. Se hospedado, o provedor da página pode tratar dados de acesso conforme sua própria política.</p>
  <h2>5. Controle dos registros</h2><p>Em Minha área, é possível editar os alertas do tutor de demonstração, exportar registros e apagar os dados locais. Ocultar ou remover uma publicação na moderação não apaga seus registros internos. O botão Apagar dados locais remove também as mensagens e anexos do chat demonstrativo. A plataforma não controla cópias já exportadas.</p>
  <h2>6. Evolução para a operação real</h2><p>O planejamento adota coleta mínima, localização pública aproximada e acesso administrativo restrito. A versão pública precisará mapear uma base legal por finalidade, documentar retenção, oferecer canal para direitos dos titulares, proteger acessos e definir resposta a incidentes. Um chat real exigirá controles de acesso, proteção dos anexos, regras de retenção e mecanismos para lidar com abuso. O aceite dos termos será separado de autorizações opcionais. A faixa etária e as medidas aplicáveis a menores precisarão de avaliação específica.</p>`,
  sobre: `<p class="eyebrow">Projeto Integrador · ADS</p><h1>Sobre esta versão</h1><p>BuscaPet: encontrar começa por conectar.</p>
  <h2>Funciona neste navegador</h2><p>Publicação com foto, edição, busca e filtros, favoritos, detalhes, avistamentos, encerramento, denúncias, decisões justificadas, contestações, suspensão local de perfis, exportação e exclusão dos dados.</p>
  <h2>Simulação identificada</h2><p>Perfis sem login seguro, permissões locais de tutor e moderador, mapa ilustrativo e estabelecimentos de exemplo. Uma suspensão impede ações na interface, mas não impede manipulação pelo navegador.</p>
  <h2>Próximas etapas</h2><p>API, banco de dados, autenticação, autorização no servidor, chat em tempo real e entrega protegida de anexos, mapa real, atendimento às notificações, revisão jurídica e testes com usuários. Mensagens entre pessoas e notificações por proximidade ainda não estão implementadas fora da demonstração local.</p>
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
  const safeChatAttachment = (attachment) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "text/plain",
    ];
    return attachment &&
      allowedTypes.includes(attachment.type) &&
      typeof attachment.data === "string" &&
      attachment.data.length <= 750000 &&
      new RegExp(
        `^data:${attachment.type.replace("/", "\\/")};base64,[A-Za-z0-9+/=]+$`,
      ).test(attachment.data)
      ? attachment
      : null;
  };
  // Ícones vetoriais locais: não dependem de fontes ou de conexão externa.
  function icon(name) {
    const paths = {
      paw: '<ellipse cx="6" cy="8" rx="2" ry="2.7"/><ellipse cx="11" cy="5" rx="2" ry="2.7"/><ellipse cx="17" cy="6" rx="2" ry="2.7"/><ellipse cx="20" cy="11" rx="1.8" ry="2.5"/><path d="M5 18c0-3 4-7 7-7s7 4 7 7c0 5-5 1-7 1s-7 4-7-1Z"/>',
      home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
      dashboard: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
      message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z"/>',
      paperclip: '<path d="m21.4 11.1-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.7 3.7 0 0 1 5.2 5.2l-9.2 9.2a1.8 1.8 0 0 1-2.6-2.6l8.5-8.5"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"/>',
      map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z"/><path d="M9 3v16M15 5v16"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      heart:
        '<path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/>',
      user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/>',
      pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      chevron: '<path d="m6 9 6 6 6-6"/>',
      "chevron-left": '<path d="m15 18-6-6 6-6"/>',
      "chevron-right": '<path d="m9 18 6-6-6-6"/>',
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
  const currentAccount = () => {
    const state = S.get();
    return state.accounts.find((u) => u.id === state.session?.userId) || null;
  };
  let filters = {
      q: "",
      species: "todos",
      type: "todos",
      region: "todos",
      status: "ativo",
    },
    reportFilter = "todas",
    sidebarCollapsed = false,
    timer,
    mapQuery = "",
    mapFilter = "all",
    mapZoom = 1,
    mapPan = { x: 0, y: 0 },
    mapSelection = null;
  let uploadImage = "",
    profileImages = { signup: "", admin: "", profile: "" },
    chatAttachment = null,
    chatAttachmentFor = "",
    routeGeneration = 0,
    imagePending = false;
  const actor = () => currentAccount()?.id || "anonymous";
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
  const title = (heading, sub = "", button = "", headingId = "") =>
    `<div class="page-title"><div><h1 ${headingId ? `id="${escape(headingId)}"` : ""} tabindex="-1">${heading}</h1>${sub ? `<p class="intro">${sub}</p>` : ""}</div>${button}</div>`;
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
  const passwordField = (label, name, id, attrs = "") =>
    `<div class="password-field"><label for="${id}">${label}</label><div class="password-control"><input class="control" id="${id}" type="password" name="${name}" ${attrs}><button type="button" class="password-toggle" data-action="toggle-password" data-id="${id}" aria-label="Mostrar senha" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button></div></div>`;
  // Fotos dos três exemplos originais e imagens locais para os novos alertas.
  const demoPhotos = {
    hex: "assets/hex.png",
    bold: "assets/bold.png",
    gargamel: "assets/gargamel.png",
    "mel-demo": "assets/mel-demo.jpg",
    "tico-demo": "assets/tico-demo.jpg",
    "amora-demo": "assets/amora-demo.jpg",
    "luna-demo": "assets/luna-demo.jpg",
    "thor-demo": "assets/thor-demo.jpg",
    "pipoca-demo": "assets/pipoca-demo.jpg",
    "nina-demo": "assets/nina-demo.jpg",
  };
  function photoSource(a) {
    const uploaded = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(
      a.image || "",
    );
    return uploaded ? a.image : a.demo ? demoPhotos[a.id] || "" : "";
  }
  function photo(a, cls = "photo") {
    const src = photoSource(a);
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
      `<a class="skip-link" href="#home">Pular para o conteúdo</a><header class="app-header"><a class="logo" href="#home" aria-label="BuscaPet, início">${icon("paw")}<span class="wordmark">Busca<strong>Pet</strong></span></a><div class="header-links"><a href="#services">Rede de apoio</a><a href="#sobre">Sobre o projeto</a><span class="mode-pill" id="mode-pill"></span></div></header><div class="accessibility-tools" role="group" aria-label="Recursos de acessibilidade"><span>Acessibilidade</span><button type="button" data-action="text-size" data-value="smaller" aria-label="Diminuir tamanho do texto">A−</button><button type="button" data-action="text-size" data-value="larger" aria-label="Aumentar tamanho do texto">A+</button><button type="button" data-action="contrast" aria-pressed="false">Alto contraste</button></div><div class="storage-warning" id="storage-warning" role="status"></div>`,
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
      if (e.key !== S.KEY || typeof e.newValue !== "string") return;
      try {
        const previous = S.get();
        S.syncExternal(e.newValue);
        const updated = S.get();
        if (location.hash === "#map") renderMap();
        const previousMessages = new Set(
          previous.chatMessages.map((message) => message.id),
        );
        const incomingMessage = updated.chatMessages.find(
          (message) =>
            !previousMessages.has(message.id) &&
            message.recipientId === actor(),
        );
        const previousSightings = new Set(
          previous.sightings.map((sighting) => sighting.id),
        );
        const newSighting = updated.sightings.find(
          (sighting) => !previousSightings.has(sighting.id) && !sighting.demo,
        );
        const previousAlerts = new Set(
          previous.alerts.map((alert) => alert.id),
        );
        const newAlert = updated.alerts.find(
          (alert) => !previousAlerts.has(alert.id) && !alert.demo,
        );
        if (incomingMessage) {
          const sender = updated.accounts.find(
            (account) => account.id === incomingMessage.senderId,
          );
          toast(`Nova conversa de ${sender?.name || "um perfil"}.`);
        } else if (newSighting) {
          const pet = updated.alerts.find(
            (alert) => alert.id === newSighting.alertId,
          );
          toast(`Novo avistamento de ${pet?.name || "um pet"}.`);
        } else if (newAlert) {
          toast(`Novo pet cadastrado: ${newAlert.name}.`);
        } else if (location.hash !== "#map") {
          toast("Os dados foram atualizados em outra aba.");
        }
      } catch (error) {
        toast(error.message);
      }
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
    const chatRouteContact =
      route === "perfil" && String(key).startsWith("chat~")
        ? String(key).slice(5)
        : "";
    if (chatRouteContact !== chatAttachmentFor) {
      chatAttachment = null;
      chatAttachmentFor = chatRouteContact;
    }
    if (["home", "favoritos"].includes(route))
      renderHome(route === "favoritos");
    else if (route === "map") renderMap();
    else if (route === "pet") renderDetail(key);
    else if (route === "post") renderPost();
    else if (route === "publicar") renderForm(key || "perdido");
    else if (route === "editar") renderForm("", key);
    else if (["perfil", "login", "signup", "recovery", "cadastre"].includes(route)) {
      section = "perfil";
      renderProfile(
        route === "cadastre" || route === "signup"
          ? "signup"
          : key || "panorama",
      );
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
      const chatThread = $("#chat-thread", current);
      if (chatThread) chatThread.scrollTop = chatThread.scrollHeight;
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
      currentAccount()?.role === "tutor"
        ? "Tutor de pet · demo"
        : currentAccount()?.role === "moderador"
          ? "Moderação · demo"
          : currentAccount()?.role === "admin"
            ? "Admin · demo"
            : currentAccount()?.role === "colaborador"
              ? "Colaborador · demo"
              : "Visitante";
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
  function mapCoordinates(region, key) {
    const anchors = {
      Centro: { x: 50, y: 46 },
      Leste: { x: 76, y: 36 },
      Bálsamo: { x: 28, y: 66 },
    };
    const anchor = anchors[region] || { x: 52, y: 52 };
    const hash = [...String(key)].reduce(
      (value, char) => (value * 31 + char.charCodeAt(0)) >>> 0,
      7,
    );
    const offsetX = ((hash % 17) - 8) * 1.2;
    const offsetY = ((Math.floor(hash / 17) % 17) - 8) * 1.2;
    return {
      x: Math.min(90, Math.max(10, anchor.x + offsetX)),
      y: Math.min(82, Math.max(18, anchor.y + offsetY)),
    };
  }
  function renderMap() {
    const maparea = $(".maparea", $("#map"));
    if (!maparea) return;
    const s = S.get();
    const alerts = s.alerts.filter(
      (alert) => alert.visibility === "visivel" && alert.status === "ativo",
    );
    const visibleAlertIds = new Set(alerts.map((alert) => alert.id));
    const sightings = s.sightings
      .filter((sighting) => visibleAlertIds.has(sighting.alertId))
      .sort(
        (left, right) =>
          new Date(right.createdAt).valueOf() -
          new Date(left.createdAt).valueOf(),
      );
    const alertById = new Map(alerts.map((alert) => [alert.id, alert]));
    const query = normalize(mapQuery.trim());
    const matches = (alert, sighting = null) =>
      !query ||
      normalize(
        [
          alert.name,
          alert.breed,
          alert.region,
          alert.city,
          alert.place,
          sighting?.place,
          sighting?.description,
        ].join(" "),
      ).includes(query);
    const matchedAlerts = alerts.filter((alert) => matches(alert));
    const matchedSightings = sightings.filter((sighting) =>
      matches(alertById.get(sighting.alertId), sighting),
    );
    const showAlerts = mapFilter !== "sightings";
    const showSightings = mapFilter !== "alerts";
    const eventRows = [
      ...(showSightings
        ? matchedSightings.map((sighting) => ({
            kind: "sighting",
            key: sighting.id,
            alert: alertById.get(sighting.alertId),
            sighting,
            date: sighting.createdAt,
          }))
        : []),
      ...(showAlerts
        ? matchedAlerts.map((alert) => ({
            kind: "alert",
            key: alert.id,
            alert,
            sighting: null,
            date: alert.createdAt,
          }))
        : []),
    ].sort(
      (left, right) =>
        new Date(right.date).valueOf() - new Date(left.date).valueOf(),
    );
    if (
      !eventRows.some(
        (row) => row.kind === mapSelection?.kind && row.key === mapSelection?.key,
      )
    )
      mapSelection = eventRows[0]
        ? { kind: eventRows[0].kind, key: eventRows[0].key }
        : null;
    const selected = eventRows.find(
      (row) => row.kind === mapSelection?.kind && row.key === mapSelection?.key,
    );
    const markers = [
      ...(showAlerts
        ? matchedAlerts.map((alert) => ({
            kind: "alert",
            key: alert.id,
            alert,
            sighting: null,
            coords: mapCoordinates(alert.region, alert.id),
          }))
        : []),
      ...(showSightings
        ? matchedSightings.map((sighting) => {
            const alert = alertById.get(sighting.alertId);
            return {
              kind: "sighting",
              key: sighting.id,
              alert,
              sighting,
              coords: mapCoordinates(alert.region, sighting.id),
            };
          })
        : []),
    ];
    const markerMarkup = markers
      .map(
        ({ kind, key, alert, sighting, coords }) => {
          const image = photoSource(alert);
          return `<button type="button" class="map-marker ${kind === "sighting" ? "is-sighting" : "is-alert"}${sighting?.demo || alert.demo ? " is-demo" : ""}${selected?.kind === kind && selected.key === key ? " is-selected" : ""}" style="left:${coords.x}%;top:${coords.y}%" data-action="map-select" data-kind="${kind}" data-id="${escape(key)}" aria-label="${kind === "sighting" ? `Avistamento de ${escape(alert.name)}: ${escape(sighting.place)}` : `Alerta de ${escape(alert.name)} na região ${escape(alert.region)}`}"><span aria-hidden="true">${image ? `<img src="${escape(image)}" alt="">` : kind === "sighting" ? "◉" : icon("paw")}</span></button>`;
        },
      )
      .join("");
    const filterButton = (value, label) =>
      `<button type="button" class="map-filter${mapFilter === value ? " is-active" : ""}" data-action="map-filter" data-value="${value}" aria-pressed="${mapFilter === value}">${label}</button>`;
    const feedMarkup = matchedSightings.length
      ? matchedSightings
          .slice(0, 12)
          .map((sighting) => {
            const alert = alertById.get(sighting.alertId);
            return `<button type="button" class="map-feed-item${selected?.kind === "sighting" && selected.key === sighting.id ? " is-selected" : ""}" data-action="map-select" data-kind="sighting" data-id="${escape(sighting.id)}"><span class="map-feed-dot" aria-hidden="true"></span><span class="map-feed-copy"><b>${escape(alert.name)} · ${escape(alert.region)}</b><span>${escape(sighting.place)}</span><small>${fmtDate(sighting.createdAt, true)}${sighting.demo ? " · exemplo fictício" : ""}</small></span></button>`;
          })
          .join("")
      : '<p class="map-empty">Nenhum avistamento corresponde à busca. Novas pistas registradas no protótipo aparecerão aqui.</p>';
    const selectedMarkup = selected
      ? `<article class="map-selected"><div><span class="tag ${selected.kind === "sighting" ? "found" : ""}">${selected.kind === "sighting" ? "Avistamento" : selected.alert.type === "perdido" ? "Pet perdido" : "Pet encontrado"}</span><h2>${escape(selected.alert.name)}</h2><p>${escape(selected.kind === "sighting" ? selected.sighting.place : selected.alert.place)} · ${escape(selected.alert.region)}</p>${selected.kind === "sighting" ? `<p>${escape(selected.sighting.description)}</p><small>${fmtDate(selected.sighting.createdAt, true)}${selected.sighting.demo ? " · exemplo fictício" : ""}</small>` : `<small>Alerta demonstrativo · ${fmtDate(selected.alert.createdAt, true)}</small>`}</div><a class="btn secondary small" href="#pet/${safeId(selected.alert.id)}">Abrir alerta</a></article>`
      : '<p class="map-empty">Não há alertas ou avistamentos para mostrar com esses filtros.</p>';
    maparea.innerHTML = `<div class="interactive-map"><header class="map-heading"><div><p class="eyebrow">BuscaPet · Campo Grande - MS</p><h1>Mapa de alertas e avistamentos</h1><p>Explore as regiões e acompanhe as pistas mais recentes.</p></div><span class="map-live"><i aria-hidden="true"></i>Atualizações locais</span></header><div class="map-toolbar"><label class="map-search">${icon("search")}<span class="sr-only">Buscar no mapa</span><input id="map-query" type="search" value="${escape(mapQuery)}" placeholder="Buscar pet, região ou local..."></label><div class="map-filters" role="group" aria-label="Filtrar itens do mapa">${filterButton("all", "Tudo")}${filterButton("alerts", "Alertas")}${filterButton("sightings", "Avistamentos")}</div></div><p class="map-disclaimer">Pontos aproximados por região, sem coordenadas ou endereços exatos. Avistamentos fictícios são identificados na lista.</p><div class="map-layout"><section class="map-column" aria-label="Mapa ilustrativo"><div class="map-stage" id="map-stage"><div class="map-world" id="map-world" style="transform:translate(${mapPan.x}px,${mapPan.y}px) scale(${mapZoom})"><div class="map-block block-a"></div><div class="map-block block-b"></div><div class="map-block block-c"></div><div class="map-block block-d"></div><div class="map-park park-a"></div><div class="map-park park-b"></div><div class="map-road road-a"></div><div class="map-road road-b"></div><div class="map-road road-c"></div><div class="map-river"></div><span class="map-district district-center">CENTRO</span><span class="map-district district-east">LESTE</span><span class="map-district district-balsamo">BÁLSAMO</span>${markerMarkup}</div><div class="map-zoom-controls" aria-label="Controles de zoom">${button("+", "map-zoom-in", "", "secondary small")}${button("−", "map-zoom-out", "", "secondary small")}${button("Centralizar", "map-reset", "", "secondary small")}</div><span class="map-scale-label">Arraste para explorar · zoom ${Math.round(mapZoom * 100)}%</span></div>${selectedMarkup}</section><aside class="map-feed"><div class="map-feed-heading"><div><h2>Avistamentos recentes</h2><p>${matchedSightings.length} ${matchedSightings.length === 1 ? "pista registrada" : "pistas registradas"}</p></div><span class="map-live map-live-small"><i aria-hidden="true"></i>local</span></div><div class="map-feed-list">${feedMarkup}</div><p class="map-local-note">Atualizado automaticamente nesta origem quando uma pista é registrada em outra aba. Não sincroniza entre dispositivos.</p></aside></div></div>`;
    const stage = $("#map-stage", maparea);
    const world = $("#map-world", maparea);
    if (!stage || !world) return;
    let drag = null;
    stage.addEventListener("pointerdown", (event) => {
      if (
        event.button !== 0 ||
        event.target.closest("button") ||
        event.target.closest("a")
      )
        return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        panX: mapPan.x,
        panY: mapPan.y,
      };
      stage.classList.add("is-panning");
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      mapPan.x = drag.panX + event.clientX - drag.startX;
      mapPan.y = drag.panY + event.clientY - drag.startY;
      world.style.transform = `translate(${mapPan.x}px,${mapPan.y}px) scale(${mapZoom})`;
    });
    const stopDragging = (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag = null;
      stage.classList.remove("is-panning");
    };
    stage.addEventListener("pointerup", stopDragging);
    stage.addEventListener("pointercancel", stopDragging);
  }
  function renderDetail(key) {
    const s = S.get(),
      a = s.alerts.find((x) => x.id === key),
      own = a?.ownerId === actor() && currentAccount()?.role === "tutor";
    if (!a || (a.visibility !== "visivel" && !own && currentAccount()?.role !== "moderador" && currentAccount()?.role !== "admin"))
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
  function identityFields(account = {}, prefix = "profile") {
    const address = account.address || {};
    const states = [
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
      "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
      "RR", "SC", "SP", "SE", "TO",
    ];
    const previewId = `${prefix}-photo-preview`;
    return `<div class="form-grid identity-fields"><p class="form-section-title full">Identificação e contato</p>${field("Nome completo *", "name", account.name || "", 'required minlength="5" maxlength="100" autocomplete="name" placeholder="Ex.: Ana Maria da Silva"')} ${field("E-mail *", "email", account.email || "", 'required maxlength="254" autocomplete="email" placeholder="nome@exemplo.com"', "email")} ${field("Telefone com DDD *", "phone", account.phone || "", 'required inputmode="tel" autocomplete="tel" minlength="10" maxlength="15" placeholder="(67) 99999-9999"')}<p class="hint full">Usamos apenas para identificação neste protótipo. Informe um número fictício.</p><p class="form-section-title full">Endereço completo</p>${field("CEP *", "postalCode", address.postalCode || "", 'required inputmode="numeric" autocomplete="postal-code" maxlength="9" placeholder="79000-000"')} ${field("Rua / avenida *", "street", address.street || "", 'required maxlength="100" autocomplete="address-line1" placeholder="Nome da via"')} ${field("Número *", "number", address.number || "", 'required maxlength="15" autocomplete="address-line2" placeholder="Número"')} ${field("Complemento", "complement", address.complement || "", 'maxlength="60" placeholder="Apartamento, bloco (opcional)"')} ${field("Bairro *", "neighborhood", address.neighborhood || "", 'required maxlength="60" autocomplete="address-level3"')} ${field("Cidade *", "city", address.city || "", 'required maxlength="60" autocomplete="address-level2"')}<label>Estado (UF) *<select class="control" name="state" required autocomplete="address-level1"><option value="">Selecione</option>${states.map((state) => `<option value="${state}" ${address.state === state ? "selected" : ""}>${state}</option>`).join("")}</select></label><label class="full profile-photo-field">Foto de perfil (opcional)<input class="control" type="file" id="${prefix}-photo-input" data-photo-key="${prefix}" data-preview="${previewId}" accept="image/jpeg,image/png,image/webp"><span class="hint">JPG, PNG ou WebP, até 8 MB. A foto é reduzida e guardada apenas neste navegador.</span><img class="photo-preview profile-photo-preview" id="${previewId}" alt="Prévia da foto do perfil" ${profileImages[prefix] ? `src="${escape(profileImages[prefix])}"` : "hidden"}></label><button type="button" class="plain remove-profile-photo full" data-action="remove-profile-photo" data-photo-key="${prefix}" data-preview="${previewId}">Remover foto do perfil</button></div>`;
  }
  function identityData(value, photoKey) {
    return {
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      address: {
        street: value("street"),
        number: value("number"),
        complement: value("complement"),
        neighborhood: value("neighborhood"),
        postalCode: value("postalCode"),
        city: value("city"),
        state: value("state"),
      },
      profilePhoto: profileImages[photoKey] || "",
    };
  }
  function renderForm(type, key = "", embedded = false) {
    const other = document.getElementById(key ? "publicar" : "editar");
    if (other) other.innerHTML = "";
    const a = key ? S.get().alerts.find((x) => x.id === key) : null;
    if (
      currentAccount()?.role !== "tutor" ||
      (key && (!a || a.ownerId !== actor() || a.visibility !== "visivel"))
    )
      return page(
        key ? "editar" : "publicar",
        `<div class="page narrow">${empty("Perfil de tutor necessário", "A publicação e a edição pertencem ao tutor de demonstração.")}<a class="btn primary" href="#perfil">Abrir Minha área</a></div>`,
      );
    type =
      a?.type || (["perdido", "encontrado"].includes(type) ? type : "perdido");
    uploadImage = a?.image || "";
    const formMarkup = `<div class="page narrow form-page"><a href="${embedded ? "#perfil/publish" : "#post"}" class="back-link">‹ Voltar</a>${title(key ? "Editar alerta" : type === "perdido" ? "Meu pet desapareceu" : "Encontrei um pet", "Os campos com * são obrigatórios.")}${stateNotice()}<form class="form" id="alert-form" data-id="${escape(key)}"><input type="hidden" name="type" value="${type}"><div class="form-grid">${field("Nome ou identificação *", "name", a?.name || "", 'required maxlength="60" placeholder="Ex.: Luna ou Cão caramelo"')}<label>Espécie *<select class="control" name="species" required>${Object.entries(
        species,
      )
        .map(
          ([v, n]) =>
            `<option value="${v}" ${a?.species === v ? "selected" : ""}>${n}</option>`,
        )
        .join(
          "",
        )}</select></label>${field("Raça ou aparência", "breed", a?.breed || "", 'maxlength="60" placeholder="Ex.: sem raça definida"')}${field("Idade aproximada", "age", a?.age || "", 'maxlength="25" placeholder="Ex.: 2 anos"')}${field("Cidade / UF *", "city", a?.city || "", 'required maxlength="80" placeholder="Ex.: Campo Grande - MS"')}${field("Bairro ou região *", "region", a?.region || "", 'required maxlength="60" placeholder="Ex.: Centro"')}${field("Ponto de referência *", "place", a?.place || "", 'required maxlength="120" placeholder="Use um local aproximado"')}${field("Data em que foi visto *", "seenDate", a?.seenDate || S.today(), `required max="${S.today()}"`, "date")}<label class="full">Descrição e características *<textarea class="control" name="description" required minlength="10" maxlength="1200" placeholder="Cor, coleira, comportamento e informações que ajudem na identificação">${escape(a?.description || "")}</textarea></label>${field("Recompensa opcional (R$)", "reward", a?.reward || "", 'min="0" max="1000000" step="0.01" placeholder="0,00"', "number")}${field("Contato fictício opcional", "contact", a?.contact || "", 'maxlength="100" placeholder="Somente para testar a apresentação"')}<label class="check-label full"><input type="checkbox" name="contactPublic" ${a?.contactPublic ? "checked" : ""}><span>Quero mostrar o contato informado no alerta.<span class="hint">A escolha é opcional. Para o protótipo, informe apenas dados fictícios.</span></span></label><label class="full">Foto opcional<input class="control" type="file" id="photo-input" accept="image/jpeg,image/png,image/webp"><span class="hint">JPG, PNG ou WebP, até 8 MB. A foto será reduzida e salva neste navegador.</span><img class="photo-preview" id="photo-preview" alt="Prévia da foto" ${uploadImage ? `src="${uploadImage}"` : "hidden"}></label><div class="full">${button("Remover foto", "remove-photo", "", "secondary small")}</div></div><label class="check-label"><input type="checkbox" name="contentRights" required><span>Confirmo que posso usar a foto e as informações e que não estou expondo dados de terceiros indevidamente.</span></label>${!key && S.get().profile.acceptedVersion !== S.POLICY_VERSION ? '<label class="check-label"><input type="checkbox" name="acceptTerms" required><span>Aceito os <a href="#termos" target="_blank">Termos de Uso</a> e li a <a href="#privacidade" target="_blank">Política de Privacidade</a> da demonstração.</span></label>' : ""}<div class="form-error" role="alert"></div><div class="actions"><button class="btn primary" type="submit">${key ? "Salvar alterações" : "Publicar alerta"}</button><a class="btn secondary" href="${embedded ? "#perfil/my-alerts" : "#home"}">Cancelar</a></div></form></div>`;
    if (embedded) return formMarkup;
    page(key ? "editar" : "publicar", formMarkup);
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
    page("denuncias", `<div class="page narrow">${reportsContent()}</div>`);
  }
  function reportsContent() {
    const s = S.get(),
      list = s.reports.filter(
        (r) =>
          r.by === actor() ||
          s.alerts.find((a) => a.id === r.alertId)?.ownerId === actor(),
      );
    return `${title("Denúncias e decisões", "Acompanhe suas denúncias e decisões sobre seus alertas.")}${list.length ? list.map((r) => reportCard(r)).join("") : empty("Nenhuma denúncia", "As denúncias deste perfil aparecerão aqui.")}`;
  }
  function renderProfile(view = "perfil") {
    if (currentAccount() && String(view).startsWith("chat~")) {
      let contactId = "";
      try {
        contactId = decodeURIComponent(String(view).slice(5));
      } catch (error) {
        throw Error("Este contato não está disponível.");
      }
      if (contactId) S.markChatRead(contactId, actor());
    }
    const s = S.get();
    const sessionUser = s.session?.userId
      ? s.accounts.find((u) => u.id === s.session.userId)
      : null;
    const activeRole = sessionUser?.role || "";
    const mine = s.alerts.filter((a) => a.ownerId === actor()),
      accepted =
        (sessionUser?.acceptedVersion ||
          (sessionUser?.id === "local" ? s.profile.acceptedVersion : null)) ===
        S.POLICY_VERSION,
      adminProfiles = s.accounts.filter((u) => u.role !== "admin");
    const loginForm = `
      <form class="form login-form" id="login-form">
        <label>E-mail<input class="control" type="email" name="email" required placeholder="seuemail@exemplo.com"></label>
        ${passwordField("Senha", "password", "login-password", 'required placeholder="Digite sua senha"')}
        <div class="form-error" role="alert"></div>
        <div class="login-actions">
          <button class="btn primary">Entrar</button>
          <button type="button" class="btn secondary" data-action="forgot-password">Esqueci minha senha</button>
        </div>
        <div class="login-signup"><span>Ainda não tem acesso?</span><a class="btn secondary" href="#cadastre">Sou novo, quero me cadastrar</a></div>
      </form>`;
    profileImages.signup = "";
    const signupForm = `
      <form class="form signup-form" id="signup-form">
        <div class="notice warn">Protótipo local: informe dados fictícios. Validamos o formato do e-mail e do telefone, mas não confirmamos a caixa postal, a titularidade do número nem a existência do endereço.</div>
        ${identityFields({}, "signup")}
        <p class="form-section-title">Criar senha</p>
        ${passwordField("Senha *", "password", "signup-password", 'minlength="8" required autocomplete="new-password" placeholder="Mínimo 8 caracteres"')}
        <div class="form-error" role="alert"></div>
        <div class="actions signup-actions"><button class="btn primary">Cadastrar perfil</button><a class="btn secondary" href="#perfil">Voltar para entrar</a></div>
      </form>`;
    profileImages.admin = "";
    const adminForm = `
      <form class="form signup-form" id="admin-profile-form">
        <h2 class="section-heading">Cadastro de perfis</h2>
        ${identityFields({}, "admin")}
        ${passwordField("Senha inicial *", "password", "admin-password", 'minlength="8" required autocomplete="new-password"')}
        <label>Tipo de perfil<select class="control" name="role"><option value="tutor">Tutor (responsável pelo pet)</option><option value="colaborador">Colaborador</option><option value="moderador">Moderador</option></select></label>
        <div class="form-error" role="alert"></div>
        <button class="btn primary">Criar perfil</button>
      </form>`;
    const roleDetails = {
      tutor: {
        label: "Tutor do pet",
        description: "Publique alertas e acompanhe os pets sob sua responsabilidade.",
        steps: ["Complete seu perfil e aceite os termos.", "Publique um alerta com localização aproximada.", "Acompanhe pistas e atualizações em Meus alertas."],
        links: [
          ["Publicar alerta", "Cadastre um pet perdido ou encontrado.", "#post"],
          ["Meus alertas", "Acompanhe e atualize suas publicações.", "my-alerts"],
          ["Denúncias e decisões", "Acompanhe registros e decisões relacionados a você.", "#denuncias"],
        ],
      },
      colaborador: {
        label: "Colaborador",
        description: "Ajude a comunidade compartilhando pistas e encontrando alertas.",
        steps: ["Explore os alertas e filtre por região.", "Registre uma pista relevante em um alerta.", "Acompanhe suas denúncias e decisões."],
        links: [
          ["Ver alertas", "Busque pets perdidos ou encontrados.", "browse-alerts"],
          ["Meus favoritos", "Volte rapidamente aos alertas que salvou.", "my-favorites"],
          ["Denúncias e decisões", "Acompanhe os registros enviados por você.", "#denuncias"],
        ],
      },
      moderador: {
        label: "Moderador",
        description: "Analise denúncias e registre decisões justificadas.",
        steps: ["Abra a fila de moderação.", "Analise o contexto da publicação.", "Registre uma decisão clara e sua justificativa."],
        links: [
          ["Abrir moderação", "Consulte a fila e o histórico de decisões.", "#admin"],
          ["Denúncias e decisões", "Consulte as denúncias e contestações.", "#denuncias"],
        ],
      },
      admin: {
        label: "Administrador",
        description: "Gerencie os perfis e acompanhe a operação demonstrativa.",
        steps: ["Cadastre Tutor, Colaborador ou Moderador.", "Revise a situação dos perfis cadastrados.", "Acesse a moderação quando precisar acompanhar denúncias."],
        links: [
          ["Gerenciar perfis", "Crie e consulte perfis de acesso.", "profile-management"],
          ["Abrir moderação", "Consulte denúncias e o histórico administrativo.", "#admin"],
        ],
      },
    };
    const details = roleDetails[activeRole] || roleDetails.colaborador;
    const alertCount = mine.length;
    const reportCount = s.reports.filter(
      (r) =>
        r.by === actor() ||
        mine.some((a) => a.id === r.alertId),
    ).length;
    const overviewStats =
      activeRole === "admin"
        ? [
            [s.accounts.filter((u) => !u.suspended).length, "Perfis ativos"],
            [s.reports.length, "Denúncias totais"],
            [s.alerts.length, "Alertas cadastrados"],
          ]
        : activeRole === "moderador"
          ? [
              [s.reports.filter((r) => r.status === "pendente").length, "Denúncias pendentes"],
              [s.reports.filter((r) => r.status === "em_analise").length, "Em análise"],
              [s.reports.filter((r) => r.status === "em_revisao").length, "Em revisão"],
            ]
          : activeRole === "colaborador"
            ? [
                [s.alerts.filter((a) => a.visibility === "visivel").length, "Alertas disponíveis"],
                [s.alerts.filter((a) => a.status === "ativo" && a.visibility === "visivel").length, "Em busca"],
                [reportCount, "Denúncias enviadas"],
              ]
            : [
                [alertCount, alertCount === 1 ? "Alerta seu" : "Alertas seus"],
                [reportCount, reportCount === 1 ? "Denúncia relacionada" : "Denúncias relacionadas"],
                [accepted ? "OK" : "Pendente", "Aceite dos termos"],
              ];
    const selectedView = [
      "panorama",
      "my-profile",
      "my-alerts",
      "browse-alerts",
      "my-favorites",
      "profile-management",
      "demo-data",
      "moderation",
      "reports",
      "terms",
      "privacy",
      "services",
      "about",
      "publish",
      "publish-lost",
      "publish-found",
      "chat",
    ].includes(view) || view.startsWith("chat~")
      ? view
      : "panorama";
    const chatContacts = s.accounts.filter(
      (account) => account.id !== sessionUser?.id && !account.suspended,
    );
    let chatContactId = "";
    if (selectedView.startsWith("chat~")) {
      try {
        chatContactId = decodeURIComponent(selectedView.slice(5));
      } catch (error) {
        throw Error("Este contato não está disponível.");
      }
    }
    const activeChatContact = chatContacts.find(
      (account) => account.id === chatContactId,
    );
    const chatMessages = activeChatContact
      ? s.chatMessages.filter(
          (message) =>
            (message.senderId === sessionUser.id &&
              message.recipientId === activeChatContact.id) ||
            (message.senderId === activeChatContact.id &&
              message.recipientId === sessionUser.id),
        ).map((message) => ({
          ...message,
          attachment: safeChatAttachment(message.attachment),
        }))
      : [];
    const menuItems = [
      ["Panorama", "Resumo da conta e primeiros passos.", "panorama", "dashboard"],
      ...details.links.map(([label, description, target]) => [
        label,
        description,
        target === "profile-management" || target === "my-alerts"
          ? target
          : target,
        target === "profile-management"
          ? "users"
          : target === "my-alerts"
            ? "paw"
            : target === "#denuncias" || target === "#admin"
              ? "file"
              : target === "#post"
                ? "plus"
                : target === "#favoritos"
                  ? "heart"
                  : "home",
      ]),
      [
        "Meu perfil",
        "Atualize seus dados, foto e senha.",
        "my-profile",
        "user",
      ],
      ["Conversas", "Troque mensagens e deixe recados com anexo.", "chat", "message"],
      ["Dados da demonstração", "Exportação e gestão dos dados locais.", "demo-data", "settings"],
      ...[
        ["Denúncias e decisões", "Acompanhe denúncias e decisões.", "#denuncias", "file"],
        ["Termos de Uso", "Consulte as regras da demonstração.", "#termos", "file"],
        ["Privacidade", "Veja como os dados locais são tratados.", "#privacidade", "file"],
        ["Rede de apoio", "Consulte os recursos demonstrativos.", "#services", "heart"],
        ["Sobre esta versão", "Conheça o escopo e os limites do protótipo.", "#sobre", "file"],
      ].filter(([label]) => !details.links.some(([existing]) => existing === label)),
    ];
    const profileLinks = menuItems
      .map(([label, description, destination, iconName]) => {
        const internalDestination =
          destination === "#denuncias"
            ? "reports"
            : destination === "#admin"
              ? "moderation"
              : destination === "#termos"
                ? "terms"
                : destination === "#privacidade"
                  ? "privacy"
                  : destination === "#services"
                    ? "services"
                    : destination === "#sobre"
                      ? "about"
                        : destination === "#post"
                          ? "publish"
              : destination;
        const isInternal = !internalDestination.startsWith("#");
        const href = isInternal
          ? `#perfil/${internalDestination}`
          : internalDestination;
        const current =
          isInternal &&
          (internalDestination === selectedView ||
            (internalDestination === "publish" &&
              selectedView.startsWith("publish-")) ||
            (internalDestination === "chat" &&
              selectedView.startsWith("chat~")))
            ? ' aria-current="page"'
            : "";
        return `<a class="profile-shortcut${isInternal ? " dashboard-menu-link" : ""}" href="${href}" aria-label="${escape(label)}" title="${escape(description)}"${current}>${icon(iconName)}<span class="menu-label">${escape(label)}</span></a>`;
      })
      .join("");
    const overview = sessionUser ? `
      <section class="dashboard-overview" aria-labelledby="dashboard-title">
        <p class="eyebrow">Panorama geral · ${details.label}</p>
        ${title(`Olá, ${escape(sessionUser.name)}`, details.description, "", "dashboard-title")}
        <div class="dashboard-stats" aria-label="Resumo da conta">
          ${overviewStats.map(([value, label]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join("")}
        </div>
        <section class="onboarding-panel" aria-labelledby="onboarding-title">
          <div><p class="eyebrow">Primeiros passos</p><h2 id="onboarding-title">Comece por aqui</h2></div>
          <ol>${details.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
        </section>
      </section>` : "";
    const visibleAlerts = s.alerts.filter(
      (alert) => alert.visibility === "visivel",
    );
    const favoriteAlerts = visibleAlerts.filter((alert) =>
      s.favorites.includes(alert.id),
    );
    profileImages.profile = sessionUser?.profilePhoto || "";
    const profilePanel = sessionUser
      ? `<section class="dashboard-section dashboard-view-panel"><p class="eyebrow">Conta e identificação</p><h1>Meu perfil</h1><p class="intro">Mantenha seus dados cadastrais atualizados. Use informações fictícias nesta demonstração local.</p><form class="form signup-form" id="profile-form">${identityFields(sessionUser, "profile")}${activeRole === "tutor" ? `<label class="check-label"><input type="checkbox" name="terms" required ${accepted ? "checked" : ""}><span>Aceito os <a href="#termos">Termos de Uso</a> e li a <a href="#privacidade">Política de Privacidade</a> desta demonstração.</span></label>` : ""}<div class="form-error" role="alert"></div><button class="btn primary">Salvar dados cadastrais</button>${activeRole === "tutor" && accepted ? `<p class="hint">Aceite registrado em ${fmtDate(sessionUser.acceptedAt || s.profile.acceptedAt, true)}. Versão ${escape(sessionUser.acceptedVersion || s.profile.acceptedVersion)}.</p>` : ""}</form><form class="form password-update-form" id="password-form"><h2 class="section-heading">Trocar senha</h2><p class="hint">A senha é local e não pode ser recuperada por e-mail nesta versão.</p>${passwordField("Senha atual *", "currentPassword", "current-password", 'required autocomplete="current-password"')}${passwordField("Nova senha *", "newPassword", "new-password", 'required minlength="8" autocomplete="new-password" placeholder="Mínimo 8 caracteres"')}${passwordField("Confirmar nova senha *", "confirmPassword", "confirm-password", 'required minlength="8" autocomplete="new-password"')}<div class="form-error" role="alert"></div><button class="btn secondary">Atualizar senha</button></form></section>`
      : "";
    const menuInfo =
      selectedView === "my-profile"
        ? ""
        : selectedView === "browse-alerts"
        ? `<section class="dashboard-view-panel"><p class="eyebrow">Ajude a comunidade</p>${title("Ver alertas", "Pets perdidos e encontrados que estão visíveis para a comunidade.")}<div class="list alert-grid">${visibleAlerts.length ? visibleAlerts.map(card).join("") : empty("Nenhum alerta disponível", "Os alertas publicados aparecerão aqui.")}</div></section>`
        : selectedView === "my-favorites"
          ? `<section class="dashboard-view-panel"><p class="eyebrow">Sua lista pessoal</p>${title("Meus favoritos", "Alertas que você salvou para acompanhar.")}<div class="list alert-grid">${favoriteAlerts.length ? favoriteAlerts.map(card).join("") : empty("Você ainda não tem favoritos", "Abra Ver alertas e salve os anúncios que deseja acompanhar.")}</div></section>`
      : selectedView === "publish"
        ? `<section class="dashboard-view-panel"><p class="eyebrow">Uma informação pode ajudar</p>${title("Encontrou ou perdeu um pet?", "Escolha o tipo de alerta para começar.")}<div class="choices"><a class="choice" href="#perfil/publish-lost"><span class="choiceicon">${icon("paw")}</span><div><h3>Perdi meu pet</h3><p>Informe características e o último local visto.</p></div><b>›</b></a><a class="choice" href="#perfil/publish-found"><span class="choiceicon">${icon("heart")}</span><div><h3>Encontrei um pet</h3><p>Ajude a localizar a pessoa responsável.</p></div><b>›</b></a></div><div class="notice">Use a região ou um ponto de referência. Evite endereço residencial e dados pessoais de terceiros.</div></section>`
        : selectedView === "publish-lost" || selectedView === "publish-found"
          ? `<section class="dashboard-view-panel">${renderForm(selectedView === "publish-lost" ? "perdido" : "encontrado", "", true)}</section>`
          : selectedView === "terms" ||
      selectedView === "privacy" ||
      selectedView === "about"
        ? `<section class="dashboard-view-panel"><article class="legal">${window.BPLegal[{ terms: "termos", privacy: "privacidade", about: "sobre" }[selectedView]]}</article></section>`
        : selectedView === "services"
          ? `<section class="dashboard-view-panel">${title("Rede de apoio", "Estabelecimentos ilustrativos do protótipo original.")}<div class="notice">Os dados abaixo são exemplos, sem validação comercial. A busca e o cadastro de serviços serão desenvolvidos em outra etapa.</div>${$("#services .list")?.outerHTML || empty("Rede de apoio indisponível", "Não foi possível carregar os estabelecimentos demonstrativos.")}</section>`
          : selectedView === "chat"
            ? `<section class="dashboard-view-panel chat-view"><div class="chat-heading"><div><p class="eyebrow">Mensagens da demonstração</p><h1>Conversas</h1></div><button type="button" class="presence-toggle" data-action="toggle-chat-presence" aria-pressed="${!!s.chatPresence[sessionUser.id]}"><span class="presence-dot ${s.chatPresence[sessionUser.id] ? "online" : ""}"></span>Você está ${s.chatPresence[sessionUser.id] ? "online" : "offline"} <span class="hint">(simulado)</span></button></div><div class="notice">Protótipo local: as mensagens e anexos ficam somente neste navegador. A presença e o envio em tempo real são simulados; outras pessoas não recebem mensagens pela internet.</div><div class="chat-contacts" aria-label="Contatos disponíveis">${chatContacts.length ? chatContacts.map((contact) => { const conversation = s.chatMessages.filter((message) => (message.senderId === contact.id && message.recipientId === sessionUser.id) || (message.senderId === sessionUser.id && message.recipientId === contact.id)); const latest = conversation[conversation.length - 1]; const unread = conversation.filter((message) => message.senderId === contact.id && message.recipientId === sessionUser.id && !message.readAt).length; const isOnline = !!s.chatPresence[contact.id];             const preview = latest ? latest.text || `Anexo: ${latest.attachment?.name || "arquivo"}` : contact.role === "tutor" ? "Tutor de pet" : contact.role === "admin" ? "Administrador" : contact.role === "moderador" ? "Moderador" : "Colaborador"; return `<a class="chat-contact" href="#perfil/chat~${encodeURIComponent(contact.id)}"><span class="chat-avatar" aria-hidden="true">${escape(contact.name.slice(0, 1).toUpperCase())}</span><span class="chat-contact-copy"><b>${escape(contact.name)}</b><small><i class="presence-dot ${isOnline ? "online" : ""}"></i>${isOnline ? "Online · simulado" : "Offline"}</small><span>${escape(preview)}</span></span>${unread ? `<b class="chat-unread" aria-label="${unread} mensagens não lidas">${unread}</b>` : ""}</a>`; }).join("") : empty("Nenhum contato disponível", "Outros perfis cadastrados aparecerão aqui.")}</div></section>`
            : selectedView.startsWith("chat~")
              ? `<section class="dashboard-view-panel chat-view"><a class="back-link" href="#perfil/chat">‹ Todas as conversas</a>${activeChatContact ? `<div class="chat-heading"><div><h1>${escape(activeChatContact.name)}</h1><p><i class="presence-dot ${s.chatPresence[activeChatContact.id] ? "online" : ""}"></i>${s.chatPresence[activeChatContact.id] ? "Online · simulado" : "Offline · você pode deixar um recado"}</p></div></div><div class="notice">As mensagens são salvas apenas neste navegador. Não envie informações pessoais ou sensíveis.</div><div class="chat-thread" id="chat-thread" role="log" aria-live="polite" aria-label="Mensagens da conversa">${chatMessages.length ? chatMessages.map((message) => { const mine = message.senderId === sessionUser.id; const sender = mine ? sessionUser.name : activeChatContact.name; return `<article class="chat-bubble ${mine ? "mine" : "theirs"}"><b>${escape(sender)}</b>${message.text ? `<p>${escape(message.text)}</p>` : ""}${message.attachment ? `<a class="chat-attachment" href="${message.attachment.data}" download="${escape(message.attachment.name)}" target="_blank" rel="noopener noreferrer">${icon("paperclip")} ${escape(message.attachment.name)}</a>` : ""}<small>${fmtDate(message.createdAt, true)}</small></article>`; }).join("") : empty("Inicie a conversa", "Escreva uma mensagem ou deixe um recado com anexo.")}</div><form class="chat-compose" id="chat-form" data-id="${escape(activeChatContact.id)}"><label for="chat-message">Mensagem</label><textarea class="control" id="chat-message" name="message" maxlength="2000" placeholder="Escreva uma mensagem..."></textarea><label class="chat-file-label" for="chat-attachment">${icon("paperclip")} Anexar arquivo</label><input class="sr-only" id="chat-attachment" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"><span class="chat-file-name" id="chat-file-name">${chatAttachment ? escape(chatAttachment.name) : "Anexo opcional: imagem, PDF ou texto; até 500 KB."}</span><div class="form-error" role="alert"></div><button class="btn primary">${icon("message")} Enviar mensagem</button></form>` : empty("Contato indisponível", "Escolha outra pessoa na lista de conversas.")}</section>`
              : "";
    let pageContent = !sessionUser
      ? view === "signup"
        ? `<div class="page login-page signup-page"><section class="login-panel login-panel-signup">${title("Cadastro de tutor de pet", "Crie seu próprio acesso como responsável por um animal.")}${signupForm}</section></div>`
        : `<div class="page login-page"><section class="login-panel">${title("Minha área", "Faça login para acessar os perfis do sistema.")}<div class="notice warn">Acesso por e-mail e senha simulados. Use os perfis cadastrados para testar o fluxo.</div>${loginForm}</section></div>`
      : `<div class="page profile-dashboard">
          <div class="dashboard-layout${sidebarCollapsed ? " sidebar-collapsed" : ""}">
            <aside class="profile-sidebar">
              <div class="sidebar-heading"><button type="button" class="sidebar-toggle" data-action="sidebar-toggle" aria-label="${sidebarCollapsed ? "Expandir menu" : "Recolher menu"}" title="${sidebarCollapsed ? "Expandir menu" : "Recolher menu"}" aria-expanded="${!sidebarCollapsed}">${icon(sidebarCollapsed ? "chevron-right" : "chevron-left")}</button><h2>Menu</h2></div>
              <div class="sidebar-identity"><span class="sidebar-avatar" aria-hidden="true">${sessionUser.profilePhoto ? `<img src="${escape(sessionUser.profilePhoto)}" alt="">` : escape(sessionUser.name.slice(0, 1).toUpperCase())}</span><div><b>${escape(sessionUser.name)}</b><span>${details.label}</span></div></div>
              <nav class="profile-shortcuts" aria-label="Menu da área do perfil">${profileLinks}</nav>
              <div class="sidebar-footer">${button(`<span class="sidebar-logout-icon" aria-hidden="true">↪</span><span class="menu-label">Sair</span>`, "logout", "", "secondary")}</div>
            </aside>
            <main class="dashboard-main">${stateNotice()}<div class="dashboard-panels">
              ${selectedView === "panorama" ? overview : ""}
              ${selectedView === "my-profile" ? profilePanel : ""}
              ${activeRole === "tutor" && selectedView === "my-alerts" ? `<section class="dashboard-section dashboard-view-panel"><h1>Meus alertas</h1><div class="list alert-grid">${mine.length ? mine.map(card).join("") : empty("Nenhum alerta", "Publique um pet para começar.")}</div></section>` : ""}
              ${activeRole === "admin" && selectedView === "profile-management" ? `<section class="dashboard-section dashboard-view-panel"><h1>Gestão de perfis</h1>${adminForm}<div class="table-wrap"><table class="data-table"><thead><tr><th>Perfil</th><th>Tipo</th><th>E-mail</th><th>Situação</th></tr></thead><tbody>${adminProfiles.length ? adminProfiles.map((u) => `<tr><td>${escape(u.name)}</td><td>${escape(u.role)}</td><td>${escape(u.email || "-")}</td><td>${u.suspended ? "Suspenso" : "Ativo"}</td></tr>`).join("") : '<tr><td colspan="4">Nenhum perfil criado ainda.</td></tr>'}</tbody></table></div></section>` : ""}
              ${((activeRole === "admin" || activeRole === "moderador") && selectedView === "moderation") ? `<section class="dashboard-view-panel">${moderationContent()}</section>` : ""}
              ${selectedView === "reports" ? `<section class="dashboard-view-panel">${reportsContent()}</section>` : ""}
              ${selectedView === "demo-data" ? `<section class="dashboard-section dashboard-view-panel"><h1>Dados da demonstração</h1><p class="hint">Exportar inclui todos os dados locais, denúncias e histórico. Não envie esse arquivo ao GitHub.</p><div class="actions">${button("Exportar dados", "export")}${button("Restaurar exemplos", "reset")}${button("Apagar dados locais", "erase", "", "danger")}</div></section>` : ""}
            </div></main>
          </div>
        </div>`;
    if (sessionUser && menuInfo) {
      const insertionPoint = pageContent.lastIndexOf("</div></main>");
      if (insertionPoint < 0)
        throw Error("Não foi possível exibir esta opção no menu da área.");
      pageContent =
        pageContent.slice(0, insertionPoint) +
        menuInfo +
        pageContent.slice(insertionPoint);
    }
    page("perfil", pageContent);
  }
  function renderAdmin() {
    if (!["moderador", "admin"].includes(currentAccount()?.role))
      return page(
        "admin",
        `<div class="page narrow">${empty("Acesso restrito", "Entre com um perfil de Moderador ou Administrador para abrir o painel.")}<a href="#perfil" class="btn primary">Minha área</a></div>`,
      );
    page("admin", `<div class="page">${moderationContent()}</div>`);
  }
  function moderationContent() {
    if (!["moderador", "admin"].includes(currentAccount()?.role))
      return `${empty("Acesso restrito", "Entre com um perfil de Moderador ou Administrador para abrir o painel.")}<a href="#perfil" class="btn primary">Minha área</a>`;
    const s = S.get(),
      reports = s.reports.filter(
        (r) => reportFilter === "todas" || r.status === reportFilter,
      );
    return `<p class="eyebrow">Administração do BuscaPet</p>${title("Moderação", "Denúncias, decisões justificadas e histórico de ações.")}<div class="notice warn">Painel local de demonstração. Autenticação e autorização ainda são simuladas.</div><div class="stats"><div><b>${s.reports.filter((r) => r.status === "pendente").length}</b><span>Pendentes</span></div><div><b>${s.reports.filter((r) => ["em_analise", "em_revisao"].includes(r.status)).length}</b><span>Em análise ou revisão</span></div><div><b>${s.reports.filter((r) => r.status === "concluida").length}</b><span>Concluídas</span></div></div><label>Filtrar denúncias <select class="control" id="report-filter" style="max-width:300px"><option value="todas">Todas</option>${Object.entries(
        statuses,
      )
        .map(
          ([v, n]) =>
            `<option value="${v}" ${reportFilter === v ? "selected" : ""}>${n}</option>`,
        )
        .join("")}</select></label>${reports.length ? reports.map((r) => reportCard(r, true)).join("") : empty("Nenhuma denúncia nesta fila", "Envie uma denúncia em um alerta para testar o fluxo.")}${currentAccount()?.role === "admin" ? `<h2 class="section-heading">Contas de demonstração</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Perfil</th><th>Situação</th><th>Medida</th></tr></thead><tbody>${s.accounts.filter((u) => u.role !== "admin").map((u) => `<tr><td>${escape(u.name)}</td><td>${u.suspended ? "Suspenso" : "Ativo"}</td><td>${button(u.suspended ? "Reativar" : "Suspender", "account", u.id, "secondary small")}</td></tr>`).join("")}</tbody></table></div>` : ""}<h2 class="section-heading">Registro de ações</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Quando</th><th>Quem / ação</th><th>Referência</th><th>Justificativa</th></tr></thead><tbody>${s.audit.length ? s.audit.map((e) => `<tr><td>${fmtDate(e.at, true)}</td><td>${escape(e.actor)}<br><b>${escape(e.action)}</b></td><td>${escape(e.target.slice(-8))}</td><td>${escape(e.reason)}</td></tr>`).join("") : '<tr><td colspan="4">Nenhuma ação registrada.</td></tr>'}</tbody></table></div>`;
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
      if (action === "map-select") {
        mapSelection = { kind: target.dataset.kind, key };
      if (target.dataset.kind === "sighting" && mapFilter === "alerts")
        mapFilter = "all";
      renderMap();
      } else if (action === "map-filter") {
        mapFilter = target.dataset.value;
        renderMap();
      } else if (action === "map-zoom-in") {
        mapZoom = Math.min(1.8, mapZoom + 0.15);
        renderMap();
      } else if (action === "map-zoom-out") {
        mapZoom = Math.max(0.75, mapZoom - 0.15);
        renderMap();
      } else if (action === "map-reset") {
        mapZoom = 1;
        mapPan = { x: 0, y: 0 };
        renderMap();
      } else if (action === "toggle-password") {
        const input = document.getElementById(key);
        if (!input) throw Error("Campo de senha indisponível.");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        target.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
        target.setAttribute("aria-pressed", String(show));
      } else if (action === "sidebar-toggle") {
        const layout = target.closest(".dashboard-layout");
        if (!layout) throw Error("O menu da área do perfil não está disponível.");
        sidebarCollapsed = !sidebarCollapsed;
        layout.classList.toggle("sidebar-collapsed", sidebarCollapsed);
        target.innerHTML = icon(
          sidebarCollapsed ? "chevron-right" : "chevron-left",
        );
        target.setAttribute(
          "aria-label",
          sidebarCollapsed ? "Expandir menu" : "Recolher menu",
        );
        target.setAttribute(
          "aria-expanded",
          String(!sidebarCollapsed),
        );
        target.title = sidebarCollapsed ? "Expandir menu" : "Recolher menu";
      } else if (action === "toggle-chat-presence") {
        const online = !target.getAttribute("aria-pressed").includes("true");
        S.setChatPresence(online, actor());
        render();
        success(
          online
            ? "Presença marcada online (simulada)."
            : "Presença marcada offline (simulada).",
        );
      } else if (action === "dashboard-scroll") {
        const section = document.getElementById(key);
        if (!section) throw Error("Esta seção do painel não está disponível.");
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (action === "text-size") {
        const larger = target.dataset.value === "larger";
        document.documentElement.classList.toggle("a11y-large-text", larger);
        document.documentElement.classList.toggle("a11y-small-text", !larger);
      } else if (action === "contrast") {
        const enabled = document.documentElement.classList.toggle("a11y-high-contrast");
        target.setAttribute("aria-pressed", String(enabled));
      } else if (action === "favorite") {
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
      } else if (action === "logout") {
        S.logout();
        render();
        success("Sessão encerrada.");
      } else if (action === "forgot-password") {
        toast("A recuperação por e-mail não está disponível. Se ainda conseguir entrar, atualize a senha em Meu perfil.");
      } else if (action === "remove-profile-photo") {
        const preview = document.getElementById(target.dataset.preview);
        profileImages[target.dataset.photoKey] = "";
        if (preview) {
          preview.removeAttribute("src");
          preview.hidden = true;
        }
        const input = target
          .closest("form")
          ?.querySelector(`input[data-photo-key="${target.dataset.photoKey}"]`);
        if (input) input.value = "";
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
          "Alertas, fotos, denúncias, mensagens, anexos, favoritos, aceite e histórico deste navegador serão apagados. Cópias exportadas não são afetadas.",
          "confirm-erase",
        );
      else if (action === "confirm-reset" || action === "confirm-erase") {
        action === "confirm-reset" ? S.reset() : S.erase();
        $("#dialog").close();
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
    if (e.target.id === "map-query") {
      const cursor = e.target.selectionStart;
      mapQuery = e.target.value;
      renderMap();
      const search = $("#map-query");
      search?.focus({ preventScroll: true });
      search?.setSelectionRange(cursor, cursor);
    } else if (e.target.id === "query") {
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
    } else if (e.target.id === "chat-attachment") {
      const file = e.target.files[0];
      if (!file) return;
      const generation = routeGeneration,
        contactId = e.target.closest("#chat-form")?.dataset.id || "";
      try {
        if (
          ![
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "text/plain",
          ].includes(file.type)
        )
          throw Error("Anexe uma imagem JPG, PNG, WebP, PDF ou arquivo de texto.");
        if (file.size > 500 * 1024)
          throw Error("O anexo deve ter até 500 KB.");
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(Error("Não foi possível ler o anexo."));
          reader.readAsDataURL(file);
        });
        if (
          generation !== routeGeneration ||
          contactId !== chatAttachmentFor
        )
          return;
        chatAttachment = {
          name: file.name,
          type: file.type,
          data,
        };
        $("#chat-file-name").textContent = file.name;
      } catch (error) {
        chatAttachment = null;
        e.target.value = "";
        toast(error.message);
      }
    } else if (
      e.target.id === "photo-input" ||
      e.target.matches('input[type="file"][data-preview]')
    ) {
      const file = e.target.files[0];
      if (!file) return;
      const generation = routeGeneration;
      const preview = document.getElementById(
        e.target.dataset.preview || "photo-preview",
      );
      const profileKey = e.target.dataset.photoKey;
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
          if (generation === routeGeneration && preview?.isConnected) {
            if (profileKey) profileImages[profileKey] = result;
            else uploadImage = result;
            preview.src = result;
            preview.hidden = false;
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
      if (form.id === "chat-form") {
        if (imagePending) throw Error("Aguarde o processamento do anexo.");
        const isNewConversation = !S.get().chatMessages.some(
          (message) =>
            (message.senderId === actor() && message.recipientId === key) ||
            (message.senderId === key && message.recipientId === actor()),
        );
        S.sendChatMessage(key, value("message"), chatAttachment, actor());
        chatAttachment = null;
        goto("#perfil/chat~" + encodeURIComponent(key));
        success(
          isNewConversation
            ? `Nova conversa iniciada com ${S.get().accounts.find((account) => account.id === key)?.name || "o perfil"}.`
            : "Nova mensagem salva neste navegador.",
        );
      } else if (form.id === "login-form") {
        const email = value("email");
        const password = value("password");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          throw Error("Informe um e-mail válido.");
        if (password.length < 6)
          throw Error("A senha deve ter pelo menos 6 caracteres.");
        const user = S.login(email, password);
        render();
        success("Login realizado com sucesso.");
      } else if (form.id === "signup-form") {
        if (imagePending) throw Error("Aguarde o processamento da foto.");
        const details = identityData(value, "signup");
        const password = value("password");
        S.createProfile({ ...details, password, role: "tutor" });
        S.login(details.email, password);
        goto("#perfil");
        render();
        success("Perfil de tutor cadastrado com sucesso.");
      } else if (form.id === "admin-profile-form") {
        if (imagePending) throw Error("Aguarde o processamento da foto.");
        const role = value("role") || "tutor";
        S.createProfile({
          ...identityData(value, "admin"),
          password: value("password"),
          role,
        });
        render();
        success("Perfil criado pelo administrador.");
      } else if (form.id === "profile-form") {
        if (imagePending) throw Error("Aguarde o processamento da foto.");
        if (currentAccount()?.role === "tutor" && !fd.has("terms"))
          throw Error("Leia e aceite os termos da demonstração.");
        S.updateProfile(identityData(value, "profile"), actor());
        if (currentAccount()?.role === "tutor") S.accept(value("name"), actor());
        render();
        success("Dados cadastrais atualizados.");
      } else if (form.id === "password-form") {
        if (value("newPassword") !== value("confirmPassword"))
          throw Error("A confirmação da nova senha não confere.");
        S.changePassword(value("currentPassword"), value("newPassword"), actor());
        render();
        success("Senha atualizada neste navegador.");
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
        const signedInAccount = currentAccount();
        const hasAcceptedTerms =
          signedInAccount?.acceptedVersion === S.POLICY_VERSION ||
          (signedInAccount?.id === "local" &&
            S.get().profile.acceptedVersion === S.POLICY_VERSION);
        if (!key && !hasAcceptedTerms) {
          if (!fd.has("acceptTerms"))
            throw Error(
              "Leia e aceite os termos da demonstração antes de publicar.",
            );
          S.accept(currentAccount().name, actor());
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
        goto(
          form.closest(".dashboard-view-panel")
            ? "#perfil/my-alerts"
            : "#pet/" + safeId(result),
        );
        success(
          key
            ? "Alerta atualizado."
            : `Novo pet cadastrado: ${value("name")}.`,
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
        success(`Novo avistamento registrado para ${S.get().alerts.find((alert) => alert.id === key)?.name || "o pet"}.`);
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
        S.moderate(key, value("decision"), value("reason"));
        render();
        success("Decisão e justificativa registradas.");
      } else if (form.id === "appeal-form") {
        S.appeal(key, value("reason"), actor());
        $("#dialog").close();
        render();
        success("Contestação registrada para revisão.");
      } else if (form.id === "account-form") {
        const u = S.get().accounts.find((x) => x.id === key);
        S.account(key, !u.suspended, value("reason"));
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
