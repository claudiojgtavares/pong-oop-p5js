const fs = require('fs');
const path = require('path');

const pastaTestes = __dirname;
const ficheiros = [
  'campo.teste.js',
  'raquete.teste.js',
  'bola.teste.js',
  'pontuacao.teste.js',
  'som.teste.js',
  'jogo.teste.js',
];

let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;

console.log('=== Testes do Pong ===');

for (const ficheiro of ficheiros) {
  const caminho = path.join(pastaTestes, ficheiro);
  const modulo = require(caminho);
  const resultado = modulo.run();
  totalPassed += resultado.passed;
  totalFailed += resultado.failed;
  totalSkipped += resultado.skipped;
  console.log(`${resultado.name}: ${resultado.passed} aprovados, ${resultado.failed} falhas, ${resultado.skipped} ignorados`);
}

console.log('---');
console.log(`Total: ${totalPassed + totalFailed + totalSkipped} testes`);
console.log(`Aprovados: ${totalPassed}`);
console.log(`Falhas: ${totalFailed}`);
console.log(`Ignorados: ${totalSkipped}`);

if (totalFailed > 0) {
  process.exit(1);
}
