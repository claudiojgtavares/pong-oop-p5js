(function (global) {
  'use strict';
  const H = global.TestHarness || require('./harness');
  const Jogo = global.Jogo || require('../src/jogo.js');
  const novoJogo = (opcoes = {}) => new Jogo(H.mockP5(), 800, 500, { som: H.mockSom(), aleatorio: () => 0.25, ...opcoes });
  function run() { return H.runSuite('Jogo', [
    function exigeP5() { H.assertThrows(() => new Jogo(null)); },
    function iniciaNoEstadoCorreto() { const j = novoJogo(); H.assertEquals(j.estado, 'INICIAL'); H.assertEquals(j.pontuacaoEsquerda.pontuacao, 0); },
    function espacoIniciaPartida() { const j = novoJogo(); j.processarTecla(' '); H.assertEquals(j.estado, 'JOGANDO'); },
    function enterIniciaPartida() { const j = novoJogo(); j.processarTecla('Enter'); H.assertEquals(j.estado, 'JOGANDO'); },
    function pausaUmaVezPorEvento() { const j = novoJogo(); j.iniciarPartida(); j.processarTecla('p'); H.assertEquals(j.estado, 'PAUSA'); j.atualizarTeclas(); H.assertEquals(j.estado, 'PAUSA'); j.processarTecla('P'); H.assertEquals(j.estado, 'JOGANDO'); },
    function movimentaAmbosJogadores() { const j = novoJogo(); j.iniciarPartida(); j.teclas.w = true; j.teclas.ArrowDown = true; j.atualizar(); H.assert(j.raqueteEsquerda.y < 250); H.assert(j.raqueteDireita.y > 250); },
    function rebateApenasNaDirecaoCorreta() { const j = novoJogo(); j.iniciarPartida(); j.bola.x = 65; j.bola.y = j.raqueteEsquerda.y; j.bola.vx = -5; j.atualizar(); H.assert(j.bola.vx > 0); H.assertEquals(j.som.colisoes, 1); },
    function marcaPontoEReiniciaBola() { const j = novoJogo(); j.iniciarPartida(); j.bola.x = j.largura + j.bola.raio + 1; j.bola.vx = 5; j.atualizar(); H.assertEquals(j.pontuacaoEsquerda.pontuacao, 1); H.assertEquals(j.bola.x, 400); },
    function terminaAoAtingirLimite() { const j = novoJogo({ pontoVitoria: 1 }); j.iniciarPartida(); j.marcarPonto('direita'); H.assertEquals(j.estado, 'FIM'); },
    function desenhaCicloCompleto() { const j = novoJogo(); j.desenhar(); H.assert(j.p.chamadas.some((c) => c.nome === 'circle')); H.assert(j.p.chamadas.some((c) => c.nome === 'text')); },
    function integracaoDeTrezentosFrames() { const j = novoJogo({ modoComputador: true }); j.iniciarPartida(); for (let i = 0; i < 300; i += 1) { j.atualizar(); H.assert(j.bola.x >= 0 && j.bola.x <= j.largura); H.assert(j.bola.y >= 0 && j.bola.y <= j.altura); H.assert(j.raqueteEsquerda.y >= 50 && j.raqueteEsquerda.y <= 450); H.assert(j.raqueteDireita.y >= 50 && j.raqueteDireita.y <= 450); } },
    function integracaoPartidaCompletaAteSetePontos() { const j = novoJogo(); j.processarTecla('Enter'); while (j.estado === 'JOGANDO') { j.bola.x = j.largura + j.bola.raio + 1; j.bola.vx = 5; j.atualizar(); H.assert(j.bola.x >= 0 && j.bola.x <= j.largura); H.assert(j.bola.y >= 0 && j.bola.y <= j.altura); H.assert(j.raqueteEsquerda.y >= 50 && j.raqueteEsquerda.y <= 450); H.assert(j.raqueteDireita.y >= 50 && j.raqueteDireita.y <= 450); } H.assertEquals(j.pontuacaoEsquerda.pontuacao, 7); H.assertEquals(j.estado, 'FIM'); }
  ]); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  if (typeof window !== 'undefined') (window.__pongSuites ||= []).push({ name: 'Jogo', run });
}(typeof globalThis !== 'undefined' ? globalThis : this));
