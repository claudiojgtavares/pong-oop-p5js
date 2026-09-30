(function (global) {
  'use strict';

  // Representa os limites do campo e desenha o fundo, as bordas e a rede central.
  class Campo {
    constructor(largura = 800, altura = 500) {
      if (!Number.isFinite(largura) || largura <= 0) {
        throw new Error('A largura do campo deve ser um número positivo.');
      }
      if (!Number.isFinite(altura) || altura <= 0) {
        throw new Error('A altura do campo deve ser um número positivo.');
      }
      this.largura = largura;
      this.altura = altura;
      this.espessuraBorda = 6;
    }

    contemY(y, margem = 0) {
      return y - margem >= this.espessuraBorda && y + margem <= this.altura - this.espessuraBorda;
    }

    desenhar(p) {
      if (!p) return;
      p.background(5, 9, 18);
      p.noStroke();
      p.fill(255);
      p.rect(0, 0, this.largura, this.espessuraBorda);
      p.rect(0, this.altura - this.espessuraBorda, this.largura, this.espessuraBorda);
      p.stroke(255, 255, 255, 150);
      p.strokeWeight(3);
      if (p.drawingContext && typeof p.drawingContext.setLineDash === 'function') {
        p.drawingContext.setLineDash([14, 12]);
      }
      p.line(this.largura / 2, 18, this.largura / 2, this.altura - 18);
      if (p.drawingContext && typeof p.drawingContext.setLineDash === 'function') {
        p.drawingContext.setLineDash([]);
      }
    }
  }

  global.Campo = Campo;
  if (typeof module !== 'undefined' && module.exports) module.exports = Campo;
}(typeof globalThis !== 'undefined' ? globalThis : this));
