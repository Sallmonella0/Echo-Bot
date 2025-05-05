require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = 3000;

// Inicializa o bot
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers // <- ADICIONE ESTA LINHA
    ]
  });
  

// Comandos disponíveis
const COMANDOS = {
    '!ajuda': 'Mostra a lista de comandos disponíveis',
    '!status': 'Mostra os status do personagem',
    '!assimilacao': 'Ativa ou verifica uma assimilação',
    '!info': 'Mostra informações sobre o bot',
    '!rollhelp': 'Explica como usar o comando !xDy para rolar dados',
    '!ping': 'Responde com "Pong!" para verificar se o bot está online'
};

// Funções auxiliares
function sugerirComandos(input) {
    return Object.entries(COMANDOS)
        .filter(([comando]) => comando.toLowerCase().startsWith(input.toLowerCase()))
        .map(([comando, descricao]) => `${comando} – ${descricao}`);
}

function rolarDado(qtd, max) {
    const resultados = [];
    const quantidade = qtd > 0 ? qtd : 1;
    for (let i = 0; i < quantidade; i++) {
        const resultado = Math.floor(Math.random() * max) + 1;
        resultados.push(resultado);
    }
    return resultados;
}

function gerarEmoji(numero) {
    const emojis = [
        '🚫', '🚫', '🐱', '🐱🦌', '🐱🦌', '🐞', '🐞🐞', '🐞🦌', '🐞🦌🐱', '🐞🐞🐱', '🐞🦌🦌🐱', '🐱🐱'
    ];
    return emojis[numero - 1] || '🎲';
}

function enviarMensagem(message, conteudo) {
    message.channel.send(conteudo);
}

// Evento de mensagens
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        enviarMensagem(message, 'Oi! Você me mencionou? Digite `!ajuda` para ajuda!');
        return;
    }

    const conteudo = message.content.trim().toLowerCase();
    const regex = /^(\d*)d(\d+)$/i;
    const match = conteudo.match(regex);
    if (match) {
        const qtd = match[1] ? parseInt(match[1]) : 1;
        const max = parseInt(match[2]);
        if (qtd > 0 && max > 0) {
            const resultados = rolarDado(qtd, max);
            const emojis = resultados.map(gerarEmoji);
            const mensagemFinal = emojis.map((emoji, i) => `${i + 1}: ${emoji}`).join('\n');
            enviarMensagem(message, `Resultados:\n${mensagemFinal}`);
        } else {
            enviarMensagem(message, 'Números inválidos para o dado.');
        }
        return;
    }

    if (conteudo === '!ajuda') {
        const textoAjuda = Object.entries(COMANDOS)
            .map(([comando, descricao]) => `${comando} – ${descricao}`)
            .join('\n');
        enviarMensagem(message, `📋 Comandos:\n${textoAjuda}`);
        return;
    }

    if (conteudo === '!ping') {
        enviarMensagem(message, 'Pong!');
        return;
    }

    if (conteudo === '!info') {
        enviarMensagem(message, 'Sou um bot para rolar dados e auxiliar em jogos!');
        return;
    }

    if (conteudo === '!rollhelp') {
        enviarMensagem(message, 'Use `xdy`, exemplo: `2d6` para rolar dois dados de 6 faces.');
        return;
    }
});

// Quando o bot estiver pronto
client.once('ready', () => {
    console.log(`🤖 Bot online como ${client.user.tag}`);
});

// Painel web
app.get('/', async (req, res) => {
    if (!client.isReady()) {
        return res.send('⏳ O bot ainda está inicializando...');
    }

    const guilds = await Promise.all(
        client.guilds.cache.map(async (guild) => {
            const members = await guild.members.fetch();
            return `
                <li>
                    <strong>${guild.name}</strong> (ID: ${guild.id})<br>
                    👥 ${members.size} membros
                </li>`;
        })
    );

    res.send(`
        <h1>🔧 Painel de Administração do Bot</h1>
        <p>Servidores conectados: ${client.guilds.cache.size}</p>
        <ul>${guilds.join('')}</ul>
    `);
});

// Inicia servidor web
app.listen(PORT, () => {
    console.log(`🌐 Painel disponível em http://localhost:${PORT}`);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);
