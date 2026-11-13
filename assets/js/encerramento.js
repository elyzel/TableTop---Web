(() => {
  'use strict';

  let ativo = null;

  const TEMPOS = {
    recuperacao: 8000,
    rede: 8000,
    mundo: 9000,
    mensagem: 8000,
    creditos: 28000
  };

  window.iniciarEncerramento = ({
    pontos = 0,
    onConcluir = null
  } = {}) => {
    if (ativo) {
      ativo.focus();
      return;
    }

    const focoAnterior = document.activeElement;

    const tela = document.createElement('dialog');

    tela.className = 'ttf';
    tela.setAttribute(
      'aria-label',
      'Encerramento do TableTop'
    );
    tela.tabIndex = -1;

    let timer = null;
    let fadeTimer = null;
    let pedidoPlay = 0;
    let audioBloqueado = false;
    let liberado = false;
    const VOLUME_MUSICA = .26;
    const musica = new Audio('assets/audio/happy.mp3');
    musica.preload = 'auto';
    musica.loop = true;
    musica.volume = 0;
    let som = true;
    let terminou = false;

    try {
      som = TableTop.memoria.getItem('tt_audio') !== 'off';
    } catch {}

    function servidor() {
      return `
        <svg viewBox="0 0 130 220" aria-hidden="true">
          <rect
            x="8" y="8" width="114" height="204" rx="8"
            fill="#152332" stroke="#6b93ad" stroke-width="2"
          />

          ${
            [28, 65, 102, 139, 176].map(y => `
              <rect
                x="20" y="${y}" width="90" height="25"
                rx="3" fill="#273e50"
              />
              <path
                d="M28 ${y + 8}H78M28 ${y + 16}H78"
                stroke="#7797ac"
              />
              <circle
                class="ttf-led"
                cx="98" cy="${y + 12}" r="4"
              />
            `).join('')
          }
        </svg>
      `;
    }

    tela.innerHTML = `
      <style>
        .ttf {
          position: fixed;
          inset: 0;
          margin: 0;
          padding: 0;
          border: 0;
          width: 100vw;
          max-width: none;
          height: 100dvh;
          max-height: none;
          overflow: hidden;
          background: #02060c;
          color: #eaf6ff;
          font: 16px/1.6 "Segoe UI", sans-serif;
        }

        .ttf::backdrop {
          background: #000;
        }

        .ttf * {
          box-sizing: border-box;
        }

        .ttf [hidden] {
          display: none !important;
        }

        .ttf button,
        .ttf a {
          font: inherit;
          color: #effaff;
          background: #12283b;
          border: 1px solid #759db8;
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          text-decoration: none;
        }

        .ttf button:focus-visible,
        .ttf a:focus-visible {
          outline: 3px solid white;
          outline-offset: 4px;
        }

        .ttf-controles {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          z-index: 10;
        }

        .ttf-cenario {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            #511321 0,
            transparent 65%
          );
          transition: opacity 2s;
        }

        .ttf-cenario::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            #124b72 0,
            transparent 65%
          );
          opacity: 0;
          transition: opacity 5s;
          pointer-events: none;
        }

        .ttf.ttf-recuperada .ttf-cenario::after {
          opacity: 1;
        }

        .ttf-servidores {
          position: absolute;
          inset: 25% 15% 24%;
          display: flex;
          justify-content: center;
          gap: clamp(12px, 4vw, 60px);
          z-index: 2;
          transition: transform 6s, opacity 6s;
        }

        .ttf-servidores svg {
          width: 24%;
          max-width: 150px;
          height: 100%;
          filter: drop-shadow(0 0 16px #3d1a27);
          transition: filter 5s;
        }

        .ttf-led {
          fill: #ff5c68;
          transition: fill 5s;
        }

        .ttf-recuperada .ttf-led {
          fill: #8bdcff;
        }

        .ttf-recuperada .ttf-servidores svg {
          filter: drop-shadow(0 0 22px #4299c288);
        }

        .ttf-rede {
          position: absolute;
          inset: 15% 5%;
          width: 90%;
          height: 70%;
          opacity: 0;
          z-index: 1;
          transition: opacity 5s;
        }

        .ttf-rede path {
          fill: none;
          stroke: #6bcfff;
          stroke-width: 2;
          stroke-dasharray: 8 12;
          animation: ttf-fluxo 6s linear infinite;
        }

        .ttf-rede circle {
          fill: #b3efff;
          filter: drop-shadow(0 0 8px #67cfff);
        }

        .ttf[data-cena="rede"] .ttf-rede,
        .ttf[data-cena="mundo"] .ttf-rede {
          opacity: .75;
        }

        .ttf[data-cena="rede"] .ttf-servidores {
          transform: scale(.65);
        }

        .ttf[data-cena="mundo"] .ttf-servidores {
          transform: scale(.2);
          opacity: 0;
        }

        .ttf-globo {
          position: absolute;
          left: 50%;
          top: 46%;
          width: min(54vh, 65vw);
          aspect-ratio: 1;
          transform: translate(-50%, -50%) scale(.5);
          opacity: 0;
          z-index: 3;
          transition: opacity 5s, transform 7s;
        }

        .ttf-globo svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 28px #248bc666);
        }

        .ttf[data-cena="mundo"] .ttf-globo,
        .ttf[data-cena="mensagem"] .ttf-globo {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .ttf[data-cena="mensagem"] .ttf-globo {
          opacity: .23;
        }

        .ttf[data-cena="mensagem"] .ttf-rede,
        .ttf[data-cena="mensagem"] .ttf-servidores {
          opacity: 0;
        }

        .ttf-legenda {
          position: absolute;
          left: 8%;
          right: 8%;
          bottom: 8%;
          text-align: center;
          z-index: 5;
          text-shadow: 0 2px 15px #000;
        }

        .ttf h1 {
          font-size: clamp(26px, 4vw, 46px);
          line-height: 1.2;
          margin: 0 0 16px;
        }

        .ttf-legenda p {
          font-size: clamp(16px, 2vw, 22px);
          margin: 0 auto;
          max-width: 850px;
        }

        .ttf[data-cena="mensagem"] .ttf-legenda {
          bottom: 30%;
        }

        .ttf-creditos {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 2s;
          z-index: 6;
        }

        .ttf[data-cena="creditos"] .ttf-creditos {
          opacity: 1;
        }

        .ttf[data-cena="creditos"] .ttf-cenario,
        .ttf[data-cena="creditos"] .ttf-legenda {
          opacity: 0;
        }

        .ttf-rolagem {
          position: absolute;
          top: 100%;
          left: 8%;
          width: 84%;
          text-align: center;
        }

        .ttf[data-cena="creditos"] .ttf-rolagem {
          animation: ttf-creditos 28s linear both;
        }

        .ttf-rolagem h2 {
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: .12em;
          margin: 0 0 70px;
        }

        .ttf-rolagem section {
          margin: 0 0 70px;
        }

        .ttf-rolagem h3 {
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: .14em;
          color: #9dc2d8;
          margin-bottom: 14px;
        }

        .ttf-rolagem p {
          font-size: clamp(20px, 3vw, 30px);
          margin: 0;
        }

        .ttf-final {
          position: absolute;
          inset: 0;
          padding: 85px 24px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: radial-gradient(
            ellipse at center,
            #102c43,
            #02060c 75%
          );
          z-index: 7;
        }

        .ttf-final p {
          max-width: 750px;
          font-size: 20px;
        }

        .ttf-acoes {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 20px;
        }

        @keyframes ttf-fluxo {
          to {
            stroke-dashoffset: -120;
          }
        }

        @keyframes ttf-creditos {
          to {
            transform: translateY(calc(-100% - 100vh));
          }
        }

        /*
        Mantém todas as cenas e tempos.
        Reduz apenas movimentos acessórios.
        */
        @media (prefers-reduced-motion: reduce) {
          .ttf-servidores,
          .ttf-globo {
            transition: opacity 3s;
          }

          .ttf-rede path {
            animation: none;
          }
        }
      </style>

      <div class="ttf-controles">
        <button type="button" data-ttf="som"></button>

        <button type="button" data-ttf="pular">
          Ir aos créditos
        </button>
      </div>

      <div class="ttf-cenario">
        <svg
          class="ttf-rede"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path
            d="M500 300L130 100M500 300L860 90M500 300L110 480M500 300L890 490M130 100L860 90M110 480L890 490M130 100L110 480M860 90L890 490"
          />

          <circle cx="130" cy="100" r="9"/>
          <circle cx="860" cy="90" r="9"/>
          <circle cx="110" cy="480" r="9"/>
          <circle cx="890" cy="490" r="9"/>
          <circle cx="500" cy="300" r="12"/>
        </svg>

        <div class="ttf-servidores">
          ${servidor()}${servidor()}${servidor()}
        </div>

        <div class="ttf-globo">
          <svg
            viewBox="0 0 400 400"
            role="img"
            aria-label="Globo estilizado com conexões entre regiões"
          >
            <circle
              cx="200" cy="200" r="180"
              fill="#082b47"
              stroke="#86d7ff"
              stroke-width="2"
            />

            <g fill="none" stroke="#4782a2" opacity=".6">
              <ellipse cx="200" cy="200" rx="90" ry="180"/>
              <ellipse cx="200" cy="200" rx="145" ry="180"/>
              <ellipse cx="200" cy="200" rx="180" ry="65"/>
              <ellipse cx="200" cy="200" rx="180" ry="130"/>
              <path d="M20 200H380M200 20V380"/>
            </g>

            <g
              fill="#3d9c99"
              stroke="#92ded0"
              stroke-width="2"
            >
              <path
                d="M65 110L105 73L154 85L162 112L132 140L144 170L119 185L97 160L80 149Z"
              />

              <path
                d="M132 193L167 209L178 245L163 282L145 322L133 283L120 246Z"
              />

              <path
                d="M207 108L235 86L270 92L289 112L325 101L348 135L331 166L302 172L279 150L257 169L234 144L207 147Z"
              />

              <path
                d="M214 163L252 168L272 207L248 254L224 277L210 239L197 195Z"
              />

              <path
                d="M292 272L328 260L351 286L335 310L300 305Z"
              />
            </g>

            <g
              fill="none"
              stroke="#c9f4ff"
              stroke-width="2"
            >
              <path
                d="M112 125Q190 38 238 123M238 123Q320 130 323 283M148 233Q220 143 238 123M112 125Q60 210 148 233"
              />
            </g>

            <g fill="#f1fdff">
              <circle cx="112" cy="125" r="5"/>
              <circle cx="238" cy="123" r="5"/>
              <circle cx="148" cy="233" r="5"/>
              <circle cx="323" cy="283" r="5"/>
            </g>
          </svg>
        </div>
      </div>

      <div
        class="ttf-legenda"
        role="status"
        aria-live="polite"
      >
        <h1 data-ttf="titulo"></h1>
        <p data-ttf="texto"></p>
      </div>

      <div
        class="ttf-creditos"
        aria-label="Créditos do desenvolvimento"
      >
        <div class="ttf-rolagem">
          <h2>TABLETOP</h2>

          <section>
            <h3>Realização</h3>
            <p>TableTop — Simulação educativa de resposta a incidentes.</p>
          </section>

          <section>
            <h3>Concepção e roteiro</h3>
            <p>Eliseu, Sabrina, Ricardo e Leandro</p>
          </section>

          <section>
            <h3>Desenvolvimento</h3>
            <p>Eliseu</p>
          </section>

          <section>
            <h3>Música do encerramento</h3>
            <p>Happy — Pharrell Williams<br>Versão Ballroom</p>
          </section>

          <section>
            <h3>Agradecimentos</h3>
            <p>
              A todos os colaboradores que participaram da simulação.
            </p>
          </section>

          <section>
            <p>
              Um mundo digital mais seguro<br>
              começa com as nossas atitudes.
            </p>
          </section>
        </div>
      </div>

      <div
        class="ttf-final"
        data-ttf="final"
        hidden
      >
        <h1>Obrigado por participar!</h1>

        <p>
          O exercício termina.
          O cuidado com a segurança continua.
        </p>

        <p data-ttf="pontos"></p>

        <div class="ttf-acoes">
          <button type="button" data-ttf="relatorio">
            Rever relatório
          </button>

          <a href="/">Voltar à Fase 1</a>
        </div>
      </div>
    `;

    const el = nome => tela.querySelector(
      `[data-ttf="${nome}"]`
    );

    /* ---------- Música de encerramento ---------- */

    function rotuloSom() {
      el('som').textContent = som && !audioBloqueado ? 'Silenciar música' : 'Ativar música';
      el('som').setAttribute('aria-pressed', String(som && !audioBloqueado));
    }

    function cancelarFade() {
      window.clearInterval(fadeTimer);
      fadeTimer = null;
    }

    function transicaoVolume(destino, duracao, concluir = null) {
      cancelarFade();
      const inicial = musica.volume;
      const inicio = performance.now();
      if (!duracao) {
        musica.volume = destino;
        concluir?.();
        return;
      }
      fadeTimer = window.setInterval(() => {
        const progresso = Math.min(1, (performance.now() - inicio) / duracao);
        musica.volume = Math.max(0, Math.min(1, inicial + (destino - inicial) * progresso));
        if (progresso === 1) {
          cancelarFade();
          concluir?.();
        }
      }, 40);
    }

    function iniciarMusica() {
      if (!som || terminou || liberado || document.hidden || TTAnimacao.pausada) return;
      const pedido = ++pedidoPlay;
      // play é chamado ainda no clique que abriu o encerramento.
      musica.play().then(() => {
        if (pedido !== pedidoPlay || !som || terminou || liberado || document.hidden) {
          if (!som || terminou || liberado || document.hidden) musica.pause();
          return;
        }
        audioBloqueado = false;
        rotuloSom();
        transicaoVolume(VOLUME_MUSICA, 1500);
      }).catch(e => {
        if (pedido !== pedidoPlay || liberado || terminou) return;
        audioBloqueado = true;
        rotuloSom();
        console.warn('Não foi possível iniciar a música de encerramento:', e);
      });
    }

    function pararMusica(duracao = 350) {
      pedidoPlay++;
      transicaoVolume(0, duracao, () => musica.pause());
    }

    function acompanharVisibilidade() {
      if (document.hidden) pararMusica(0);
      else iniciarMusica();
    }

    document.addEventListener('visibilitychange', acompanharVisibilidade);
    const aoSair = () => pararMusica(0);
    window.addEventListener('pagehide', aoSair);

    /* ---------- Limpeza e retorno ao resultado ---------- */

    function liberar() {
      TTAnimacao.encerrar();
      TTAnimacao.cancelar(timer);
      pararMusica(0);

      liberado = true;
      cancelarFade();
      musica.pause();
      musica.removeAttribute('src');
      musica.load();
      document.removeEventListener('visibilitychange', acompanharVisibilidade);
      window.removeEventListener('pagehide', aoSair);
      window.TTUI?.definirEncerramento?.(false);

      tela.remove();
      ativo = null;

      if (focoAnterior?.isConnected) {
        focoAnterior.focus();
      }
    }

    /* ---------- Sequência das cenas ---------- */

    const cenas = {
      recuperacao: [
        'Caso resolvido. Parabéns!',
        'Você identificou o servidor infectado. Nesta história, ' +
        'a resposta ao incidente abre caminho para a recuperação.'
      ],

      rede: [
        'A rede volta a respirar.',
        'Proteger um equipamento ajuda a proteger as pessoas ' +
        'e os serviços conectados a ele.'
      ],

      mundo: [
        'Uma atitude faz parte de algo maior.',
        'Cada decisão consciente contribui ' +
        'para um mundo digital mais seguro.'
      ],

      mensagem: [
        'Uma ameaça foi contida. Um aprendizado permanece.',
        'Um mundo digital mais seguro começa com as nossas atitudes.'
      ]
    };

    const sequencia = [
      'recuperacao',
      'rede',
      'mundo',
      'mensagem',
      'creditos',
      'fim'
    ];

    function mostrar(cena) {
      TTAnimacao.cancelar(timer);

      tela.dataset.cena = cena;

      if (cenas[cena]) {
        el('titulo').textContent = cenas[cena][0];
        el('texto').textContent = cenas[cena][1];
      }

      if (cena === 'creditos') {
        el('pular').textContent = 'Pular créditos';
      }

      if (cena === 'fim') {
        TTAnimacao.encerrar();
        terminou = true;

        pararMusica();

        el('final').hidden = false;
        el('pular').hidden = true;
        el('som').hidden = true;

        if (typeof onConcluir === 'function') {
          Promise.resolve()
            .then(() => onConcluir({
              destino: el('final'),
              fechar: () => tela.close()
            }))
            .catch(e => {
              console.error(
                'Falha ao apresentar o relatório final:',
                e
              );

              const aviso = document.createElement('p');

              aviso.textContent =
                'Não foi possível apresentar o relatório consolidado.';

              const voltar = document.createElement('button');

              voltar.type = 'button';
              voltar.textContent =
                'Rever resultado da Fase 2';

              voltar.onclick = () => {
                tela.close();
              };

              el('final').append(aviso, voltar);
              voltar.focus();
            });
        } else {
          el('relatorio').focus();
        }

        return;
      }

      timer = TTAnimacao.agendar(() => {
        const indice = sequencia.indexOf(cena);
        mostrar(sequencia[indice + 1]);
      }, TEMPOS[cena]);
    }

    /* ---------- Controles ---------- */

    el('som').onclick = () => {
      // Se o navegador bloqueou play, o primeiro clique tenta ativar sem silenciar.
      if (som && (audioBloqueado || musica.paused)) {
        iniciarMusica();
        return;
      }
      som = !som;
      try { TableTop.memoria.setItem('tt_audio', som ? 'on' : 'off'); } catch {}
      window.TTUI?.definirSom?.(som);
      rotuloSom();
      if (som) iniciarMusica();
      else pararMusica();
    };

    el('pular').onclick = () => {
      mostrar(
        tela.dataset.cena === 'creditos'
          ? 'fim'
          : 'creditos'
      );
    };

    el('relatorio').onclick = () => {
      tela.close();
    };

    tela.addEventListener('cancel', evento => {
      evento.preventDefault();

      if (terminou) {
        tela.close();
      } else {
        mostrar('fim');
      }
    });

    tela.addEventListener(
      'close',
      liberar,
      {once: true}
    );

    el('pontos').textContent =
      `Pontuação total das duas fases: ${Number(pontos) || 0} pontos.`;

    window.TTUI?.definirEncerramento?.(true);
    document.body.append(tela);

    ativo = tela;

    rotuloSom();
    tela.showModal();
    el('pular').disabled = true;
    iniciarMusica();

    void TTAnimacao.iniciar('Encerramento', tela).then(() => {
      if (terminou || !tela.isConnected) return;

      el('pular').disabled = false;

      mostrar('recuperacao');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (tela.isConnected) {
            tela.classList.add('ttf-recuperada');
          }
        });
      });

    });
  };
})();
