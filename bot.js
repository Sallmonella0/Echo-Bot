require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
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

// Endpoint para listar servidores
app.get('/api/guilds', (req, res) => {
  const guilds = client.guilds.cache.map(guild => ({
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount
  }));
  res.json(guilds);
});

// Iniciar o painel web
app.listen(PORT, () => {
  console.log(`🌐 Painel rodando em http://localhost:${PORT}`);
});

// Eventos do bot
client.on('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  console.log('Servidores onde o bot está:');
  client.guilds.cache.forEach(guild => {
    console.log(`- ${guild.name} (ID: ${guild.id})`);
  });
});

// Handler para comandos de texto e sem prefixo
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Dados com "2d12" (sem prefixo)
  const regex = /^(\d+)d(\d+)$/i;
  const match = message.content.match(regex);
  if (match) {
    const rollCommand = client.commands.get('roll');
    if (rollCommand && rollCommand.execute(message, message.content)) return;
  }

  // Roll com "as 2d12"
  const rollAsCommand = client.commands.get('roll');
  if (rollAsCommand && rollAsCommand.execute(message, message.content)) return;

  // Dados com "!2d12"
  const dadosCommand = client.commands.get('dados');
  if (dadosCommand && dadosCommand.execute(message, message.content)) return;

  // Se o bot for mencionado
  if (message.mentions.has(client.user)) {
    const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
    const iaCommand = client.commands.get('ia');
    if (iaCommand) {
      iaCommand.execute(message, prompt);
    }
    return;
  }

  // Comandos com prefixo !
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (command) command.execute(message, args);
});

// Handler para slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Erro ao executar o comando!', ephemeral: true });
  }
});

// Handlers de erro para debug
client.on('error', error => {
  console.error('Erro no client:', error);
});
client.on('shardError', error => {
  console.error('Shard error:', error);
});
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login do bot
console.log('Iniciando login do bot...');
client.login(process.env.TOKEN);