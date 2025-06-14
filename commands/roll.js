const { rolarDado, gerarEmoji } = require('../utils/dadosUtils');
const fs = require('fs');
const path = require('path');

function resultadoPorExtenso(numero) {
  switch (numero) {
    case 1: case 2: return 'vazio';
    case 3: case 4: case 5: return 'adaptação';
    case 6: case 7: case 8: return 'pressão';
    case 9: case 10: case 11: case 12: return 'sucesso';
    default: return 'desconhecido';
  }
}

module.exports = {
  name: 'roll',
  tipo: 'padrao',
  execute(message, conteudo) {
    const regex = /^(\d*)d(\d+)$/i;
    const match = conteudo.match(regex);

    if (match) {
      const qtd = parseInt(match[1]) || 1;
      const max = parseInt(match[2]);

      if (qtd > 0 && max > 0 && max <= 12) {
        const resultados = rolarDado(qtd, max);
        const emojis = resultados.map(gerarEmoji);
        const resposta = emojis.join('\n');

        // Salvar histórico com emojis e resultadoExtenso
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
            resultado: resultados,
            resultadoExtenso: resultados.map(resultadoPorExtenso),
            emojis: emojis,
            data: new Date().toISOString()
          });
          fs.writeFileSync(filePath, JSON.stringify(historico, null, 2));
        }


        message.channel.send(resposta);
      } else {
        message.channel.send('❌ Por favor, use valores válidos (máximo 12 faces).');
      }
      return true;
    }
    return false;
  }
};
