(function (global) {
  'use strict';
  const TestHarness = {};

  TestHarness.assert = function (condicao, mensagem) {
    if (!condicao) throw new Error(mensagem || 'A condição deveria ser verdadeira.');
  };
  TestHarness.assertEquals = function (atual, esperado, mensagem) {
    if (atual !== esperado) throw new Error((mensagem || 'Valores diferentes.') + ` Esperado: ${esperado}; obtido: ${atual}.`);
  };
  TestHarness.assertAproximado = function (atual, esperado, tolerancia = 0.0001, mensagem) {
    if (Math.abs(atual - esperado) > tolerancia) throw new Error((mensagem || 'Valores fora da tolerância.') + ` Esperado: ${esperado}; obtido: ${atual}.`);
  };
  TestHarness.assertThrows = function (funcao, mensagem) {
    let lancou = false;
    try { funcao(); } catch (erro) { lancou = true; }
    if (!lancou) throw new Error(mensagem || 'Era esperada uma exceção.');
  };

  TestHarness.mockP5 = function () {
    const chamadas = [];
    const p = { width: 800, height: 500, CENTER: 'center', TOP: 'top', keyIsDown: () => false, chamadas };
    ['background', 'stroke', 'strokeWeight', 'noStroke', 'fill', 'rect', 'line', 'circle', 'text', 'textSize', 'textAlign', 'textFont'].forEach((nome) => {
      p[nome] = (...argumentos) => chamadas.push({ nome, argumentos });
    });
    p.drawingContext = { setLineDash: (valor) => chamadas.push({ nome: 'setLineDash', argumentos: [valor] }) };
    return p;
  };

  TestHarness.mockSom = function () {
    return {
      ativado: true, colisoes: 0, pontos: 0,
      tocarColisao() { this.colisoes += 1; },
      tocarPonto() { this.pontos += 1; },
      alternar() { this.ativado = !this.ativado; }
    };
  };

  TestHarness.runSuite = function (nome, testes) {
    const detalhes = [];
    let passed = 0;
    let failed = 0;
    testes.forEach((teste) => {
      try {
        teste();
        passed += 1;
        detalhes.push({ nome: teste.name || 'anónimo', passou: true });
      } catch (erro) {
        failed += 1;
        detalhes.push({ nome: teste.name || 'anónimo', passou: false, erro: erro.message });
        if (typeof console !== 'undefined') console.error(`FALHA: ${nome} > ${teste.name}: ${erro.message}`);
      }
    });
    return { name: nome, passed, failed, skipped: 0, detalhes };
  };

  global.TestHarness = TestHarness;
  if (typeof module !== 'undefined' && module.exports) module.exports = TestHarness;
}(typeof globalThis !== 'undefined' ? globalThis : this));
