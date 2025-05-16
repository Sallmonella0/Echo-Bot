// bot.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

// Página Web
app.use(express.static(path.join(__dirname, 'public')));

// Rota para fornecer dados do bot
app.get('/dados', async (req, res) => {
  try {
    const guilds = client.guilds.cache;
    let totalMembros = 0;
    const servidores = [];

    for (const [id, guild] of guilds) {
      try {
        const membros = await guild.members.fetch();
        totalMembros += membros.size;
        servidores.push({ nome: guild.name, membros: membros.size });
      } catch (e) {
        servidores.push({ nome: guild.name, membros: 'Erro' });
      }
    }

    const uptimeSegundos = Math.floor(process.uptime());
    const horas = Math.floor(uptimeSegundos / 3600);
    const minutos = Math.floor((uptimeSegundos % 3600) / 60);
    const uptimeFormatado = `${horas}h ${minutos}min`;

    res.json({
      totalServidores: guilds.size,
      totalMembros,
      uptime: uptimeFormatado,
      servidores
    });
  } catch (erro) {
    console.error('Erro ao obter dados do bot:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Inicia servidor web
app.listen(PORT, () => {
  console.log(`🌐 Painel disponível em http://localhost:${PORT}`);
});

// Eventos do bot
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content === '!ping') {
    message.reply('🏓 Pong!');
  }

  if (content === '!info') {
    const guilds = client.guilds.cache.size;
    const users = client.users.cache.size;
    message.reply(`🤖 Estou em ${guilds} servidor(es) com ${users} usuários.`);
  }
});

// Login do bot
client.login(process.env.TOKEN);
