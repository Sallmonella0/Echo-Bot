module.exports = {
  name: 'ping',
  description: 'Responde com pong!',
  async execute(message) {
    message.reply('Pong!');
  }
};
