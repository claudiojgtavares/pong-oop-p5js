(function (global) {
  'use strict';
  const H = global.TestHarness || require('./harness');
  const Bola = global.Bola || require('../src/bola.js');
  const Raquete = global.Raquete || require('../src/raquete.js');
  function run() { return H.runSuite('Bola', [
    function criaBola() { const b = new Bola(100, 200, 10, 4, 3); H.assertEquals(b.x, 100); H.assertEquals(b.vx, 4); },
    function rejeitaRaioInvalido() { H.assertThrows(() => new Bola(1, 1, 0, 1, 1)); },
    function ressaltaNasParedes() { const b = new Bola(100, 11, 10, 0, -3); H.assertEquals(b.atualizar(500), 'parede'); H.assert(b.vy > 0); },
    function marcaQuandoAtingeALateral() { const b = new Bola(11, 200, 10, -2, 0); H.assertEquals(b.verificarBordaHorizontal(800), null); b.x = 10; H.assertEquals(b.verificarBordaHorizontal(800), 'esquerda'); },
    function rebateComAngulo() { const b = new Bola(60, 225, 10, -5, 0); b.rebaterNaRaquete(new Raquete(50, 250, 16, 100, 7), 1); H.assert(b.vx > 0); H.assert(b.vy < 0); },
    function reposicionaDeFormaDeterminista() { const valores = [0, 0]; const b = new Bola(1, 1, 10, 5, 1, () => valores.shift()); b.reposicionarCentro(800, 500, -1); H.assertEquals(b.x, 400); H.assert(b.vx < 0); H.assert(b.vy < 0); }
  ]); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  if (typeof window !== 'undefined') (window.__pongSuites ||= []).push({ name: 'Bola', run });
}(typeof globalThis !== 'undefined' ? globalThis : this));
