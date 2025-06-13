const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'historico',
  async execute(message) {
    if (!message.guild) {
      return message.reply('Este comando só pode ser usado em servidores.');
    }
    const guildId = message.guild.id;
    const filePath = path.join(__dirname, '..', 'dados', `${guildId}.json`);
    if (!fs.existsSync(filePath)) {
      return message.reply('Nenhum histórico encontrado para este servidor.');
    }
    const historico = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const userHistorico = historico.filter(item => item.usuario === message.author.tag);
    if (!userHistorico.length) {
      return message.reply('Você ainda não fez nenhuma rolagem neste servidor.');
    }

    // Mostra as últimas 5 rolagens do usuário, com emojis
    const ultimas = userHistorico.slice(-5).map(item =>
      `• ${item.comando} → ${item.emojis ? item.emojis.join(' ') : item.resultado.join(', ')}`
    ).join('\n');

    message.reply(
      `🎲 **Seu histórico de rolagens:**\n${ultimas}`
    );
  }
};