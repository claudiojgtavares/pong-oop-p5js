(function (global) {
  'use strict';
  const H = global.TestHarness || require('./harness');
  const Som = global.Som || require('../src/som.js');
  function run() { return H.runSuite('Som', [
    function funcionaSemWebAudio() { const s = new Som(null); H.assertEquals(s.tocarColisao(), false); },
    function alternaEstado() { const s = new Som(null); H.assertEquals(s.alternar(), false); H.assertEquals(s.alternar(), true); },
    function somDesativadoNaoInicializa() { const s = new Som(function Contexto() { throw new Error('não deveria executar'); }); s.ativado = false; H.assertEquals(s.tocarPonto(), false); }
  ]); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  if (typeof window !== 'undefined') (window.__pongSuites ||= []).push({ name: 'Som', run });
}(typeof globalThis !== 'undefined' ? globalThis : this));
