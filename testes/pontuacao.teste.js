(function (global) {
  'use strict';
  const H = global.TestHarness || require('./harness');
  const Pontuacao = global.Pontuacao || require('../src/pontuacao.js');
  function run() { return H.runSuite('Pontuacao', [
    function iniciaEmZero() { H.assertEquals(new Pontuacao().pontuacao, 0); },
    function incrementa() { const p = new Pontuacao(2); H.assertEquals(p.incrementar(2), 4); },
    function rejeitaValoresInvalidos() { H.assertThrows(() => new Pontuacao(-1)); H.assertThrows(() => new Pontuacao().incrementar(0)); },
    function desenhaMarcador() { const p5 = H.mockP5(); new Pontuacao(3).desenhar(p5, 10, 20); H.assert(p5.chamadas.some((c) => c.nome === 'text' && c.argumentos[0] === '3')); }
  ]); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  if (typeof window !== 'undefined') (window.__pongSuites ||= []).push({ name: 'Pontuacao', run });
}(typeof globalThis !== 'undefined' ? globalThis : this));
