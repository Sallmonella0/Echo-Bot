const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// === BOT DISCORD ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

// Variável para armazenar hora de início (uptime)
const botStartTime = Date.now();

// Login do bot
client.once('ready', () => {
  console.log(`🤖 Bot está online como ${client.user.tag}`);
});

client.login(process.env.TOKEN);

// === SERVIDOR EXPRESS ===

// Servir arquivos estáticos do diretório 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para fornecer estatísticas do bot
app.get('/api/estatisticas', async (req, res) => {
  if (!client || !client.user) {
    return res.status(503).json({ error: 'Bot ainda não está pronto.' });
  }

  const servidores = client.guilds.cache.size;
  const usuarios = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

  const uptimeMs = Date.now() - botStartTime;
  const uptimeHoras = Math.floor(uptimeMs / (1000 * 60 * 60));
  const uptimeMinutos = Math.floor((uptimeMs / (1000 * 60)) % 60);

  res.json({
    servidores,
    usuarios,
    uptime: `${uptimeHoras}h ${uptimeMinutos}min`
  });
});

// Iniciar servidor web
app.listen(PORT, () => {
  console.log(`🌐 Painel disponível em: http://localhost:${PORT}`);
});
