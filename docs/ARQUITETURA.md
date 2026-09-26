# Arquitetura e evolução

## Escolha técnica

JavaScript puro permite evoluir o HTML existente com pouca configuração e estudar cada operação. Um framework poderia organizar componentes em uma aplicação maior, mas aumentaria o processo de instalação nesta etapa.

Não usamos localStorage como substituto definitivo de um banco. Ele permite testar o comportamento e a persistência no mesmo navegador. A foto é convertida para JPEG, reduzida a no máximo 900 pixels no maior lado e armazenada como data URL. Há limite de 8 MB na entrada e de aproximadamente 600 mil caracteres na imagem convertida. Falhas de espaço produzem mensagem e preservam o estado anterior da transação.

## Organização dos três arquivos

`index.html` carrega as telas, `style.css` define a aparência e `script.js` concentra a aplicação. Dentro do JavaScript, BPStore guarda e altera dados, BPLegal contém as minutas, e a última seção controla navegação, renderização e eventos.

## Navegação

A URL usa fragmentos como `#home`, `#pet/hex` e `#admin`. O evento `hashchange` seleciona a tela e monta seu conteúdo. A lista e o detalhe consultam o mesmo objeto do alerta, evitando cópias inconsistentes.

## Adaptação de tela

CSS Grid organiza o catálogo e os formulários. As media queries em 699, 1023 e 1199 pixels ajustam navegação, filtros e quantidade de colunas. O elemento nativo `details` permite abrir os filtros com toque ou teclado; `matchMedia` mantém a lateral aberta no desktop ao mudar o tamanho da janela.

Existe uma única navegação principal. O CSS a posiciona no cabeçalho ou no rodapé conforme o tamanho da tela. O JavaScript acrescenta rótulos às células das tabelas para que elas permaneçam compreensíveis quando empilhadas no celular. `viewport-fit=cover` e `safe-area-inset-bottom` reservam espaço para a área inferior do dispositivo.

Os alertas de exemplo usam fotos da pasta `assets`. Fotos novas continuam com a conversão e persistência locais já descritas. A versão de arquivo único distribuída separadamente incorpora CSS, JavaScript e imagens para facilitar a abertura.

## Estruturas atuais

| Coleção | Campos e papel |
|---|---|
| `profile` | Nome fictício, versão e data do aceite |
| `accounts` | Dois perfis locais e flag de suspensão |
| `alerts` | Autor, animal, tipo, local, data, descrição, foto e situação |
| `sightings` | Referência ao alerta, autor local, local, momento e observação |
| `reports` | Alerta, denunciante, motivo, estado, decisão e contestação |
| `audit` | Ação, ator, alvo, justificativa e data |
| `favorites` | Identificadores dos alertas favoritos neste navegador |

O alerta possui duas situações diferentes: `status` indica ativo ou reencontrado, enquanto `visibility` indica visível, oculto ou removido da lista. Assim, encerrar uma busca não se confunde com remover conteúdo pela moderação.

O fluxo de denúncia utiliza pendente, em análise, concluída e em revisão. Uma decisão concluída pode receber contestação. O histórico acompanha as decisões anteriores.

## Regras demonstradas

- O tutor precisa aceitar a versão dos termos antes de publicar.
- Só o perfil autor pode editar ou encerrar seu alerta na interface.
- Uma conta suspensa não pode publicar, registrar pistas ou denúncias.
- Alertas encerrados não recebem novos avistamentos.
- Alertas ocultos ou removidos deixam a lista pública simulada.
- Denúncias repetidas em andamento do mesmo perfil são recusadas.
- Decisões e medidas sobre contas exigem justificativa.
- Campos de texto são escapados antes de inserção no HTML.

Essas verificações são regras locais. Elas não representam uma fronteira de segurança: o usuário pode alterar qualquer dado do navegador.

## Modelo inicial para o backend

Uma modelagem candidata deve separar Usuario, Pet, Alerta, Avistamento, Denuncia, DecisaoModeracao, AceiteTermo e Favorito. Usuario pode criar vários alertas, um alerta pode receber vários avistamentos e denúncias, e uma denúncia pode ter várias decisões. O relacionamento de favoritos é N:N entre usuários e alertas.

Isso é uma proposta para discussão, não um banco implementado. A definição de retenção e a minimização de dados também influenciarão as tabelas.

## Próximas tarefas

1. Definir responsáveis pela operação, faixa etária e escopo público.
2. Revisar requisitos, minutas jurídicas e critérios de moderação.
3. Modelar o banco e implementar API com validação de entrada.
4. Implementar login, sessões e autorização em cada operação.
5. Armazenar fotos em serviço apropriado, com validação e controle de acesso.
6. Proteger registros administrativos, retenção e cópias de segurança.
7. Integrar mapa real, avaliar geolocalização opcional e compartilhamento.
8. Testar com usuários e revisar acessibilidade, segurança e tratamento de incidentes.
