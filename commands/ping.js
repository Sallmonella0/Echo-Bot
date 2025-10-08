module.exports = {
  name: 'ping',
  async execute(arg) {
    if (arg.reply) {
      // Mensagem de texto
      arg.reply('pong!');
    } else if (arg.isChatInputCommand && arg.isChatInputCommand()) {
      // Slash command
      await arg.reply('pong!');
    }
  }
};