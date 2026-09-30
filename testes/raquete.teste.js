(function (global) {
  'use strict';
  const H = global.TestHarness || require('./harness');
  const Raquete = global.Raquete || require('../src/raquete.js');
  const Bola = global.Bola || require('../src/bola.js');
  function run() { return H.runSuite('Raquete', [
    function criaRaquete() { const r = new Raquete(50, 200, 16, 100, 8); H.assertEquals(r.y, 200); },
    function rejeitaVelocidadeInvalida() { H.assertThrows(() => new Raquete(1, 1, 10, 10, 0)); },
    function moveNosDoisSentidos() { const r = new Raquete(50, 200, 16, 100, 8); r.moverCima(500); H.assertEquals(r.y, 192); r.moverBaixo(500); H.assertEquals(r.y, 200); },
    function permaneceDentroDoCampo() { const r = new Raquete(50, 50, 16, 100, 20); r.moverCima(500); H.assertEquals(r.y, 50); for (let i = 0; i < 30; i += 1) r.moverParaY(999, 500); H.assertEquals(r.y, 450); },
    function detetaColisao() { const r = new Raquete(50, 250, 16, 100, 7); H.assert(r.colideCom(new Bola(65, 250, 10, -5, 0))); H.assert(!r.colideCom(new Bola(200, 250, 10, -5, 0))); }
  ]); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  if (typeof window !== 'undefined') (window.__pongSuites ||= []).push({ name: 'Raquete', run });
}(typeof globalThis !== 'undefined' ? globalThis : this));
