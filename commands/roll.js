module.exports = {
  name: 'roll',
  description: 'Rola um dado no formato XdY, como 2d6',
  async execute(message, args) {
    const match = args[0]?.match(/^(\d+)d(\d+)$/);
    if (!match) {
      return message.reply('Formato inválido. Use !roll XdY (ex: !roll 2d6)');
    }

    const [ , count, sides ] = match.map(Number);
    if (count > 100 || sides > 1000) {
      return message.reply('Número muito alto. Use valores menores.');
    }

    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);
    message.reply(`🎲 Rolagens: ${rolls.join(', ')} (Total: ${total})`);
  }
};
