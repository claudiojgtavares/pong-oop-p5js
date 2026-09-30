(function (global) {
  'use strict';

  // Controla a posição, o movimento e a geometria de colisão de uma raquete.
  class Raquete {
    constructor(x = 50, y = 250, largura = 16, altura = 100, velocidade = 7) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('A posição da raquete deve ser numérica.');
      if (!Number.isFinite(largura) || largura <= 0 || !Number.isFinite(altura) || altura <= 0) {
        throw new Error('As dimensões da raquete devem ser positivas.');
      }
      if (!Number.isFinite(velocidade) || velocidade <= 0) throw new Error('A velocidade da raquete deve ser positiva.');
      this.x = x;
      this.y = y;
      this.largura = largura;
      this.altura = altura;
      this.velocidade = velocidade;
    }

    mover(direcao, alturaCampo) {
      if (!Number.isFinite(direcao)) return;
      this.y += Math.sign(direcao) * this.velocidade;
      this.limitarAoCampo(alturaCampo);
    }

    moverCima(alturaCampo) { this.mover(-1, alturaCampo); }
    moverBaixo(alturaCampo) { this.mover(1, alturaCampo); }

    moverParaY(alvoY, alturaCampo) {
      if (!Number.isFinite(alvoY)) return;
      const diferenca = alvoY - this.y;
      this.y += Math.abs(diferenca) <= this.velocidade ? diferenca : Math.sign(diferenca) * this.velocidade;
      this.limitarAoCampo(alturaCampo);
    }

    limitarAoCampo(alturaCampo) {
      if (!Number.isFinite(alturaCampo) || alturaCampo <= 0) return;
      const metade = this.altura / 2;
      this.y = Math.max(metade, Math.min(alturaCampo - metade, this.y));
    }

    colideCom(bola) {
      if (!bola || !Number.isFinite(bola.raio)) return false;
      return Math.abs(bola.x - this.x) <= this.largura / 2 + bola.raio &&
        Math.abs(bola.y - this.y) <= this.altura / 2 + bola.raio;
    }

    verificarColisaoComBola(bola) { return this.colideCom(bola); }

    desenhar(p) {
      if (!p) return;
      p.noStroke();
      p.fill(255);
      p.rect(this.x - this.largura / 2, this.y - this.altura / 2, this.largura, this.altura, 3);
    }
  }

  global.Raquete = Raquete;
  if (typeof module !== 'undefined' && module.exports) module.exports = Raquete;
}(typeof globalThis !== 'undefined' ? globalThis : this));
