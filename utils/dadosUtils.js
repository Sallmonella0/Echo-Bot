function rolarDado(qtd, max) {
  const resultados = [];
  for (let i = 0; i < qtd; i++) {
    const resultado = Math.floor(Math.random() * max) + 1;
    resultados.push(resultado);
  }
  return resultados;
}

function gerarEmoji(numero) {
  const emojis = [
    '🚫', '🚫', '🐱', '🐱🦌', '🐱🦌', '🐞', '🐞🐞', '🐞🦌',
    '🐞🦌🐱', '🐞🐞🐱', '🐞🦌🦌🐱', '🐱🐱'
  ];
  return emojis[numero - 1] || '🎲';
}

module.exports = { rolarDado, gerarEmoji };
