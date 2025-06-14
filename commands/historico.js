const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'historico',
  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'Este comando só pode ser usado em servidores.', ephemeral: true });
    }
    const guildId = interaction.guild.id;
    const filePath = path.join(__dirname, '..', 'dados', `${guildId}.json`);
    if (!fs.existsSync(filePath)) {
      return interaction.reply({ content: 'Nenhum histórico encontrado para este servidor.', ephemeral: true });
    }
    const historico = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const userHistorico = historico.filter(item => item.usuario === interaction.user.tag);
    if (!userHistorico.length) {
      return interaction.reply({ content: 'Você ainda não fez nenhuma rolagem neste servidor.', ephemeral: true });
    }
    

    const ultimas = userHistorico.slice(-5).map(item =>
      `• ${item.comando} → ${item.emojis ? item.emojis.join(' ') : item.resultado.join(', ')}`
    ).join('\n');

    await interaction.reply(
      `🎲 **Seu histórico de rolagens:**\n${ultimas}`
    );
  }
};