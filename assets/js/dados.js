// Conteúdo fictício do cenário e dos servidores. Pode ser editado sem ferramentas de compilação.
window.TableTopDados = {
  "cenario": {
    "titulo": "Fase 1 - Máquina Contaminada",
    "tempo_total": 720,
    "inicio": "alerta",
    "objetivos": [
      {
        "id": "conter",
        "nome": "Conter o incidente",
        "flag": "isolou"
      },
      {
        "id": "comunicar",
        "nome": "Comunicar o SOC",
        "flag": "comunicou_soc"
      },
      {
        "id": "preservar",
        "nome": "Preservar e documentar",
        "flag": "preservou"
      }
    ],
    "fases": {
      "alerta": {
        "evento": "Antivírus/EDR detectou atividade suspeita após a execução de DIVIDA_PENDENTE.pdf.exe, incluindo a abertura de powershell.exe.",
        "limite": 240,
        "se_demorar": {
          "pontos": -10,
          "flags": [
            "ignorou"
          ],
          "proxima": "atraso",
          "feedback": "A demora em conter o equipamento permitiu que a atividade suspeita continuasse por mais tempo."
        }
      },
      "reiniciou": {
        "evento": "A máquina reiniciou, porém o comportamento suspeito voltou a ser detectado pelo Antivírus/EDR.",
        "limite": 180,
        "se_demorar": {
          "pontos": -10,
          "flags": [
            "ignorou"
          ],
          "proxima": "atraso",
          "feedback": "Mesmo após o novo alerta, não houve contenção a tempo."
        }
      },
      "atraso": {
        "evento": "Colegas relatam comportamento estranho em arquivos da pasta compartilhada.",
        "efeito": "caos",
        "limite": 180,
        "se_demorar": {
          "pontos": -10,
          "flags": [
            "ignorou"
          ],
          "proxima": "FIM",
          "feedback": "A ausência prolongada de contenção permitiu que o incidente avançasse para outros recursos."
        }
      },
      "contido": {
        "evento": "A máquina está isolada da rede. A equipe de TI aguarda o relato do incidente.",
        "limite": 240,
        "se_demorar": {
          "pontos": -2,
          "flags": [],
          "proxima": "preservar",
          "feedback": "Demorar a comunicar o incidente atrasa a investigação."
        }
      },
      "preservar": {
        "evento": "O SOC pede que a sequência do incidente seja preservada e registrada.",
        "limite": 180,
        "se_demorar": {
          "pontos": -3,
          "flags": [],
          "proxima": "FIM",
          "feedback": "Sem documentação organizada, a investigação perdeu parte do contexto do incidente."
        }
      }
    },
    "acoes": {
      "isolar": {
        "nome": "Isolar da Rede",
        "icone": "🌐",
        "descricao": "Desconecta a máquina de todas as interfaces de rede, mantendo-a ligada.",
        "fases": {
          "alerta": {
            "pontos": 10,
            "flags": [
              "isolou"
            ],
            "proxima": "contido",
            "efeito": "isolado",
            "consequencia": "O equipamento foi isolado da rede. A comunicação com outros dispositivos foi interrompida, enquanto a máquina permanece ligada para preservar informações importantes.",
            "feedback": "Correto: conter primeiro reduz a possibilidade de propagação e preserva evidências voláteis."
          },
          "reiniciou": {
            "pontos": 5,
            "flags": [
              "isolou"
            ],
            "proxima": "contido",
            "efeito": "isolado",
            "consequencia": "O equipamento foi isolado da rede, mas parte das evidências voláteis já pode ter sido perdida durante a reinicialização.",
            "feedback": "A contenção foi realizada, porém deveria ter ocorrido antes da reinicialização."
          },
          "atraso": {
            "pontos": 3,
            "flags": [
              "isolou"
            ],
            "proxima": "contido",
            "efeito": "isolado",
            "consequencia": "O equipamento foi isolado, porém o incidente já apresentou sinais de impacto em outros recursos.",
            "feedback": "A contenção ainda é necessária, mas ocorreu de forma tardia."
          }
        },
        "padrao": {
          "pontos": 8,
          "flags": [
            "isolou"
          ],
          "efeito": "isolado",
          "consequencia": "O equipamento foi isolado da rede.",
          "feedback": "A contenção foi realizada."
        }
      },
      "retirar_cabo": {
        "nome": "Retirar Cabo de Rede",
        "icone": "🔌",
        "descricao": "Remove fisicamente o cabo de rede do computador.",
        "fases": {},
        "padrao": {
          "pontos": -2,
          "consequencia": "O cabo de rede foi desconectado. Entretanto, o equipamento permanece conectado à rede corporativa através do Wi-Fi.",
          "feedback": "A contenção não foi efetiva porque outro meio de rede permanece ativo."
        }
      },
      "reiniciar": {
        "nome": "Reiniciar",
        "icone": "🔄",
        "descricao": "Desliga e liga o computador, encerrando os programas em execução.",
        "fases": {
          "alerta": {
            "pontos": -10,
            "flags": [
              "perdeu_evidencia"
            ],
            "proxima": "reiniciou",
            "efeito": "reboot",
            "consequencia": "A máquina foi reiniciada. Informações existentes somente na memória podem ter sido perdidas.",
            "feedback": "Reiniciar pode eliminar evidências voláteis e não garante a remoção da ameaça."
          }
        },
        "padrao": {
          "pontos": -8,
          "flags": [
            "perdeu_evidencia"
          ],
          "efeito": "reboot",
          "consequencia": "A máquina foi reiniciada. Informações existentes somente na memória podem ter sido perdidas.",
          "feedback": "Reiniciar altera o estado do equipamento e pode eliminar evidências importantes."
        }
      },
      "gestor": {
        "nome": "Chat do Gestor",
        "icone": "💬",
        "descricao": "Avisa o gestor sobre o incidente.",
        "fases": {},
        "padrao": {
          "pontos": 4,
          "flags": [
            "comunicou"
          ],
          "consequencia": "O gestor foi avisado e pediu que o procedimento institucional de resposta a incidentes seja seguido.",
          "feedback": "Comunicar o gestor é importante, mas não substitui o acionamento do SOC."
        }
      },
      "chamado": {
        "nome": "Abrir Chamado (SOC)",
        "icone": "🎫",
        "descricao": "Registra o incidente junto ao SOC.",
        "fases": {
          "contido": {
            "pontos": 10,
            "flags": [
              "comunicou_soc"
            ],
            "proxima": "preservar",
            "consequencia": "O SOC recebeu o relato e iniciou o processo de investigação.",
            "feedback": "Correto: após conter o equipamento, comunicar o SOC permite iniciar a investigação."
          }
        },
        "padrao": {
          "pontos": 6,
          "flags": [
            "comunicou_soc"
          ],
          "consequencia": "O SOC recebeu o registro do incidente.",
          "feedback": "O SOC foi acionado. Se o equipamento ainda estiver conectado, a contenção continua sendo necessária."
        }
      },
      "antivirus": {
        "nome": "Varredura Antivírus/EDR",
        "icone": "🛡️",
        "descricao": "Executa uma varredura completa utilizando o Antivírus/EDR.",
        "fases": {},
        "padrao": {
          "pontos": 2,
          "consequencia": "A varredura identificou atividade suspeita. O equipamento, entretanto, continua conectado à rede.",
          "feedback": "Detectar uma ameaça é diferente de conter a comunicação do equipamento."
        }
      },
      "historico": {
        "nome": "Limpar Histórico",
        "icone": "🧹",
        "descricao": "Apaga histórico, cookies e arquivos temporários do navegador.",
        "fases": {},
        "padrao": {
          "pontos": -10,
          "flags": [
            "apagou_evidencia"
          ],
          "consequencia": "O histórico foi apagado. Informações sobre o e-mail e o link acessado ficaram mais difíceis de recuperar.",
          "feedback": "Apagar o histórico remove evidências importantes para reconstruir a origem do incidente."
        }
      },
      "remover_instalador": {
        "nome": "Remover Arquivo Instalador",
        "icone": "🗑️",
        "descricao": "Apaga o arquivo baixado da pasta Downloads.",
        "fases": {},
        "padrao": {
          "pontos": -1,
          "consequencia": "O arquivo foi removido da pasta Downloads. Porém, ele já havia sido executado e a atividade suspeita continua no equipamento.",
          "feedback": "Remover a origem depois da execução não significa remover aquilo que já foi executado."
        }
      },
      "desligar": {
        "nome": "Desligar da Tomada",
        "icone": "⚡",
        "descricao": "Interrompe imediatamente a energia do computador.",
        "fases": {},
        "padrao": {
          "pontos": -3,
          "flags": [
            "perdeu_evidencia"
          ],
          "efeito": "reboot",
          "consequencia": "O equipamento foi desligado abruptamente. Informações existentes somente na memória foram perdidas.",
          "feedback": "Desligar abruptamente pode eliminar evidências voláteis necessárias para a investigação."
        }
      },
      "formatar": {
        "nome": "Formatar Máquina",
        "icone": "💽",
        "descricao": "Apaga o disco e reinstala o sistema operacional.",
        "fases": {},
        "padrao": {
          "pontos": -10,
          "flags": [
            "apagou_evidencia"
          ],
          "proxima": "FIM",
          "consequencia": "A máquina foi formatada. Grande parte das evidências necessárias para a investigação foi destruída.",
          "feedback": "Formatar prematuramente impede a análise adequada do incidente."
        }
      },
      "linha_tempo": {
        "nome": "Registrar Linha do Tempo",
        "icone": "📝",
        "descricao": "Registra a sequência do e-mail, clique, download, execução, alerta e ações realizadas.",
        "fases": {
          "contido": {
            "pontos": 10,
            "flags": [
              "preservou"
            ],
            "consequencia": "A sequência de acontecimentos foi registrada e preservada para a investigação.",
            "feedback": "Documentar os acontecimentos ajuda o SOC a reconstruir a cadeia do ataque."
          },
          "preservar": {
            "pontos": 10,
            "flags": [
              "preservou"
            ],
            "consequencia": "A sequência de acontecimentos foi registrada e preservada para a investigação.",
            "feedback": "Correto: o registro organizado preserva informações importantes para a investigação."
          }
        },
        "padrao": {
          "pontos": 6,
          "flags": [
            "preservou"
          ],
          "consequencia": "A sequência observada até o momento foi registrada para a investigação.",
          "feedback": "A documentação foi preservada. A contenção e a comunicação continuam necessárias se ainda não foram realizadas."
        }
      },
      "gerenciador": {
        "nome": "Gerenciador de Tarefas",
        "icone": "📊",
        "descricao": "Mostra os processos em execução e o uso de recursos do computador.",
        "fases": {},
        "padrao": {
          "pontos": 0,
          "consequencia": "O Gerenciador de Tarefas mostra powershell.exe entre os processos, mas isso isoladamente não determina toda a extensão do incidente.",
          "feedback": "Consultar processos pode auxiliar na análise, mas não deve atrasar a contenção."
        }
      }
    },
    "finais": [
      {
        "titulo": "Vazamento de dados",
        "tipo": "ruim",
        "texto": "O atraso na resposta permitiu que o incidente evoluísse e dados fossem potencialmente comprometidos.",
        "condicao": {
          "requer": [
            "ignorou"
          ]
        }
      },
      {
        "titulo": "Contenção exemplar",
        "tipo": "otimo",
        "texto": "Você concluiu os três objetivos essenciais: conteve o equipamento, comunicou o SOC e preservou informações importantes para a investigação.",
        "condicao": {
          "requer": [
            "isolou",
            "comunicou_soc",
            "preservou"
          ],
          "proibe": [
            "perdeu_evidencia",
            "apagou_evidencia",
            "ignorou",
            "tempo_esgotado"
          ],
          "min_pontos": 0
        }
      },
      {
        "titulo": "Contenção parcial",
        "tipo": "medio",
        "texto": "Os três objetivos essenciais foram concluídos, porém decisões anteriores prejudicaram a qualidade da resposta ou a preservação de evidências.",
        "condicao": {
          "requer": [
            "isolou",
            "comunicou_soc",
            "preservou"
          ],
          "min_pontos": -9999
        }
      },
      {
        "titulo": "Resposta incompleta",
        "tipo": "medio",
        "texto": "O incidente foi encerrado sem que todos os objetivos essenciais fossem concluídos.",
        "condicao": {
          "requer": [
            "isolou"
          ]
        }
      },
      {
        "titulo": "Propagação na rede",
        "tipo": "ruim",
        "texto": "As decisões tomadas permitiram que o incidente avançasse antes da contenção.",
        "condicao": {}
      }
    ]
  },
  "perguntas": [
    {
      "id": "reinicio",
      "pergunta": "Quando ligou e desligou?",
      "exame": "Último reinício",
      "referencia": "Há 12 dias, em janela autorizada",
      "anomalia": true,
      "pista_falsa": true,
      "normal": {
        "fala": "Mantenho minha rotina. Meu último reinício estava autorizado.",
        "valor": "Há 12 dias, em janela autorizada",
        "unidade": "",
        "observacao": "Janela de manutenção registrada."
      },
      "infectado": {
        "fala": "Recomeçar às vezes faz bem. Não guardei o motivo.",
        "valor": "Ontem às 03:12",
        "unidade": "",
        "observacao": "Nenhuma ordem de manutenção para o horário."
      },
      "pista": {
        "fala": "Hoje precisei recomeçar. Está tudo no chamado.",
        "valor": "Hoje às 02:00",
        "unidade": "",
        "observacao": "Chamado MAN-204: reinício autorizado às 02:00."
      }
    },
    {
      "id": "requisicoes",
      "pergunta": "Quantas requisições tem feito?",
      "exame": "Requisições",
      "referencia": "1200 /min",
      "anomalia": true,
      "pista_falsa": true,
      "normal": {
        "fala": "Atendo quem chega, no ritmo de sempre.",
        "valor": 1200,
        "unidade": "/min",
        "observacao": "Demanda habitual deste serviço."
      },
      "infectado": {
        "fala": "A noite foi movimentada. Prefiro não entrar nos detalhes.",
        "valor": 4700,
        "unidade": "/min",
        "observacao": "Origem do aumento não consta no planejamento."
      },
      "pista": {
        "fala": "A campanha trouxe gente. O aumento estava previsto.",
        "valor": 3100,
        "unidade": "/min",
        "observacao": "Campanha de marketing autorizada, registrada no calendário."
      }
    },
    {
      "id": "conexoes",
      "pergunta": "Quantas conexões abertas?",
      "exame": "Conexões",
      "referencia": "180 conexões",
      "anomalia": true,
      "pista_falsa": false,
      "normal": {
        "fala": "Mantenho contato com vários colegas. Pode conferir.",
        "valor": 180,
        "unidade": "conexões",
        "observacao": "Conexões distribuídas entre clientes e serviços."
      },
      "infectado": {
        "fala": "Poucas conversas, sempre com o mesmo endereço. Discrição é meu forte.",
        "valor": 12,
        "unidade": "conexões",
        "observacao": "11 das 12 conexões para 203.0.113.77, sem vínculo cadastrado."
      },
      "pista": {
        "fala": "O volume varia com a demanda. Hoje não houve mudança programada.",
        "valor": 180,
        "unidade": "conexões",
        "observacao": "Distribuição compatível com os clientes do serviço."
      }
    },
    {
      "id": "arquivos",
      "pergunta": "Quantos arquivos alterados nas últimas 24h?",
      "exame": "Arquivos alterados",
      "referencia": "35 arquivos/24h",
      "anomalia": true,
      "pista_falsa": true,
      "normal": {
        "fala": "Tenho registros e cache para manter. Sempre sobra uma anotação.",
        "valor": 35,
        "unidade": "arquivos/24h",
        "observacao": "Logs e cache geram pequenas alterações diárias."
      },
      "infectado": {
        "fala": "Nada mudou por aqui. Pelo menos é o que os números dizem.",
        "valor": 0,
        "unidade": "arquivos/24h",
        "observacao": "Este servidor mantém logs e cache locais; não há manutenção registrada."
      },
      "pista": {
        "fala": "Sou réplica somente leitura. Alterar arquivos não é minha função.",
        "valor": 0,
        "unidade": "arquivos/24h",
        "observacao": "Réplica somente leitura: ausência de alterações prevista no inventário."
      }
    },
    {
      "id": "cpu",
      "pergunta": "Quanto de CPU está usando?",
      "exame": "Uso de CPU",
      "referencia": "35 % — faixa habitual: 30 a 40%",
      "anomalia": false,
      "pista_falsa": true,
      "normal": {
        "fala": "Trabalho sem perder o fôlego. Nada fora da rotina.",
        "valor": 35,
        "unidade": "%",
        "observacao": "Referência: 30 a 40%, com pequenas oscilações."
      },
      "infectado": {
        "fala": "Meu pulso parece tranquilo. É o que você queria saber?",
        "valor": 38,
        "unidade": "%",
        "observacao": "Amostra dentro da faixa habitual de CPU."
      },
      "pista": {
        "fala": "Estou ocupado com o backup. O trabalho tem hora para acabar.",
        "valor": 82,
        "unidade": "%",
        "observacao": "Backup noturno agendado e autorizado em execução."
      }
    },
    {
      "id": "trafego",
      "pergunta": "Quanto tráfego sai em relação ao que entra?",
      "exame": "Razão saída/entrada",
      "referencia": "1,2 vezes",
      "anomalia": true,
      "pista_falsa": false,
      "normal": {
        "fala": "Respondo um pouco mais do que recebo. É o meu trabalho.",
        "valor": "1,2",
        "unidade": "vezes",
        "observacao": "Saída aproximadamente 1,2 vez a entrada."
      },
      "infectado": {
        "fala": "Tenho muito a dizer lá fora. O destino prefere silêncio.",
        "valor": "9,0",
        "unidade": "vezes",
        "observacao": "Saída concentrada em destino externo sem vínculo cadastrado."
      },
      "pista": {
        "fala": "Hoje a relação entre entrada e saída segue o perfil do serviço.",
        "valor": "1,2",
        "unidade": "vezes",
        "observacao": "Nenhuma transferência extraordinária programada."
      }
    },
    {
      "id": "intervalo",
      "pergunta": "Qual o intervalo entre as conexões externas?",
      "exame": "Intervalo externo",
      "referencia": "Irregular",
      "anomalia": true,
      "pista_falsa": false,
      "normal": {
        "fala": "Converso quando há demanda. Não sigo um relógio.",
        "valor": "Irregular",
        "unidade": "",
        "observacao": "Intervalos variáveis conforme a demanda."
      },
      "infectado": {
        "fala": "Sempre pontual. A cada minuto, nem antes, nem depois.",
        "valor": "60,0 s; desvio ±0,0 s",
        "unidade": "",
        "observacao": "Periodicidade observada durante toda a janela de coleta."
      },
      "pista": {
        "fala": "Os intervalos acompanham as solicitações recebidas.",
        "valor": "Irregular",
        "unidade": "",
        "observacao": "Não existe tarefa periódica associada às conexões observadas."
      }
    },
    {
      "id": "logs",
      "pergunta": "Como estão seus registros?",
      "exame": "Lacunas nos logs",
      "referencia": "Sem lacunas",
      "anomalia": true,
      "pista_falsa": true,
      "normal": {
        "fala": "Anotei tudo. Pode ler de cima a baixo.",
        "valor": "Sem lacunas",
        "unidade": "",
        "observacao": "Registros contínuos no período observado."
      },
      "infectado": {
        "fala": "Duas horas passaram em branco. Não tenho muito a acrescentar.",
        "valor": "2 horas: 02:50 a 04:50",
        "unidade": "",
        "observacao": "Não há rotação ou parada documentada para esse intervalo."
      },
      "pista": {
        "fala": "Troquei o caderno por cinco minutos. A rotação foi documentada.",
        "valor": "5 minutos",
        "unidade": "",
        "observacao": "Rotação de logs documentada, com arquivos anteriores preservados."
      }
    },
    {
      "id": "destinos",
      "pergunta": "Com quantos destinos externos diferentes falou?",
      "exame": "Destinos externos",
      "referencia": "45 destinos",
      "anomalia": true,
      "pista_falsa": false,
      "normal": {
        "fala": "Conheço vários serviços. Todos têm lugar no inventário.",
        "valor": 45,
        "unidade": "destinos",
        "observacao": "Destinos distribuídos e cadastrados."
      },
      "infectado": {
        "fala": "Um só contato basta quando ele sabe o que quer.",
        "valor": 1,
        "unidade": "destinos",
        "observacao": "Único destino: 203.0.113.77; não cadastrado para este serviço."
      },
      "pista": {
        "fala": "Os destinos continuam distribuídos entre serviços cadastrados.",
        "valor": 45,
        "unidade": "destinos",
        "observacao": "Distribuição habitual entre serviços externos cadastrados."
      }
    },
    {
      "id": "portas",
      "pergunta": "Quais portas tem abertas?",
      "exame": "Portas de entrada",
      "referencia": "80, 443, 22 TCP",
      "anomalia": false,
      "pista_falsa": false,
      "normal": {
        "fala": "As portas de sempre. Nenhuma surpresa na entrada.",
        "valor": "80, 443, 22",
        "unidade": "TCP",
        "observacao": "Portas previstas no inventário do cluster."
      },
      "infectado": {
        "fala": "Não precisei abrir uma porta nova. As antigas continuam aí.",
        "valor": "80, 443, 22",
        "unidade": "TCP",
        "observacao": "Portas de entrada iguais às previstas no inventário."
      },
      "pista": {
        "fala": "A lista de portas segue a configuração aprovada.",
        "valor": "80, 443, 22",
        "unidade": "TCP",
        "observacao": "Configuração de entrada aprovada e sem mudanças."
      }
    },
    {
      "id": "logins",
      "pergunta": "Quem fez login recentemente?",
      "exame": "Logins administrativos",
      "referencia": "2 administradores conhecidos em horário comercial",
      "anomalia": false,
      "pista_falsa": true,
      "normal": {
        "fala": "Vieram os dois de sempre, no horário de trabalho.",
        "valor": "2 administradores conhecidos",
        "unidade": "",
        "observacao": "Logins administrativos interativos em horário comercial."
      },
      "infectado": {
        "fala": "Os administradores são conhecidos. Sobre eles, nada a acrescentar.",
        "valor": "2 administradores conhecidos",
        "unidade": "",
        "observacao": "Logins administrativos interativos em horário comercial."
      },
      "pista": {
        "fala": "Recebi o plantonista à noite. O atendimento estava autorizado.",
        "valor": "Administrador às 23:40",
        "unidade": "",
        "observacao": "Plantão autorizado, vinculado ao chamado INC-318."
      }
    },
    {
      "id": "edr",
      "pergunta": "Seu antivírus ou EDR acusou algo?",
      "exame": "Estado do EDR",
      "referencia": "Ativo, sem alertas",
      "anomalia": false,
      "pista_falsa": false,
      "normal": {
        "fala": "O agente está de serviço. Não registrou alerta nesta coleta.",
        "valor": "Ativo, sem alertas",
        "unidade": "",
        "observacao": "Ausência de alertas deve ser avaliada junto às demais evidências."
      },
      "infectado": {
        "fala": "Nenhum alerta. Parece uma resposta confortável, não?",
        "valor": "Ativo, sem alertas",
        "unidade": "",
        "observacao": "Ausência de alertas deve ser avaliada junto às demais evidências."
      },
      "pista": {
        "fala": "O agente segue ativo; não há alerta nesta coleta.",
        "valor": "Ativo, sem alertas",
        "unidade": "",
        "observacao": "Agente ativo e coleta de eventos em funcionamento."
      }
    }
  ],
  "servidores": [
    {
      "id": "s1",
      "apelido": "O Porteiro",
      "hostname": "PORTAL-DMZ-01",
      "ip": "203.0.113.11",
      "funcao": "Portal público e atendimento",
      "so": "Ubuntu 22.04",
      "setor": "Atendimento",
      "criticidade": "Alta",
      "visual": "rack",
      "cor": "#5fa8d3"
    },
    {
      "id": "s2",
      "apelido": "O Contador",
      "hostname": "FIN-API-02",
      "ip": "198.51.100.12",
      "funcao": "API de cobrança e notas fiscais",
      "so": "Debian 12",
      "setor": "Financeiro",
      "criticidade": "Crítica",
      "visual": "torre",
      "cor": "#d9a441"
    },
    {
      "id": "s3",
      "apelido": "O Arquivista",
      "hostname": "DOCS-WEB-03",
      "ip": "192.0.2.13",
      "funcao": "Portal de documentos e downloads",
      "so": "Rocky Linux 9",
      "setor": "Jurídico",
      "criticidade": "Média",
      "visual": "nas",
      "cor": "#7fb069"
    }
  ]
};
