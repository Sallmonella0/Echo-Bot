require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa o bot com as intents necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log('🤖 Bot está online!');
});

// Comandos disponíveis
const COMANDOS = {
    '!ajuda': 'Mostra a lista de comandos disponíveis',
    '!info': 'Mostra informações sobre o bot',
    '!rollhelp': 'Explica como usar o comando !xDy para rolar dados',
    '!ping': 'Responde com "Pong!" para verificar se o bot está online'
};

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
        '🚫', '🚫', '🐱', '🐱🦌', '🐱🦌', '🐞',
        '🐞🐞', '🐞🦌', '🐞🦌🐱', '🐞🐞🐱',
        '🐞🦌🦌🐱', '🐱🐱'
    ];
    return emojis[numero - 1] || '🎲';
}

function enviarMensagem(message, conteudo) {
    message.channel.send(conteudo);
}

// Evento de mensagem
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        enviarMensagem(message, 'Oi! Você me mencionou? Digite `!ajuda` para ver o que eu posso fazer!');
        return;
    }

    const conteudo = message.content.trim().toLowerCase();
    const regex = /^(\d*)d(\d+)$/i;
    const match = conteudo.match(regex);

    if (match) {
        const qtd = parseInt(match[1]) || 1;
        const max = parseInt(match[2]);

        if (qtd > 0 && max > 0 && max <= 12) {
            const resultados = rolarDado(qtd, max);
            const emojis = resultados.map(gerarEmoji);
            const mensagemFinal = emojis.map((emoji, i) => `${i + 1}: ${emoji}`).join('\n');
            enviarMensagem(message, `🎲 Resultados:\n${mensagemFinal}`);
        } else {
            enviarMensagem(message, '❌ Por favor, use valores válidos (máximo 12 faces).');
        }
        return;
    }

    if (conteudo === '!ajuda') {
        const textoAjuda = Object.entries(COMANDOS)
            .map(([comando, descricao]) => `${comando} – ${descricao}`)
            .join('\n');
        enviarMensagem(message, `📋 Comandos disponíveis:\n${textoAjuda}`);
        return;
    }

    if (conteudo === '!ping') {
        enviarMensagem(message, 'Pong! O bot está online.');
        return;
    }

    if (conteudo === '!info') {
        enviarMensagem(message, 'Sou um bot de dados! Use `!ajuda` para ver o que posso fazer.');
        return;
    }

    if (conteudo === '!rollhelp') {
        enviarMensagem(message,
            '🎲 Role dados de até no máximo 12 faces.\nUse o comando no formato xdy. Exemplo: 2d6 rola dois dados de 6 faces.');
        return;
    }
});

// Rota adicional (JSON dinâmico, opcional)
app.get('/api/servidores', async (req, res) => {
    try {
        const guilds = client.guilds.cache;
        const data = [];

        for (const [id, guild] of guilds) {
            try {
                const membros = await guild.members.fetch({ withPresences: false });
                data.push({ nome: guild.name, membros: membros.size });
            } catch {
                data.push({ nome: guild.name, membros: 'Erro ao buscar' });
            }
        }

        res.json(data);
    } catch (erro) {
        console.error('Erro na rota /api/servidores:', erro);
        res.status(500).send("Erro ao buscar informações.");
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🌐 Painel disponível em http://localhost:${PORT}`);
});

// Login no bot
client.login(process.env.DISCORD_TOKEN);
