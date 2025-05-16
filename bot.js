require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const app = express();
const PORT = 3000;

// Servir arquivos estáticos (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Carregar comandos
const comandos = [];
const comandosPath = path.join(__dirname, 'commands');
fs.readdirSync(comandosPath).forEach(file => {
  const comando = require(path.join(comandosPath, file));
  comandos.push(comando);
});

// Quando o bot estiver online
client.once('ready', () => {
  console.log('🤖 Bot está online!');
});

// Lidar com mensagens do Discord
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  const conteudo = message.content.trim();

  // Verifica se a mensagem é uma menção ao bot
  if (message.mentions.has(client.user)) {
    message.channel.send('Oi! Você me mencionou? Digite `!ajuda` para ver o que eu posso fazer!');
    return;
  }

  // Executar comandos
  for (const comando of comandos) {
    if (comando.tipo === 'prefixo' && conteudo.toLowerCase() === comando.nome) {
      comando.executar(message);
      break;
    }

    if (comando.tipo === 'padrao' && comando.executar(message, conteudo)) {
      break;
    }
  }
});

// Rota web dinâmica com dados
app.get('/dados', async (req, res) => {
  try {
    const guilds = client.guilds.cache;
    const dados = [];

    for (const [id, guild] of guilds) {
      try {
        const membros = await guild.members.fetch({ withPresences: false });
        dados.push({ nome: guild.name, membros: membros.size });
      } catch {
        dados.push({ nome: guild.name, membros: 'Erro' });
      }
    }

    res.json({
      servidores: guilds.size,
      membros: dados.reduce((soma, g) => soma + (isNaN(g.membros) ? 0 : g.membros), 0),
      lista: dados,
      uptime: formatarUptime(client.uptime)
    });

  } catch (erro) {
    console.error('Erro ao obter dados:', erro);
    res.status(500).json({ erro: 'Erro ao obter dados do bot.' });
  }
});

// Função para formatar uptime
function formatarUptime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}min`;
}

// Inicia o servidor Express
app.listen(PORT, () => {
  console.log(`🌐 Painel disponível em http://localhost:${PORT}`);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);
