(function (global) {
  'use strict';

  // Controla o movimento da bola, os ressaltos e a reposição depois de um ponto.
  class Bola {
    constructor(x = 400, y = 250, raio = 11, vx = 5, vy = 3, aleatorio = Math.random) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('A posição da bola deve ser numérica.');
      if (!Number.isFinite(raio) || raio <= 0) throw new Error('O raio da bola deve ser positivo.');
      if (!Number.isFinite(vx) || !Number.isFinite(vy)) throw new Error('A velocidade da bola deve ser numérica.');
      this.x = x;
      this.y = y;
      this.raio = raio;
      this.vx = vx;
      this.vy = vy;
      this.velocidadeBase = Math.max(4, Math.abs(vx));
      this.aleatorio = typeof aleatorio === 'function' ? aleatorio : Math.random;
    }

    atualizar(alturaCampo, espessuraBorda = 0) {
      this.x += this.vx;
      this.y += this.vy;
      const topo = espessuraBorda + this.raio;
      const fundo = alturaCampo - espessuraBorda - this.raio;
      if (this.y <= topo) {
        this.y = topo;
        this.vy = Math.abs(this.vy);
        return 'parede';
      }
      if (this.y >= fundo) {
        this.y = fundo;
        this.vy = -Math.abs(this.vy);
        return 'parede';
      }
      return null;
    }

    verificarBordaHorizontal(larguraCampo) {
      if (this.x - this.raio <= 0) return 'esquerda';
      if (this.x + this.raio >= larguraCampo) return 'direita';
      return null;
    }

    rebaterNaRaquete(raquete, sentido) {
      const deslocamento = Math.max(-1, Math.min(1, (this.y - raquete.y) / (raquete.altura / 2)));
      const angulo = deslocamento * (Math.PI / 3);
      const velocidade = Math.min(Math.max(Math.abs(this.vx) * 1.05, this.velocidadeBase), 12);
      this.vx = Math.cos(angulo) * velocidade * (sentido >= 0 ? 1 : -1);
      this.vy = Math.sin(angulo) * velocidade;
      this.x = raquete.x + (raquete.largura / 2 + this.raio + 1) * (sentido >= 0 ? 1 : -1);
    }

    reposicionarCentro(larguraCampo, alturaCampo, sentido = 1) {
      this.x = larguraCampo / 2;
      this.y = alturaCampo / 2;
      this.vx = this.velocidadeBase * (sentido >= 0 ? 1 : -1);
      const inclinacao = 0.35 + this.aleatorio() * 0.65;
      this.vy = inclinacao * 3 * (this.aleatorio() < 0.5 ? -1 : 1);
    }

    calcularAnguloRebote(pontoContato, alturaRaquete) {
      if (!Number.isFinite(pontoContato) || !Number.isFinite(alturaRaquete) || alturaRaquete <= 0) return 0;
      const deslocamento = Math.max(-1, Math.min(1, pontoContato / (alturaRaquete / 2)));
      return deslocamento * (Math.PI / 3);
    }

    desenhar(p) {
      if (!p) return;
      p.noStroke();
      p.fill(255);
      p.circle(this.x, this.y, this.raio * 2);
    }
  }

  global.Bola = Bola;
  if (typeof module !== 'undefined' && module.exports) module.exports = Bola;
}(typeof globalThis !== 'undefined' ? globalThis : this));
