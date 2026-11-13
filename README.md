# TableTop

Jogo educativo de resposta a incidentes, com duas fases: conter uma máquina contaminada e investigar três servidores. Inclui animações, orientações, caderno de evidências, classificações, áudio e relatório final.

## Jogar no computador

1. Extraia **todo** o ZIP em uma pasta.
2. Abra `index.html` no Chrome, Edge ou Firefox atualizado.
3. Clique em **Começar**. Esse clique também permite ao navegador ativar o som.

Não precisa instalar Python, Node, Docker ou um servidor. Mantenha a pasta `assets` junto de `index.html`. O ícone de volume permite silenciar e reativar o áudio. Todos os arquivos necessários estão no pacote; depois de extraí-lo, a versão local funciona sem internet.

O áudio das fases 1 e 2 recebeu um reforço de aproximadamente 5 dB. A trilha, os efeitos e a redução da música durante os destaques mantêm o mesmo equilíbrio. O volume percebido também depende do volume do computador e dos fones ou alto-falantes.

Cada aba tem sua própria partida. Nome, progresso, anotações e pontuação existem apenas na memória da página. Atualizar, fechar a aba ou voltar à Fase 1 inicia uma nova partida. Não há login, painel de facilitador, banco de dados, cookies, ranking ou gravação de partidas. O relatório pode ser consultado ao finalizar a tentativa.

## Colocar no GitHub

1. Extraia o ZIP atualizado e abra a pasta `TableTop_Web`.
2. Entre em [github.com](https://github.com/) com sua conta pessoal.
3. No botão **+**, escolha **New repository**.
4. Selecione sua conta pessoal como **Owner**, use `tabletop` como nome e escolha **Public** se quiser divulgar também o código.
5. Deixe desmarcadas as opções para gerar README, `.gitignore` e licença, pois o projeto já contém sua documentação e configuração. Clique em **Create repository**.
6. No repositório vazio, clique em **uploading an existing file**; se já houver arquivos, use **Add file → Upload files**.
7. Arraste o **conteúdo de dentro** de `TableTop_Web`, incluindo as pastas `assets` e `docs`. Não envie o ZIP nem a pasta externa inteira.
8. Escreva `Publicação inicial do TableTop` como mensagem e clique em **Commit changes**.
9. Confira se `index.html`, `vercel.json`, `README.md`, `.gitignore`, `assets/` e `docs/` aparecem na raiz do repositório.

Referências: [criar um repositório](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) e [enviar arquivos pelo navegador](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## Publicar na Vercel

1. Entre em [vercel.com](https://vercel.com/) e escolha **Continue with GitHub**. Para este projeto pessoal e não comercial, use o plano Hobby.
2. No painel, clique em **Add New → Project**.
3. Autorize o acesso ao repositório `tabletop` quando solicitado. Se puder selecionar repositórios específicos, selecione apenas ele.
4. Localize `tabletop` e clique em **Import**.
5. Confira os campos abaixo. O arquivo `vercel.json` já informa a configuração estática.

| Campo | Valor |
| --- | --- |
| Framework Preset | `Other` |
| Root Directory | Raiz do repositório (`./`), onde está `index.html` |
| Build Command | Vazio; ative Override e apague o texto se necessário |
| Output Directory | `.` |
| Install Command | Vazio |
| Environment Variables | Nenhuma |

6. Clique em **Deploy** e aguarde a publicação terminar.
7. Abra o projeto e copie o domínio de produção listado em **Domains**, com formato semelhante a `https://tabletop-seu-nome.vercel.app`. O endereço exato depende da disponibilidade.
8. Abra esse endereço em uma janela anônima e confirme que ele abre sem pedir acesso à sua conta. Clique em **Começar** para ativar o som e teste o jogo. Compartilhe o domínio de produção, não o endereço de uma prévia protegida.

Não é necessário configurar variáveis de ambiente ou banco. As animações, os sons, as duas fases e o relatório funcionam no navegador tanto localmente quanto no site. A versão pública não compartilha o progresso entre visitantes. O som continua sujeito à exigência de interação inicial do navegador.

O plano Hobby atende projetos pessoais e não comerciais, dentro dos limites de uso vigentes. Consulte [a documentação do plano](https://vercel.com/docs/plans/hobby) e [a configuração de sites estáticos](https://vercel.com/docs/builds/configure-a-build).

**Música:** o pacote mantém o MP3 de “Happy”, de Pharrell Williams, fornecido para o projeto. Antes da divulgação pública, verifique a autorização para disponibilizar essa gravação; os créditos não substituem uma licença. Se necessário, use uma faixa com autorização de distribuição e atualize os créditos em `encerramento.js`.

## Compartilhar no LinkedIn e atualizar depois

1. Copie o endereço de produção da Vercel e cole na sua publicação do LinkedIn.
2. Apresente o TableTop como um jogo educativo de resposta a incidentes. Uma imagem ou vídeo curto da partida ajuda a mostrar o funcionamento.
3. Se quiser apresentar também o código, acrescente o endereço do repositório público no GitHub.

Para atualizar o site depois, envie os arquivos alterados ao mesmo repositório e confirme as mudanças na branch de produção, normalmente `main`. A integração da Vercel publica a nova versão automaticamente e mantém o domínio do projeto. [Integração Git](https://vercel.com/docs/git).

## Arquitetura

```text
index.html
  ├─ dados.js → cenário, perguntas e servidores fictícios
  ├─ motor.js → regras e partida em memória
  ├─ participante.js → Fase 1
  ├─ interrogatorio.js → Fase 2 e caderno
  └─ encerramento.js → animação final → relatorio_final.js

CSS → apresentação e animações
apoio_ui.js → som, orientações e integração das telas
```

É um site estático em HTML, CSS e JavaScript, sem dependências externas ou etapa de compilação. As duas fases ficam na mesma página e compartilham o contexto de áudio. O motor substitui as antigas rotas Python por chamadas locais; não existem requisições de jogo para `/api`.

O pacote web não inclui executável, bibliotecas do Windows, Python, Docker, scripts de rede, arquivos de configuração institucional, registros de partidas ou ZIPs internos. Não é necessário Docker para esta edição.

Veja [o mapa dos arquivos e as orientações de desenvolvimento](docs/desenvolvimento.md).
