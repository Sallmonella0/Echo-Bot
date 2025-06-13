require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Discord Bot Setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Carregar comandos da pasta
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Express Setup
const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de estatísticas
app.get('/api/stats', (req, res) => {
  const stats = {
    servers: client.guilds.cache.size,
    users: client.users.cache.size,
    uptime: client.uptime ? formatUptime(client.uptime) : 'Bot offline'
  };
  res.json(stats);
});

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

// Endpoint de histórico por servidor
app.get('/api/guild/:guildId/historico', (req, res) => {
  const guildId = req.params.guildId;
  const filePath = path.join(__dirname, 'dados', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return res.json([]);
  const historico = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(historico);
});

// Iniciar o painel web
app.listen(PORT, () => {
  console.log(`🌐 Painel rodando em http://localhost:${PORT}`);
});

// Eventos do bot
client.on('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Detecção de padrão XdY
  const diceRegex = /^(\d+)d(\d+)$/i;
  const match = message.content.match(diceRegex);
  if (match) {
    const rollCommand = client.commands.get('roll');
    if (rollCommand) rollCommand.execute(message, message.content);
    return;
  }

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (command) command.execute(message, args);
});

// Login do bot
client.login(process.env.TOKEN);
