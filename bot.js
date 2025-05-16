const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Carrega variáveis de ambiente do .env

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const commands = new Map();

// Carrega os comandos da pasta commands/
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`✅ Bot está online como ${client.user.tag}`);
});

// Evento principal de mensagens
client.on('messageCreate', message => {
  if (message.author.bot) return;

  const content = message.content.trim();

  // Verifica se é um comando com prefixo "!"
  if (content.startsWith('!')) {
    const [cmdName, ...args] = content.slice(1).split(' ');
    const command = commands.get(cmdName);

    if (command) {
      try {
        command.execute(message, client, args);
      } catch (err) {
        console.error(err);
        message.reply('❌ Ocorreu um erro ao executar o comando.');
      }
    }
    return;
  }

  // Verifica se é um comando de rolagem de dados (ex: 2d6, 1d20)
  const rollRegex = /^(\d+)d(\d+)$/i;
  const match = content.match(rollRegex);
  if (match) {
    const rollCommand = commands.get('roll');
    if (rollCommand) {
      try {
        rollCommand.execute(message, match[1], match[2]);
      } catch (err) {
        console.error(err);
        message.reply('❌ Erro ao rolar dados.');
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
