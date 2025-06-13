module.exports = {
  name: 'ajuda',
  execute(message) {
    message.reply(
      `📝 **Comandos disponíveis:**\n` +
      `• **@Echo** Perguntas respondidas por IA\n` +
      `• **XdY** — Rola X dados de Y lados (ex:3d6)\n` +
      `• **!ajuda** — Mostra esta mensagem de ajuda\n` +
      '• **!ping** — Responde com Pong!\n' +
      '• **!historico** — Mostra o histórico de rolagens do servidor\n' 

    );
  }
};
