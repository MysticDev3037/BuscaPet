# Roteiro de demonstração

Tempo sugerido: 6 a 8 minutos, além dos slides.

## Preparação

Abra o projeto sempre no mesmo navegador e endereço. Em Minha área, restaure os exemplos se não precisar dos registros anteriores. Salve um perfil fictício e o aceite dos termos. Não use telefones ou fotos de pessoas reais.

## 1. Publicar e encontrar

1. Clique em Publicar e Perdi meu pet.
2. Cadastre Luna, gata, sem raça definida, 2 anos.
3. Informe Campo Grande - MS, Centro e próximo à praça.
4. Escreva: “Coleira lilás e uma mancha branca na pata. Exemplo fictício para a apresentação.”
5. Escolha uma data passada ou a data de hoje, confirme o uso das informações e publique.
6. Volte ao início e busque “Luna”. Mostre também o filtro Gatos.
7. Abra os detalhes e recarregue a página. O registro deve permanecer.

Explicação: HTML organiza a interface, CSS mantém a identidade e JavaScript manipula os registros. O navegador guarda um JSON. Não há banco central ou comunicação entre dispositivos.

## 2. Atualizar e reencontrar

1. Abra Luna e registre um avistamento com local, data e observação.
2. Mostre a pista nos detalhes.
3. Clique em Confirmar reencontro e confirme.
4. No início, filtre Reencontrados. O alerta continua no histórico e não aceita novas pistas.

## 3. Denunciar e moderar

1. Abra um exemplo fictício, como Hex, e clique em Denunciar.
2. Selecione Informação falsa e descreva: “Denúncia fictícia para demonstrar a análise de uma publicação.”
3. Mostre o protocolo e o estado Pendente.
4. Em Minha área, alterne para Moderador e abra o painel.
5. Escolha Ocultar publicação, escreva uma justificativa e registre.
6. Volte à lista e mostre que o alerta ficou indisponível.
7. Retorne a Tutor, entre em Denúncias e decisões e conteste.
8. Volte a Moderador, escolha Manter / restaurar e explique o motivo.
9. Mostre a publicação restabelecida e o histórico.

Explicação: o painel permite testar a regra de negócio. A proteção real desse painel precisa de autenticação e autorização no servidor.

## 4. Relacionar a parte jurídica à interface

Abra Termos e Privacidade. Mostre que o contato é opcional, que o sistema orienta usar localização aproximada e que a moderação exige justificativa. Explique que termos não eliminam responsabilidades impostas pela lei.

## Perguntas prováveis

**Onde está o banco?** Ainda não implementamos. Os registros ficam no localStorage deste navegador. Modelaremos entidades e relacionamentos antes de conectar uma API.

**O administrador está protegido?** Ainda não. O seletor de papéis é explícito para demonstrar o fluxo. O servidor deverá verificar permissões em toda operação administrativa.

**Outra pessoa consegue ver meu alerta?** Não nesta versão. Isso depende do backend e do banco compartilhado.

**Como lidam com denúncias falsas?** Uma denúncia abre análise, não provoca banimento automático. O fluxo registra justificativa e permite contestação. Na operação real, também precisará de atendimento, controles de abuso e cumprimento dos deveres legais aplicáveis.

**Os termos deixam a equipe isenta?** Não. Eles descrevem o serviço e as regras. Responsabilidades legais e direitos dos usuários continuam aplicáveis.

**O mapa funciona?** A tela preserva o conceito visual. Coordenadas, geolocalização e provedor de mapas são uma próxima etapa.
