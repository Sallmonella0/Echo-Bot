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
        GatewayIntentBits.GuildMembers // IMPORTANTE para pegar membros
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

function enviarMensagem(channel, conteudo) {
    channel.send(conteudo).catch(console.error);
}

// Evento de mensagem
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignorar bots

    // Se o bot for mencionado
    if (message.mentions.has(client.user)) {
        enviarMensagem(message.channel, 'Oi! Você me mencionou? Digite `!ajuda` para ver o que eu posso fazer!');
        return;
    }

    const conteudo = message.content.trim().toLowerCase();

    // Regex para rolagem tipo "2d6" ou "d12"
    const regex = /^(\d*)d(\d+)$/i;
    const match = conteudo.match(regex);

    if (match) {
        const qtd = parseInt(match[1]) || 1; // Se vazio, assume 1
        const max = parseInt(match[2]);

        if (qtd > 0 && max > 0 && max <= 12) {
            const resultados = rolarDado(qtd, max);
            const emojis = resultados.map(gerarEmoji);
            const mensagemFinal = emojis.map((emoji, i) => `${i + 1}: ${emoji}`).join('\n');
            enviarMensagem(message.channel, mensagemFinal);
        } else {
            enviarMensagem(message.channel, '❌ Por favor, use valores válidos (máximo 12 faces).');
        }
        return;
    }

    // Comandos fixos
    switch (conteudo) {
        case '!ajuda':
            {
                const textoAjuda = Object.entries(COMANDOS)
                    .map(([comando, descricao]) => `${comando} – ${descricao}`)
                    .join('\n');
                enviarMensagem(message.channel, `📋 Comandos disponíveis:\n${textoAjuda}`);
            }
            break;

        case '!ping':
            enviarMensagem(message.channel, 'Pong! O bot está online.');
            break;

        case '!info':
            enviarMensagem(message.channel, 'Sou um bot de dados! Use `!ajuda` para ver o que posso fazer.');
            break;

        case '!rollhelp':
            enviarMensagem(message.channel,
                'Role dados de até no máximo 12 faces.\n' +
                'Use o comando no formato xdy. Exemplo: 2d6 rola dois dados de 6 faces.'
            );
            break;

        default:
            // Se quiser, pode adicionar resposta para comandos não reconhecidos
            break;
    }
});

// Rota web para exibir servidores e membros
app.get('/', async (req, res) => {
    try {
        const guilds = client.guilds.cache;
        let resposta = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <title>Painel do Bot</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #121212; color: #eee; margin: 20px; }
                    h2 { color: #61dafb; }
                    ul { list-style-type: none; padding-left: 0; }
                    li { background: #222; margin: 5px 0; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h2>🤖 Bot está em ${guilds.size} servidor(es):</h2>
                <ul>
        `;

        for (const [id, guild] of guilds) {
            try {
                const membros = await guild.members.fetch({ withPresences: false });
                resposta += `<li><strong>${guild.name}</strong> - ${membros.size} membros</li>`;
            } catch (e) {
                resposta += `<li><strong>${guild.name}</strong> - Erro ao buscar membros</li>`;
            }
        }

        resposta += `
                </ul>
            </body>
            </html>
        `;
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
