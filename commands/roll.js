const { rolarDado, gerarEmoji } = require('../utils/dadoUtils');

module.exports = {
  nome: 'rolagem',
  tipo: 'padrao', // tipo "padrao" = comando sem prefixo (!)
  executar(message, conteudo) {
    const regex = /^(\d*)d(\d+)$/i;
    const match = conteudo.match(regex);

    if (match) {
      const qtd = parseInt(match[1]) || 1;
      const max = parseInt(match[2]);

      if (qtd > 0 && max > 0 && max <= 12) {
        const resultados = rolarDado(qtd, max);
        const emojis = resultados.map(gerarEmoji);
        const resposta = emojis.map((emoji, i) => `${i + 1}: ${emoji}`).join('\n');
        message.channel.send(resposta);
      } else {
        message.channel.send('❌ Por favor, use valores válidos (máximo 12 faces).');
      }
      return true; // sinaliza que o comando foi tratado
    }

    return false; // não tratou
  }
};
