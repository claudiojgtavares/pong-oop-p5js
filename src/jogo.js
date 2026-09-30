(function (global) {
  'use strict';

  const CampoClass = global.Campo || (typeof require === 'function' ? require('./campo.js') : null);
  const RaqueteClass = global.Raquete || (typeof require === 'function' ? require('./raquete.js') : null);
  const BolaClass = global.Bola || (typeof require === 'function' ? require('./bola.js') : null);
  const PontuacaoClass = global.Pontuacao || (typeof require === 'function' ? require('./pontuacao.js') : null);
  const SomClass = global.Som || (typeof require === 'function' ? require('./som.js') : null);

  // Compõe as restantes classes e coordena regras, teclado e estados da partida.
  class Jogo {
    constructor(p, largura = 800, altura = 500, opcoes = {}) {
      if (!p) throw new Error('A API gráfica do p5 é obrigatória.');
      this.p = p;
      this.largura = largura;
      this.altura = altura;
      this.pontoVitoria = opcoes.pontoVitoria || 7;
      this.estado = 'INICIAL';
      this.teclas = Object.create(null);
      this.modoComputador = Boolean(opcoes.modoComputador);
      this.aleatorio = opcoes.aleatorio || Math.random;
      this.campo = new CampoClass(largura, altura);
      this.pontuacaoEsquerda = new PontuacaoClass();
      this.pontuacaoDireita = new PontuacaoClass();
      this.som = opcoes.som || new SomClass();
      this.criarElementosMoveis();
    }

    criarElementosMoveis() {
      this.raqueteEsquerda = new RaqueteClass(48, this.altura / 2, 16, 100, 7);
      this.raqueteDireita = new RaqueteClass(this.largura - 48, this.altura / 2, 16, 100, 7);
      this.bola = new BolaClass(this.largura / 2, this.altura / 2, 11, 5, 2.2, this.aleatorio);
    }

    inicializar() {
      this.reiniciarPartida();
      this.estado = 'INICIAL';
    }

    definirPontoVitoria(valor) {
      if (!Number.isInteger(valor) || valor <= 0) throw new Error('O limite deve ser um inteiro positivo.');
      this.pontoVitoria = valor;
    }

    reiniciarPartida() {
      this.criarElementosMoveis();
      this.pontuacaoEsquerda.zerar();
      this.pontuacaoDireita.zerar();
      this.teclas = Object.create(null);
    }

    iniciarPartida() { this.reiniciarPartida(); this.estado = 'JOGANDO'; }

    alternarPausa() {
      if (this.estado === 'JOGANDO') this.estado = 'PAUSA';
      else if (this.estado === 'PAUSA') this.estado = 'JOGANDO';
    }

    alternarModo() {
      if (this.estado !== 'JOGANDO') this.modoComputador = !this.modoComputador;
      return this.modoComputador;
    }

    jogoTerminou() {
      return this.pontuacaoEsquerda.pontuacao >= this.pontoVitoria || this.pontuacaoDireita.pontuacao >= this.pontoVitoria;
    }

    processarTecla(chave, pressionada = true) {
      if (!chave) return;
      const normalizada = chave.length === 1 ? chave.toLowerCase() : chave;
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(normalizada)) {
        this.teclas[normalizada] = pressionada;
        return;
      }
      if (!pressionada) return;
      if ((normalizada === ' ' || normalizada === 'Enter') && (this.estado === 'INICIAL' || this.estado === 'FIM')) this.iniciarPartida();
      else if (normalizada === 'p') this.alternarPausa();
      else if (normalizada === 'm') this.som.alternar();
      else if (normalizada === 'i') this.alternarModo();
    }

    atualizarTeclas() {
      if (!this.p || typeof this.p.keyIsDown !== 'function') return;
      this.teclas.w = Boolean(this.p.keyIsDown(87));
      this.teclas.s = Boolean(this.p.keyIsDown(83));
      this.teclas.ArrowUp = Boolean(this.p.keyIsDown(38));
      this.teclas.ArrowDown = Boolean(this.p.keyIsDown(40));
    }

    atualizarRaquetes() {
      if (this.teclas.w && !this.teclas.s) this.raqueteEsquerda.moverCima(this.altura);
      if (this.teclas.s && !this.teclas.w) this.raqueteEsquerda.moverBaixo(this.altura);
      if (this.modoComputador) {
        this.raqueteDireita.moverParaY(this.bola.vx > 0 ? this.bola.y : this.altura / 2, this.altura);
      } else {
        if (this.teclas.ArrowUp && !this.teclas.ArrowDown) this.raqueteDireita.moverCima(this.altura);
        if (this.teclas.ArrowDown && !this.teclas.ArrowUp) this.raqueteDireita.moverBaixo(this.altura);
      }
    }

    tratarColisoes() {
      if (this.bola.vx < 0 && this.raqueteEsquerda.colideCom(this.bola)) {
        this.bola.rebaterNaRaquete(this.raqueteEsquerda, 1);
        this.som.tocarColisao();
      } else if (this.bola.vx > 0 && this.raqueteDireita.colideCom(this.bola)) {
        this.bola.rebaterNaRaquete(this.raqueteDireita, -1);
        this.som.tocarColisao();
      }
    }

    marcarPonto(ladoSaida) {
      if (ladoSaida === 'esquerda') {
        this.pontuacaoDireita.incrementar();
        this.bola.reposicionarCentro(this.largura, this.altura, 1);
      } else if (ladoSaida === 'direita') {
        this.pontuacaoEsquerda.incrementar();
        this.bola.reposicionarCentro(this.largura, this.altura, -1);
      } else return;
      this.som.tocarPonto();
      if (this.jogoTerminou()) this.estado = 'FIM';
    }

    atualizar() {
      if (this.estado !== 'JOGANDO') return;
      this.atualizarRaquetes();
      if (this.bola.atualizar(this.altura, this.campo.espessuraBorda) === 'parede') this.som.tocarColisao();
      this.tratarColisoes();
      this.marcarPonto(this.bola.verificarBordaHorizontal(this.largura));
    }

    desenharMensagem(titulo, subtitulo) {
      const p = this.p;
      p.noStroke();
      p.fill(5, 9, 18, 220);
      p.rect(145, this.altura / 2 - 62, this.largura - 290, 124, 12);
      p.fill(255);
      p.textFont('monospace');
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(25);
      p.text(titulo, this.largura / 2, this.altura / 2 - 18);
      p.fill(167, 243, 208);
      p.textSize(15);
      p.text(subtitulo, this.largura / 2, this.altura / 2 + 25);
    }

    desenhar() {
      this.campo.desenhar(this.p);
      this.raqueteEsquerda.desenhar(this.p);
      this.raqueteDireita.desenhar(this.p);
      this.bola.desenhar(this.p);
      this.pontuacaoEsquerda.desenhar(this.p, this.largura / 2 - 76, 22);
      this.pontuacaoDireita.desenhar(this.p, this.largura / 2 + 76, 22);
      if (this.estado === 'INICIAL') this.desenharMensagem('PONG', 'ESPAÇO ou ENTER inicia · I alterna o modo');
      else if (this.estado === 'PAUSA') this.desenharMensagem('PAUSA', 'Prima P para continuar');
      else if (this.estado === 'FIM') {
        const vencedor = this.pontuacaoEsquerda.pontuacao > this.pontuacaoDireita.pontuacao ? 'JOGADOR 1' : (this.modoComputador ? 'COMPUTADOR' : 'JOGADOR 2');
        this.desenharMensagem(vencedor + ' VENCEU', 'ESPAÇO ou ENTER para uma nova partida');
      }
    }
  }

  global.Jogo = Jogo;
  if (typeof module !== 'undefined' && module.exports) module.exports = Jogo;
}(typeof globalThis !== 'undefined' ? globalThis : this));
