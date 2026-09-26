# Verificação desta entrega

## Lógica e DOM simulado

Em 25/09/2026, 22 grupos de verificações em jsdom cobriram busca, filtros, aceite, publicação, edição, persistência, favoritos, avistamentos, denúncias, decisões, contestação, restauração, suspensão e reencontro. Também verificaram escape de HTML, falha de espaço sem alteração parcial dos dados, dados inválidos preservados para exportação e ausência de IDs duplicados nas rotas principais.

## Navegador real e layout

A versão foi aberta por HTTP local em Chromium 153, com dados fictícios. Foram executados pela interface:

- Publicação com upload de PNG, conversão para JPEG e leitura após recarregar.
- Busca, filtros, edição, favoritos e avistamento.
- Denúncia, ocultação, contestação e restauração do alerta.
- Suspensão, reativação e confirmação de reencontro.
- Download da exportação JSON, restauração de exemplos e exclusão persistente.

As larguras **320, 390, 699, 700, 768, 1024 e 1440 px** foram verificadas nas telas de início, escolha de publicação, formulário, detalhe, avistamento, denúncia, perfil, termos, privacidade, mapa, serviços e clínica. Não houve rolagem horizontal nessas verificações. O painel de moderação também foi verificado em 320, 390, 768 e 1440 px.

Foram conferidos o menu inferior até 699 px, o menu superior nas demais larguras, abertura e funcionamento dos filtros recolhíveis e ausência de erros JavaScript durante os fluxos. As capturas de desktop e celular foram inspecionadas, incluindo detalhes, formulário e administração.

A versão em arquivo único também foi aberta no Chromium: CSS, JavaScript e três fotos incorporadas carregaram corretamente, e a navegação até o formulário funcionou.

## Limites da validação

As dimensões móveis foram emuladas no Chromium. Isso não substitui uso em celulares físicos nem garante o comportamento de todos os navegadores, especialmente teclado virtual e áreas seguras do iOS. Não houve teste de backend: esta versão continua inteiramente local.

## Conferência antes de apresentar

1. Extraia o projeto inteiro e abra por um servidor estático.
2. Siga o roteiro em `ROTEIRO.md`, usando dados fictícios.
3. Confira no celular que será usado na apresentação, incluindo teclado virtual e rolagem até os botões finais.
4. Use a mesma URL e navegador para manter os mesmos registros locais.

Os testes não demonstram autenticação, segurança de servidor ou conformidade jurídica.
