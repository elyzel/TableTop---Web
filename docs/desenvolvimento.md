# Desenvolvimento do TableTop

## Mapa completo dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Entrada do jogo, estrutura da Fase 1, área da Fase 2 e ordem de carregamento dos scripts. |
| `vercel.json` | Configura a publicação estática, sem compilação. |
| `.gitignore` | Exclui configurações locais da Vercel e arquivos temporários do controle de versão. |
| `README.md` | Uso local, publicação, arquitetura e comportamento dos dados. |
| `docs/desenvolvimento.md` | Este mapa e orientações para manutenção. |
| `assets/js/dados.js` | Cenário da Fase 1, catálogo de perguntas e fichas fictícias dos servidores. Carregado como JavaScript para permitir abrir o jogo por duplo clique, sem servidor. |
| `assets/js/motor.js` | Estado em memória, tempo, objetivos, pontuação, sorteio do infectado, pistas, consultas, notas, classificações, acusação e passagem entre fases. |
| `assets/js/participante.js` | Abertura, phishing simulado, ações e resultado da Fase 1. Incorpora os antigos ajustes separados dessa fase. |
| `assets/js/interrogatorio.js` | Abertura da Fase 2, investigação, prontuário, caderno, classificação e resultado técnico. Os desenhos dos servidores são SVG gerados pelo próprio script. |
| `assets/js/apoio_ui.js` | Contexto de áudio, música sintetizada durante o jogo, efeitos, volume, orientações e integração visual. |
| `assets/js/controle_animacao.js` | Ciclo das animações, indicador, temporizadores e esperas canceláveis. |
| `assets/js/bloqueio_animacoes.js` | Controla cliques e foco durante cenas automáticas, preservando os controles permitidos. |
| `assets/js/encerramento.js` | Cenas finais, créditos e reprodução do MP3 com volume gradual. |
| `assets/js/relatorio_final.js` | Relatório das duas fases, histórico, evidências e pontuação da tentativa atual. |
| `assets/css/participante.css` | Tela inicial, ambiente de trabalho simulado e Fase 1. |
| `assets/css/interrogatorio.css` | Fase 2, caderno, prontuário e cores das classificações. |
| `assets/css/cinematica.css` | Estilos da apresentação cinematográfica. |
| `assets/css/apoio_ui.css` | Orientações, volume, destaques e apresentação do encerramento. |
| `assets/audio/happy.mp3` | Gravação usada no encerramento. Verifique a licença antes de disponibilizá-la publicamente. |

## Fluxo e regras

Todos os arquivos são necessários à apresentação ou à manutenção desta edição. Não há gerador de executável, servidor Python, instalação de dependências, Docker ou painel administrativo neste pacote.

`dados.js` deve carregar antes de `motor.js`. Os demais scripts usam `TableTop.requisicao()` para consultar e alterar a partida. Os identificadores `/api/...` permanecem apenas como contrato interno das telas: o adaptador responde localmente com objetos `Response`, sem fazer chamadas de rede. As regras não dependem de um processo ativo na Vercel.

A Fase 1 verifica o tempo quando o estado é consultado ou uma ação é executada. Uma ação só pode ser usada uma vez. O avanço respeita o encerramento da fase e o bloqueio por formatação. A Fase 2 sorteia um infectado, distribui duas pistas justificadas para cada inocente e desconta 25 pontos por consulta inédita, partindo de 1.000 pontos. Não há bônus por acusação ou marcação. O gabarito só aparece na interface depois da acusação.

Os valores internos `frio`, `morno` e `quente` correspondem a **Normal**, **Estranho** e **Suspeito**. Eles são identificadores compartilhados entre motor, CSS, caderno e relatório; mantenha a correspondência ao editar. As cores acompanham as classificações.

`TableTop.memoria` é um mapa JavaScript da aba, usado pelas telas para guardar preferências e identificadores durante a tentativa. Não usa `localStorage`, `sessionStorage`, cookies, arquivos ou banco. As abas são independentes. Atualizar a página apaga a partida, inclusive o relatório. O conteúdo e as regras são públicos no código, como esperado em um jogo educativo estático; esta edição não oferece validação competitiva de resultados.

## Alterações comuns

- **Cenário, ações, objetivos, textos e referências:** edite `dados.js`, preservando os identificadores usados nas regras.
- **Pontuação e condições:** edite `motor.js`. Confira também os textos explicativos na interface.
- **Música:** substitua `assets/audio/happy.mp3` por uma gravação autorizada e ajuste os créditos em `encerramento.js`. O volume de encerramento fica nesse script; a música sintetizada durante as fases fica em `apoio_ui.js`.
- **Cores e disposição:** edite o CSS da tela correspondente. Estilos específicos criados pelos scripts atendem seus componentes dinâmicos.
- **Publicação:** use o conteúdo da raiz deste pacote. Não inclua a edição Windows ou arquivos pessoais no repositório do site.

## Conferência após editar

Abra `index.html` ou uma prévia HTTP local no navegador. Confirme: abertura e som no primeiro clique; ações e objetivos da Fase 1; bloqueio após formatar; transição com áudio para a Fase 2; consulta com foco na resposta recém-chegada; caderno, notas e cores; acusação certa e errada; reinício; encerramento com música e relatório. Confira também uma janela estreita e se atualizar a página inicia uma partida vazia.

O navegador precisa permitir JavaScript. O áudio começa após interação e pode ser silenciado no ícone de volume; abas em segundo plano podem ter áudio e temporizadores limitados pelo navegador. A opção de reduzir movimento do sistema é respeitada nos componentes que oferecem essa adaptação.
