const fs = require('fs');
const path = require('path');

function execute(message, conteudo) {
  const regex = /^(\d*)d(\d+)$/i;
  const match = conteudo.match(regex);

  if (match) {
    const qtd = parseInt(match[1]) || 1;
    const max = parseInt(match[2]);

    if (qtd > 0 && max > 0 && max <= 12) {
      const resultados = rolarDado(qtd, max);
      const emojis = resultados.map(gerarEmoji);
      const resposta = emojis.join(' ');

      // Salvar resultado em um JSON por servidor
      if (message.guild) {
        const guildId = message.guild.id;
        const filePath = path.join(__dirname, '..', 'dados', `${guildId}.json`);
        let historico = [];
        if (fs.existsSync(filePath)) {
          historico = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        historico.push({
          usuario: message.author.tag,
          comando: conteudo,
          resultado: resultados,
          data: new Date().toISOString()
        });
        fs.mkdirSync(path.join(__dirname, '..', 'dados'), { recursive: true });
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