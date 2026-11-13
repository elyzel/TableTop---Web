/* Regras locais do jogo. Nada é enviado a um servidor ou salvo no navegador. */
window.TableTop = (() => {
  const valores = new Map();
  const memoria = {
    getItem: chave => valores.get(chave) ?? null,
    setItem: (chave, valor) => valores.set(chave, String(valor)),
    removeItem: chave => valores.delete(chave)
  };
  const {cenario, perguntas, servidores} = window.TableTopDados;
  let jogador;
  const vistos = {fase1: false, fase2: false};
  const agora = () => Date.now() / 1000;
  const copia = objeto => structuredClone(objeto);
  const falha = (erro, status = 400) => { throw {erro, status}; };
  const pontos2 = f => Math.max(0, 1000 - 25 * f.feitas.length);
  const formatou = p => p.historico.some(item => item.acao === 'Formatar Máquina');
  const acoes = () => Object.entries(cenario.acoes).map(([id, a]) => ({id, nome:a.nome, icone:a.icone, descricao:a.descricao}));
  function objetivos(p) {
    const itens = cenario.objetivos.map(o => ({...o, concluido:p.flags.includes(o.flag)}));
    return {total:itens.length, concluidos:itens.filter(o => o.concluido).length, itens};
  }
  function registrar(p, fase, acao, efeito, bonus, tempo) {
    p.pontos += (efeito.pontos || 0) + bonus;
    const novas = (efeito.flags || []).filter(flag => !p.flags.includes(flag));
    p.flags.push(...novas);
    p.historico.push({fase, acao, pontos:efeito.pontos || 0, bonus,
      tempo_s:Math.round(tempo * 10) / 10, feedback:efeito.feedback || ''});
    return novas;
  }
  function finalizar(p) {
    p.finalizado = true;
    const final = cenario.finais.find(f => {
      const c = f.condicao || {};
      return (c.requer || []).every(flag => p.flags.includes(flag))
        && !(c.proibe || []).some(flag => p.flags.includes(flag))
        && p.pontos >= (c.min_pontos ?? -9999);
    }) || cenario.finais.at(-1);
    p.final = {titulo:final.titulo, texto:final.texto, tipo:final.tipo || ''};
  }
  function verificarTempo(p) {
    if (p.finalizado || p.inicio_total === null) return;
    const t = agora();
    if (t - p.inicio_total > cenario.tempo_total) {
      registrar(p, p.fase, 'Tempo total esgotado', {pontos:-5, flags:['tempo_esgotado'],
        feedback:'O tempo acabou antes da conclusão do incidente.'}, 0, t - p.inicio_total);
      finalizar(p);
      return;
    }
    const fase = cenario.fases[p.fase], demora = fase.se_demorar;
    if (demora && t - p.inicio_fase > fase.limite) {
      registrar(p, p.fase, 'Sem ação a tempo', demora, 0, t - p.inicio_fase);
      if (demora.proxima === 'FIM') finalizar(p);
      else { p.fase = demora.proxima; p.inicio_fase = t; }
    }
  }
  function estado1(p) {
    if (p.inicio_total === null) return {status:'nao_iniciado'};
    verificarTempo(p);
    const obj = objetivos(p);
    if (p.finalizado) return {status:'finalizado', pontos:p.pontos, final:p.final, historico:p.historico, objetivos:obj};
    const fase = cenario.fases[p.fase];
    const ruim = ['perdeu_evidencia', 'apagou_evidencia', 'ignorou', 'tempo_esgotado'].filter(f => p.flags.includes(f)).length;
    const risco = Math.min(100, Math.trunc(10 + (agora()-p.inicio_total)/cenario.tempo_total*50*(p.flags.includes('isolou')?.4:1) + 15*ruim));
    return {status:'jogando', pontos:p.pontos, fase:p.fase, evento:fase.evento, efeito_fase:fase.efeito || '',
      flags:p.flags, usadas:p.usadas, risco, objetivos:obj,
      restante_total:Math.max(0, Math.trunc(cenario.tempo_total-(agora()-p.inicio_total))), acoes:acoes()};
  }
  function executar(p, id) {
    if (p.inicio_total === null) falha('Estado inválido.');
    verificarTempo(p);
    const acao = cenario.acoes[id];
    if (p.finalizado || !acao || p.usadas.includes(id)) falha('Ação inválida.');
    const antes = objetivos(p).concluidos, fase = p.fase, t = agora();
    const efeito = acao.fases?.[fase] || acao.padrao;
    const tempo = t - p.inicio_fase;
    const bonus = tempo <= cenario.fases[fase].limite*.5 && efeito.pontos > 0 ? 3 : 0;
    const novas_flags = registrar(p, fase, acao.nome, efeito, bonus, tempo);
    p.usadas.push(id);
    const proxima = efeito.proxima || fase;
    if (proxima === 'FIM') finalizar(p);
    else if (proxima !== fase) { p.fase = proxima; p.inicio_fase = t; }
    const obj = objetivos(p);
    if (!p.finalizado && obj.total > 0 && obj.total === obj.concluidos) finalizar(p);
    return {ok:true, consequencia:efeito.consequencia || '', efeito:efeito.efeito || '',
      pontos_acao:efeito.pontos || 0, bonus, novas_flags, objetivo_novo:obj.concluidos>antes,
      objetivos:obj, finalizado:p.finalizado};
  }
  // Fisher–Yates mantém a distribuição das quatro pistas falsas entre inocentes.
  function embaralhar(lista) {
    for (let i=lista.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }
  function novoCaso() {
    const infectado = servidores[Math.floor(Math.random()*servidores.length)].id;
    const pistas = embaralhar(perguntas.filter(q => q.pista_falsa).map(q => q.id)).slice(0,4);
    const fichas = {};
    let inocente = 0;
    for (const s of servidores) {
      const selecionadas = s.id === infectado ? [] : pistas.slice(inocente*2, ++inocente*2);
      fichas[s.id] = {};
      for (const q of perguntas) {
        const perfil = s.id === infectado ? 'infectado' : selecionadas.includes(q.id) ? 'pista' : 'normal';
        const dado = copia(q[perfil]);
        if (perfil === 'normal' && typeof dado.valor === 'number') dado.valor = Math.round(dado.valor*(.9+Math.random()*.2));
        dado.valor = String(dado.valor);
        dado.tipo = perfil === 'infectado' && q.anomalia ? 'anomalia' : perfil === 'pista' ? 'justificada' : 'normal';
        fichas[s.id][q.id] = dado;
      }
    }
    return {tentativa:crypto.randomUUID(), infectado, fichas, feitas:[], marcas:{}, notas:{},
      intro:false, finalizado:false, acusado:null, inicio:agora(), resultado:null};
  }
  function estado2(p) {
    const f = p.fase2, respostas = {}, ordem_respostas = Object.fromEntries(servidores.map(s => [s.id,[]]));
    for (const [sid,qid] of f.feitas) {
      ordem_respostas[sid].push(qid);
      const {tipo, ...dado} = f.fichas[sid][qid];
      (respostas[sid] ||= {})[qid] = dado;
    }
    const d = {tentativa:f.tentativa, intro:f.intro, pode_pular:vistos.fase2, perguntas_usadas:f.feitas.length,
      combinacoes_disponiveis:perguntas.length*servidores.length, custo_pergunta:25, suspeitos:servidores,
      perguntas:perguntas.map(({id, pergunta, exame, referencia}) => ({id, pergunta, exame, referencia})),
      respostas, ordem_respostas, marcas:f.marcas, notas:f.notas, finalizado:f.finalizado,
      pontos_fase1:p.pontos, pontos:pontos2(f)};
    if (f.finalizado) Object.assign(d, {resultado:f.resultado, gabarito:f.fichas, acusado:f.acusado,
      infectado:servidores.find(s => s.id===f.infectado)});
    return d;
  }
  function investigar(p, d) {
    const acao = d.acao || 'estado';
    if (!['estado','intro','reiniciar','perguntar','marcar','anotar','acusar'].includes(acao)) falha('Ação inválida.');
    if (!p.finalizado) falha('Finalize a Fase 1 antes de avançar.',409);
    if (formatou(p)) falha('A formatação destruiu evidências. Reinicie a Fase 1.',403);
    if (!p.fase2) {
      if (acao!=='estado') falha('Abra o caso primeiro.',409);
      p.fase2 = novoCaso();
    }
    let f = p.fase2;
    if (acao==='estado') return estado2(p);
    if (d.tentativa!==f.tentativa) falha('A tentativa mudou. Atualize a página.',409);
    if (acao==='reiniciar') {
      if (!f.finalizado) falha('Conclua a acusação antes de reiniciar.',409);
      p.fase2=novoCaso(); return estado2(p);
    }
    if (f.finalizado) falha('O caso já foi encerrado.',409);
    if (acao==='intro') { f.intro=true; vistos.fase2=true; return estado2(p); }
    if (!f.intro) falha('Conclua a abertura primeiro.',409);
    const sid=d.suspeito, qid=d.pergunta;
    if (!f.fichas[sid]) falha('Selecione um servidor.');
    if (['perguntar','marcar'].includes(acao) && !perguntas.some(q => q.id===qid)) falha('Pergunta inválida.');
    const consultada = f.feitas.some(([s,q]) => s===sid && q===qid);
    if (acao==='perguntar') {
      if (consultada) falha('Essa pergunta já foi feita a este servidor.',409);
      f.feitas.push([sid,qid]);
    } else if (acao==='marcar') {
      if (!consultada) falha('Consulte essa evidência antes de marcar.',409);
      if (!['','frio','morno','quente'].includes(d.marca)) falha('Marcação inválida.');
      f.marcas[sid+':'+qid]=d.marca;
    } else if (acao==='anotar') {
      if (typeof d.texto!=='string') falha('Anotação inválida.');
      f.notas[sid]=d.texto.slice(0,1000);
    } else if (acao==='acusar') {
      f.finalizado=true; f.acusado=sid;
      f.resultado={pontos:pontos2(f), base:pontos2(f), bonus_acerto:0, bonus_marcas:0,
        vitoria:sid===f.infectado, perguntas_usadas:f.feitas.length};
    }
    return estado2(p);
  }
  // Adaptador para as telas existentes; /api é um identificador interno, sem rede.
  async function requisicao(url, opcoes={}) {
    try {
      const d=opcoes.body ? JSON.parse(opcoes.body) : {};
      let resultado;
      if (url==='/api/entrar') {
        const nome=String(d.nome || '').trim().slice(0,40);
        if (!nome) falha('Informe seu nome.');
        jogador={nome, fase:cenario.inicio, pontos:0, flags:[], usadas:[], historico:[],
          inicio_total:null, inicio_fase:null, finalizado:false, final:null};
        resultado={pid:nome};
      } else if (url==='/api/orientacao/fase1') resultado={acoes:acoes()};
      else {
        const pid=url.startsWith('/api/estado/') ? decodeURIComponent(url.slice(12)) : d.pid;
        const p=jogador;
        if (!p || pid!==p.nome) falha('Participante não encontrado.',404);
        if (url==='/api/iniciar') {
          if (p.inicio_total===null) p.inicio_total=p.inicio_fase=agora();
          vistos.fase1=true; resultado={ok:true};
        } else if (url.startsWith('/api/estado/')) resultado=estado1(p);
        else if (url==='/api/executar') resultado=executar(p,d.acao);
        else if (url==='/api/animacoes') resultado=vistos;
        else if (url==='/api/fase2') resultado=investigar(p,d);
        else if (url==='/api/participante/reiniciar') {
          if (!p.finalizado) falha('Finalize a Fase 1 antes de reiniciar.',409);
          jogador=null; resultado={ok:true};
        } else falha('Recurso inexistente.',404);
      }
      return Response.json(copia(resultado));
    } catch (e) {
      return Response.json({erro:e.erro || e.message || 'Não foi possível iniciar o jogo.'}, {status:e.status || 500});
    }
  }
  async function fase2() {
    if (!jogador?.finalizado || formatou(jogador)) return;
    clearInterval(poll);
    pregame='fase2';
    document.getElementById('fase1').hidden=true;
    for (const id of ['inicio','desk','final','faseintro']) document.getElementById(id).hidden=true;
    document.body.dataset.ttModo='neutro';
    document.body.classList.add('tt-fase2');
    document.body.classList.remove('tt-animacao-bloqueada');
    document.getElementById('caso').hidden=false;
    window.scrollTo(0,0);
    await iniciarInterrogatorio(document.getElementById('caso'), {
      pid:jogador.nome,
      onAtividadeConcluida: resultado => document.dispatchEvent(new CustomEvent('tabletop:atividadeConcluida',{detail:resultado}))
    });
  }
  const reiniciar = () => location.reload();
  document.addEventListener('click', evento => {
    const link=evento.target.closest('a[href="/"]');
    if (link) { evento.preventDefault(); reiniciar(); }
  });
  return {memoria, requisicao, fase2, reiniciar};
})();
