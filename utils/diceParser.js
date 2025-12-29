
const REGEX = /^(\d*)d(\d+)([+-]\d+)?$/i;

function parseDice(texto) {
  if (!texto) return null;

  const match = texto.trim().match(REGEX);
  if (!match) return null;

  const qtd = parseInt(match[1]) || 1;
  const max = parseInt(match[2]);
  const mod = parseInt(match[3] || 0);

  if (qtd < 1 || qtd > 20) return null;
  if (max < 2 || max > 100) return null;

  return { qtd, max, mod };
}

module.exports = { parseDice };