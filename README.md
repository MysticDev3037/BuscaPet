# BuscaPet

Protótipo funcional do Projeto Integrador de Análise e Desenvolvimento de Sistemas.

**Encontrar começa por conectar.**

Esta versão evolui o `index(1).html` fornecido pela equipe. Mantém a identidade roxa, os cards e as telas de referência. Acrescenta regras e interações em JavaScript puro.

## Como abrir

1. Extraia o ZIP inteiro.
2. Abra `index.html` em um navegador moderno com JavaScript habilitado.
3. Entre em **Minha área**, informe um nome fictício e salve o aceite dos termos.
4. Use **Publicar** para cadastrar um pet.

Para desenvolvimento, prefira um servidor estático, por exemplo a extensão Live Server do VS Code ou, com Python instalado, execute na pasta do projeto:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. Use sempre a mesma origem e navegador para manter os mesmos registros. O comportamento de armazenamento em `file://` depende do navegador. Não existe instalação de dependências para usar o aplicativo.

## Layout adaptativo

A identidade roxa e lilás e as fotos dos exemplos seguem o PDF fornecido pela equipe.

- **Desktop a partir de 1024 px:** menu superior, filtros na lateral e cards em duas ou três colunas, conforme o espaço disponível.
- **Tablet de 700 a 1023 px:** duas colunas de cards e filtros recolhíveis acima da lista.
- **Celular até 699 px:** menu fixo inferior, cards em uma coluna, filtros recolhíveis e campos maiores para toque.
- Detalhes e formulários reorganizam suas colunas. As tabelas de moderação viram blocos com rótulos no celular.
- A página usa a largura disponível e rolagem normal, sem uma moldura de telefone no desktop.

Os ajustes atuais estão na **seção 3 de `style.css`**. Os ícones são SVGs locais gerados no JavaScript; o aplicativo não carrega fontes ou bibliotecas externas.

## O que funciona

- Alertas de pet perdido ou encontrado, com foto opcional reduzida no navegador.
- Busca por nome, raça, cidade e região, combinada com filtros de espécie, tipo e situação.
- Detalhes, edição pelo autor, favoritos e confirmação de reencontro.
- Registro de avistamentos com data, hora, local aproximado e observação.
- Denúncias com protocolo, análise, decisão justificada e contestação.
- Painel local com contas de demonstração e histórico das ações.
- Suspensão e reativação simuladas, bloqueando ações do perfil na interface.
- Termos e política de privacidade da demonstração, com registro local de aceite.
- Exportação JSON, restauração dos exemplos e exclusão dos registros locais.

## Limites desta versão

O armazenamento é `localStorage`, sob a chave `buscapet.v2`. **Não existe banco de dados central, servidor de aplicação, login seguro ou autorização no servidor.** Os papéis Tutor, Colaborador e Moderador são selecionáveis para testar os fluxos. Eles não oferecem segurança real. Ao recarregar, o papel volta a Tutor.

Os dados não circulam entre pessoas ou dispositivos. Cada navegador possui seu próprio conjunto de registros. Alterações podem ser feitas pelas ferramentas de desenvolvedor. O mapa e os estabelecimentos continuam ilustrativos. Mensagens diretas, GPS, notificações, pagamentos e atendimento externo ainda não existem.

Use dados fictícios. O protótipo não envia formulários a servidores. Publicar o código no GitHub Pages não implementa um backend. O provedor de hospedagem pode tratar dados técnicos de acesso segundo sua própria política.

## Publicação no GitHub

1. Crie ou abra o repositório escolhido pela equipe.
2. Envie **o conteúdo desta pasta**. Os arquivos `index.html`, `style.css` e `script.js` devem ficar juntos na raiz. Inclua também a pasta `assets`, que contém as fotos dos exemplos.
3. Faça o commit.
4. Para hospedar: Settings → Pages → Build and deployment → Deploy from a branch.
5. Escolha a branch que contém os arquivos, normalmente `main`, e a pasta `/(root)`.
6. Salve e aguarde o endereço informado pelo GitHub.

O arquivo `.nojekyll` permite servir estes arquivos estáticos diretamente. Não envie exportações `buscapet-dados-*.json`, dados pessoais, credenciais ou arquivos locais de testes. O `.gitignore` ajuda a excluir esses itens quando o envio é feito via Git.

Fontes: [configuração do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) e [arquivo de entrada](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), consultadas em 25/09/2026.

## Onde estudar o código

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura das telas, importação do CSS e do JavaScript |
| `style.css` | Cores, cards, formulários e adaptação para celular e desktop |
| `assets/` | Fotos de exemplo extraídas da página 11 do PDF fornecido pela equipe |
| `script.js` | Dados, termos, navegação, formulários, busca, denúncias e moderação |
| `docs/ROTEIRO.md` | Sequência para a demonstração em sala |
| `docs/ARQUITETURA.md` | Explicação da implementação e evolução do banco |
| `docs/JURIDICO.md` | Decisões jurídicas do projeto e pendências |
| `docs/TESTES.md` | Verificações e limites da validação |

O `script.js` está dividido em três partes comentadas. `BPStore` centraliza as alterações dos dados. `BPLegal` contém as minutas. A parte de interface consulta os registros e monta as telas. A função `escape` transforma entradas em texto seguro antes de inseri-las no HTML.

Quando houver API, as operações de `BPStore` poderão chamar o servidor, mantendo os fluxos da interface. Não é preciso instalar framework nem rodar compilação para usar esta versão.

As minutas são acadêmicas e precisam de revisão jurídica antes do lançamento público. O projeto ainda não declara conformidade jurídica integral.
