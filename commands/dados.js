module.exports = {
  name: 'dados',
  tipo: 'padrao',
  execute(message, conteudo) {
    const regex = /^!(\d+)d(\d+)$/i;
    const match = conteudo.match(regex);

    if (match) {
      const qtd = parseInt(match[1]);
      const lados = parseInt(match[2]);
      if (qtd < 1 || qtd > 20 || lados < 2 || lados > 100) {
        return message.reply('Máximo 20 dados e lados entre 2 e 100.');
      }
      const resultados = [];
      for (let i = 0; i < qtd; i++) {
        resultados.push(Math.floor(Math.random() * lados) + 1);
      }
      const soma = resultados.reduce((a, b) => a + b, 0);
      message.reply(`${soma}  ⟵ [${resultados.join(', ')}] ${qtd}d${lados}`);
      return true;
    }
    return false;
  }
};