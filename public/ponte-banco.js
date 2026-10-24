// ponte-banco.js - Conecta o projeto original ao PostgreSQL

// 1. Puxa os pets do banco assim que a página abre
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/pets');
        const petsDoBanco = await response.json();
        
        if (petsDoBanco.length > 0) {
            const s = window.BPStore.get();
            
            // Formata os dados do banco para o padrão que o GitHub usa
            const petsFormatados = petsDoBanco.map(p => ({
                id: "db-" + p.id,
                ownerId: "local",
                name: p.nome,
                species: p.especie === 'cão' ? 'cao' : p.especie,
                breed: p.raca || 'Sem raça',
                age: p.idade ? p.idade + ' anos' : '',
                city: p.cidade || 'Campo Grande - MS',
                region: p.regiao || 'Centro',
                place: p.bairro || 'Local não informado',
                seenDate: new Date().toISOString().split('T')[0],
                reward: p.recompensa || 0,
                description: p.descricao || '',
                type: p.status === 'encontrado' ? 'encontrado' : 'perdido',
                status: "ativo",
                visibility: "visivel",
                createdAt: new Date().toISOString(),
                demo: false
            }));
            
            // Junta com os exemplos que já existem na tela
            const idsExistentes = new Set(s.alerts.map(a => a.id));
            const novosPets = petsFormatados.filter(p => !idsExistentes.has(p.id));
            
            if (novosPets.length > 0) {
                s.alerts = [...novosPets, ...s.alerts];
                localStorage.setItem('buscapet.v2', JSON.stringify(s));
                // Força a tela a atualizar
                window.dispatchEvent(new Event('storage'));
                location.reload(); 
            }
        }
    } catch (error) {
        console.error("Erro ao buscar do banco:", error);
    }
});

// 2. Intercepta quando alguém publica um pet ou cria uma conta
setTimeout(() => {
    if (!window.BPStore) return;
    
    // Guarda a função original
    const originalSave = window.BPStore.get; 
    
    // Nós "hackeamos" o localStorage para saber quando o BPStore salva algo novo
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        
        if (key === 'buscapet.v2') {
            try {
                const estadoAntigo = JSON.parse(localStorage.getItem('__estado_antigo') || '{"alerts":[],"accounts":[]}');
                const novoEstado = JSON.parse(value);
                
                // Verifica se adicionou um PET
                if (novoEstado.alerts && novoEstado.alerts.length > estadoAntigo.alerts.length) {
                    const novoPet = novoEstado.alerts[0];
                    fetch('/api/pets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nome: novoPet.name,
                            especie: novoPet.species === 'cao' ? 'cão' : novoPet.species,
                            raca: novoPet.breed,
                            idade: parseInt(novoPet.age) || null,
                            cidade: novoPet.city,
                            regiao: novoPet.region,
                            bairro: novoPet.place,
                            recompensa: novoPet.reward,
                            descricao: novoPet.description,
                            status: novoPet.type
                        })
                    }).then(res => res.json()).then(data => console.log('✅ Pet salvo no PostgreSQL:', data));
                }
                
                // Verifica se adicionou um USUÁRIO
                if (novoEstado.accounts && novoEstado.accounts.length > estadoAntigo.accounts.length) {
                    const novoUser = novoEstado.accounts[novoEstado.accounts.length - 1];
                    fetch('/api/cadastro', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nome: novoUser.name,
                            email: novoUser.email,
                            senha: novoUser.password,
                            telefone: novoUser.phone || '00000000000'
                        })
                    }).then(res => res.json()).then(data => console.log('✅ Usuário salvo no PostgreSQL:', data));
                }
                
                originalSetItem.call(localStorage, '__estado_antigo', JSON.stringify(novoEstado));
            } catch (e) {
                console.error("Erro na ponte:", e);
            }
        }
    };
}, 1000); // Espera 1 segundo para o script original carregar