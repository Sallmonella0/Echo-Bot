require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
const PORT = 3000;

// Inicializa o bot com as intents necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // IMPORTANTE!
    ]
});

client.once('ready', () => {
    console.log('🤖 Bot está online!');
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
        const qtd = match[1] ? parseInt(match[1]) : 1;
        const max = parseInt(match[2]);

        if (qtd > 0 && max > 0) {
            const resultados = rolarDado(qtd, max);
            const emojis = resultados.map(gerarEmoji);
            const mensagemFinal = emojis.map((emoji, i) => `${i + 1}: ${emoji}`).join('\n');
            enviarMensagem(message, `🎲 Resultados:\n${mensagemFinal}`);
        } else {
            enviarMensagem(message, 'Por favor, use valores válidos para a rolagem.');
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
        enviarMensagem(message, 'Use o comando no formato `xdy`. Exemplo: `2d6` rola dois dados de 6 faces.');
        return;
    }
});

// Rota web para exibir servidores e membros
app.get('/', async (req, res) => {
    try {
        const guilds = client.guilds.cache;
        let resposta = `<h2>🤖 Bot está em ${guilds.size} servidores:</h2><ul>`;

        for (const [id, guild] of guilds) {
            try {
                const membros = await guild.members.fetch({ withPresences: false });
                resposta += `<li>${guild.name} - ${membros.size} membros</li>`;
            } catch (e) {
                resposta += `<li>${guild.name} - Erro ao buscar membros</li>`;
            }
        }

        resposta += '</ul>';
        res.send(resposta);
    } catch (erro) {
        console.error('Erro na rota /:', erro);
        res.status(500).send("Erro ao buscar informações dos servidores.");
    }
});

// Inicia servidor Express
app.listen(PORT, () => {
    console.log(`🌐 Painel disponível em http://localhost:${PORT}`);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);
