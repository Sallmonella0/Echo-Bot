module.exports = {
  name: 'coinflip',
  async execute(interaction) {
    const resultado = Math.random() < 0.5 ? '🪙 Cara!' : '🪙 Coroa!';
    return interaction.reply(resultado);
  }
};