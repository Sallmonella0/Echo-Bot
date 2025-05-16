module.exports = {
  name: 'info',
  execute(message, client) {
    const serverCount = client.guilds.cache.size;
    const userCount = client.users.cache.size;
    const uptime = Math.floor(client.uptime / 1000 / 60); // minutos

    message.reply(`ℹ️ Estou em ${serverCount} servidores, com ${userCount} usuários ativos. Uptime: ${uptime} minutos.`);
  },
};
