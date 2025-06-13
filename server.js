const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de dados
app.get('/api/stats', (req, res) => {
  const uptime = process.uptime();
  const stats = {
    servers: global.bot ? global.bot.guilds.cache.size : 0,
    users: global.bot ? global.bot.users.cache.size : 0,
    uptime: formatUptime(uptime),
  };
  res.json(stats);
});

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

const fs = require('fs');
const path = require('path');

// Retorna o histórico de um servidor
app.get('/api/guild/:guildId/historico', (req, res) => {
  const guildId = req.params.guildId;
  const filePath = path.join(__dirname, 'dados', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return res.json([]);
  const historico = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(historico);
});

app.listen(PORT, () => {
  console.log(`🌐 Painel rodando em http://localhost:${PORT}`);
});
