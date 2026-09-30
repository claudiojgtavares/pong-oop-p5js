(function (global) {
  'use strict';

  // Guarda e apresenta a pontuação de um dos lados do campo.
  class Pontuacao {
    constructor(valorInicial = 0) {
      if (!Number.isInteger(valorInicial) || valorInicial < 0) {
        throw new Error('A pontuação inicial deve ser um inteiro não negativo.');
      }
      this.pontuacao = valorInicial;
    }

    incrementar(quantidade = 1) {
      if (!Number.isInteger(quantidade) || quantidade <= 0) throw new Error('O incremento deve ser um inteiro positivo.');
      this.pontuacao += quantidade;
      return this.pontuacao;
    }

    zerar() { this.pontuacao = 0; }

    desenhar(p, x, y) {
      if (!p) return;
      p.noStroke();
      p.fill(255);
      p.textFont('monospace');
      p.textSize(64);
      p.textAlign(p.CENTER, p.TOP);
      p.text(String(this.pontuacao), x, y);
    }
  }

  global.Pontuacao = Pontuacao;
  if (typeof module !== 'undefined' && module.exports) module.exports = Pontuacao;
}(typeof globalThis !== 'undefined' ? globalThis : this));
