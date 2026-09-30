(function (global) {
  'use strict';
  const H = global.TestHarness || require('./harness');
  const Campo = global.Campo || require('../src/campo.js');
  function run() { return H.runSuite('Campo', [
    function guardaDimensoes() { const c = new Campo(800, 500); H.assertEquals(c.largura, 800); H.assertEquals(c.altura, 500); },
    function rejeitaDimensoesInvalidas() { H.assertThrows(() => new Campo(0, 500)); H.assertThrows(() => new Campo(800, -1)); },
    function validaCoordenadasVerticais() { const c = new Campo(800, 500); H.assert(c.contemY(250, 10)); H.assert(!c.contemY(4, 10)); },
    function desenhaComP5Injetado() { const p = H.mockP5(); new Campo().desenhar(p); H.assert(p.chamadas.some((c) => c.nome === 'line')); }
  ]); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  if (typeof window !== 'undefined') (window.__pongSuites ||= []).push({ name: 'Campo', run });
}(typeof globalThis !== 'undefined' ? globalThis : this));
