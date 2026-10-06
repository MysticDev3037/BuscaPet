# Roteiro de demonstração

Tempo sugerido: 6 a 8 minutos, além dos slides.

## Preparação

Abra o projeto sempre no mesmo navegador e endereço. Em Minha área, entre com uma conta de demonstração ou use “Cadastre aqui” para criar um Tutor. O Administrador cria perfis de Colaborador e Moderador. Restaure os exemplos se não precisar dos registros anteriores. Não use telefones, senhas ou fotos reais.

Contas iniciais: admin@buscapet.local / admin123; tutor@buscapet.local / tutor123; colaborador@buscapet.local / colaborador123; moderador@buscapet.local / moderador123.

## 1. Publicar e encontrar

1. Clique em Publicar e Perdi meu pet.
2. Cadastre Luna, gata, sem raça definida, 2 anos.
3. Informe Campo Grande - MS, Centro e próximo à praça.
4. Escreva: “Coleira lilás e uma mancha branca na pata. Exemplo fictício para a apresentação.”
5. Escolha uma data passada ou a data de hoje, confirme o uso das informações e publique.
6. Volte ao início e busque “Luna”. Mostre também o filtro Gatos.
7. Abra os detalhes e recarregue a página. O registro deve permanecer.

Explicação: HTML organiza a interface, CSS mantém a identidade e JavaScript manipula os registros. O navegador guarda um JSON. Não há banco central ou comunicação entre dispositivos. O perfil Tutor representa a pessoa responsável pelo pet.

## 2. Atualizar e reencontrar

1. Abra Luna e registre um avistamento com local, data e observação.
2. Mostre a pista nos detalhes.
3. Clique em Confirmar reencontro e confirme.
4. No início, filtre Reencontrados. O alerta continua no histórico e não aceita novas pistas.

## 3. Denunciar e moderar

1. Abra um exemplo fictício, como Hex, e clique em Denunciar.
2. Selecione Informação falsa e descreva: “Denúncia fictícia para demonstrar a análise de uma publicação.”
3. Mostre o protocolo e o estado Pendente.
4. Saia do Tutor, entre com moderador@buscapet.local e abra o painel.
5. Escolha Ocultar publicação, escreva uma justificativa e registre.
6. Volte à lista e mostre que o alerta ficou indisponível.
7. Saia do Moderador, entre como Tutor, acesse Denúncias e decisões e conteste.
8. Entre novamente como Moderador, escolha Manter / restaurar e explique o motivo.
9. Mostre a publicação restabelecida e o histórico.

Explicação: o painel permite testar a regra de negócio. A proteção real desse painel precisa de autenticação e autorização no servidor.

## 4. Chat local de demonstração

1. Entre em Minha área e abra Conversas no menu lateral.
2. Observe a presença simulada e alterne seu próprio estado online/offline.
3. Abra um contato e envie uma mensagem ou um anexo pequeno; o registro fica neste navegador.
4. Para conferir a conversa como destinatário, saia e entre no outro perfil neste mesmo navegador.

Explique que o chat não entrega mensagens entre pessoas/dispositivos nem atualiza presença em tempo real. O envio real exigirá servidor, autenticação, armazenamento protegido e controles de privacidade.

## 5. Relacionar a parte jurídica à interface

Abra Termos e Privacidade. Mostre que o contato é opcional, que o sistema orienta usar localização aproximada e que a moderação exige justificativa. Explique que termos não eliminam responsabilidades impostas pela lei.

## Perguntas prováveis

**Onde está o banco?** Ainda não implementamos. Os registros ficam no localStorage deste navegador. Modelaremos entidades e relacionamentos antes de conectar uma API.

**Cada perfil tem seu próprio acesso?** A demonstração faz login por e-mail e senha e limita as telas conforme o papel da conta. O Administrador gerencia perfis; Tutores veem e alteram seus próprios alertas; Moderadores acessam a fila de denúncias. Isso é apenas uma simulação no navegador, não uma proteção real. Um servidor deverá validar a identidade e as permissões em toda operação.

**O chat envia mensagens para outras pessoas?** Não pela internet. A demonstração permite registrar mensagens e anexos neste navegador e simular a presença online/offline; não há entrega em tempo real nem entre dispositivos.

**Outra pessoa consegue ver meu alerta?** Não nesta versão. Isso depende do backend e do banco compartilhado.

**Como lidam com denúncias falsas?** Uma denúncia abre análise, não provoca banimento automático. O fluxo registra justificativa e permite contestação. Na operação real, também precisará de atendimento, controles de abuso e cumprimento dos deveres legais aplicáveis.

**Os termos deixam a equipe isenta?** Não. Eles descrevem o serviço e as regras. Responsabilidades legais e direitos dos usuários continuam aplicáveis.

**O mapa funciona?** A demonstração permite buscar e filtrar alertas e avistamentos, selecionar marcadores, arrastar e ampliar o mapa ilustrativo. As pistas fictícias são identificadas. Registros feitos em outra aba da mesma origem atualizam a tela, mas não há GPS, coordenadas reais, servidor ou sincronização entre dispositivos.
