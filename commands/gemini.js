const axios = require('axios');

module.exports = {
  name: 'ia',
  tipo: 'padrao',
  async execute(message, args) {
    const prompt = typeof args === 'string' ? args : args.join(' ');
    if (!prompt) {
      return message.reply('Envie uma mensagem após o comando, exemplo: @Echo O que é IA?');
    }
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCQjYMzxUbhcl41O12kqRVTGtg7vd4tjPk',
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );
      const resposta = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (resposta) {
        message.reply(resposta.slice(0, 1800));
      } else {
        message.reply('❌ Não foi possível obter resposta da IA.');
      }
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      message.reply('❌ Erro ao consultar a IA.');
    }
  }
};