(function (global) {
  'use strict';

  // Produz efeitos sonoros simples com Web Audio, sem ficheiros externos.
  class Som {
    constructor(AudioContextClass) {
      this.ativado = true;
      this.volume = 0.035;
      this.AudioContextClass = AudioContextClass === undefined
        ? (global.AudioContext || global.webkitAudioContext || null)
        : AudioContextClass;
      this.contexto = null;
    }

    inicializar() {
      if (!this.AudioContextClass || this.contexto) return Boolean(this.contexto);
      try {
        this.contexto = new this.AudioContextClass();
        return true;
      } catch (erro) {
        this.contexto = null;
        return false;
      }
    }

    tocar(frequencia, duracao) {
      if (!this.ativado) return false;
      if (!this.contexto && !this.inicializar()) return false;
      if (this.contexto.state === 'suspended' && typeof this.contexto.resume === 'function') this.contexto.resume();
      const oscilador = this.contexto.createOscillator();
      const ganho = this.contexto.createGain();
      const agora = this.contexto.currentTime;
      oscilador.type = 'square';
      oscilador.frequency.setValueAtTime(frequencia, agora);
      ganho.gain.setValueAtTime(this.volume, agora);
      ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);
      oscilador.connect(ganho);
      ganho.connect(this.contexto.destination);
      oscilador.start(agora);
      oscilador.stop(agora + duracao);
      return true;
    }

    tocarPonto() { return this.tocar(180, 0.18); }
    tocarColisao() { return this.tocar(440, 0.06); }
    alternar() { this.ativado = !this.ativado; return this.ativado; }
  }

  global.Som = Som;
  if (typeof module !== 'undefined' && module.exports) module.exports = Som;
}(typeof globalThis !== 'undefined' ? globalThis : this));
