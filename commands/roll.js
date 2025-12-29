const { parseDice } = require('../utils/diceParser');
const { rolarDado, gerarEmoji } = require('../utils/dadosUtils');
const fs = require('fs');
const path = require('path');

function resultadoPorExtenso(numero) {
  switch (numero) {
    case 1:
    case 2:
      return 'vazio';
    case 3:
    case 4:
    case 5:
      return 'adaptação';
    case 6:
    case 7:
    case 8:
      return 'pressão';
    case 9:
    case 10:
    case 11:
    case 12:
      return 'sucesso';
    default:
      return 'desconhecido';
  }
}

module.exports = {
  name: 'roll',
  tipo: 'padrao',

  execute(message, conteudo) {
    const parsed = parseDice(conteudo);
    if (!parsed) return false;

    const { qtd, max, mod } = parsed;

    if (max > 12) {
      message.reply('❌ Para este sistema, o dado máximo é d12.');
      return true;
    }

    const resultados = rolarDado(qtd, max);
    const soma = resultados.reduce((a, b) => a + b, 0);
    const total = soma + mod;

    const emojis = resultados.map(gerarEmoji);

    // Histórico
    if (message.guild) {
      const guildId = message.guild.id;
      const dirPath = path.join(__dirname, '..', 'dados');
      const filePath = path.join(dirPath, `${guildId}.json`);

      fs.mkdirSync(dirPath, { recursive: true });

      let historico = [];
      if (fs.existsSync(filePath)) {
        historico = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }

      historico.push({
        usuario: message.author.tag,
        comando: conteudo,
        resultados,
        resultadoExtenso: resultados.map(resultadoPorExtenso),
        emojis,
        total,
        data: new Date().toISOString()
      });

      fs.writeFileSync(filePath, JSON.stringify(historico, null, 2));
    }

    let resposta =
      `🎲 **${qtd}d${max}${mod ? (mod > 0 ? `+${mod}` : mod) : ''}**\n` +
      `Resultados: ${resultados.join(', ')}\n` +
      `Emojis:\n${emojis.join('\n')}\n` +
      `Total: **${total}**`;

    message.channel.send(resposta);
    return true;
  }
};