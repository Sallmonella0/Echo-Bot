const { parseDice } = require('../utils/diceParser');
const { rolarDado } = require('../utils/dadosUtils');

module.exports = {
  name: 'dados',
  tipo: 'padrao',

  execute(message, conteudo) {
    const parsed = parseDice(conteudo);
    if (!parsed) return false;

    const { qtd, max, mod } = parsed;

    const resultados = rolarDado(qtd, max);
    const soma = resultados.reduce((a, b) => a + b, 0);
    const total = soma + mod;

    message.reply(
      `${total} ⟵ [${resultados.join(', ')}] ${qtd}d${max}${mod ? (mod > 0 ? `+${mod}` : mod) : ''}`
    );

    return true;
  }
};