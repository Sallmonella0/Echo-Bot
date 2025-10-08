module.exports = {
  name: 'ajuda',
  async execute(interaction) {
    await interaction.reply(
      `📝 **Comandos disponíveis:**\n` +
      `• **@Echo** - Pergunta respondida por IA (ex: @Echo quanto é 1+1?)\n` +
      `• **xdy quantidade lados** — Rola X dados de Y lados (ex: 2d20)\n` +
      `• **/coinflip** — Cara ou coroa\n` +
      `• **/ajuda** — Mostra esta mensagem de ajuda\n`+
      `• **/ping** — Responde com "Pong!"\n` +
      `• **/histórico** — Mostra o histórico de rolagens do usuarios\n`

    );
  }
};
