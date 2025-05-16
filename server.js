const express = require('express');
const client = require('./bot');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/stats', (req, res) => {
  if (!client || !client.readyAt) {
    return res.status(503).json({ error: 'Bot não iniciado.' });
  }

  const uptime = Math.floor((Date.now() - client.startTime) / 1000);
  res.json({
    guilds: client.guilds.cache.size,
    users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    uptime: uptime
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Painel disponível em http://localhost:${PORT}`);
});
