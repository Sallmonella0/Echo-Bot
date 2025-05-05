require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Configuração do cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Comandos disponíveis e suas descrições
const COMANDOS = {
    '!ajuda': 'Mostra a lista de comandos disponíveis',
    '!status': 'Mostra os status do personagem',
    '!assimilacao': 'Ativa ou verifica uma assimilação',
    '!info': 'Mostra informações sobre o bot',
    '!rollhelp': 'Explica como usar o comando !xDy para rolar dados',
    '!ping': 'Responde com "Pong!" para verificar se o bot está online'
};

// Função para sugerir comandos com base na entrada do usuário
function sugerirComandos(input) {
    return Object.entries(COMANDOS)
        .filter(([comando]) => comando.toLowerCase().startsWith(input.toLowerCase()))
        .map(([comando, descricao]) => `${comando} – ${descricao}`);
}

// Função para verificar e rolar os dados no formato !xDy
function rolarDado(qtd, max) {
    const resultados = [];
    const quantidade = qtd > 0 ? qtd : 1;

    for (let i = 0; i < quantidade; i++) {
        const resultado = Math.floor(Math.random() * max) + 1;
        resultados.push(resultado);
        console.log(`Dado rolado: ${resultado}`);
    }

    return resultados;
}

// Função para gerar o emoji correspondente ao valor do dado
function gerarEmoji(numero) {
    const emojis = [
        '🚫', '🚫', '🐱', '🐱🦌', '🐱🦌', '🐞',
        '🐞🐞', '🐞🦌', '🐞🦌🐱', '🐞🐞🐱', '🐞🦌🦌🐱', '🐱🐱'
    ];
    return emojis[numero - 1] || '🎲';
}

// Função para enviar mensagens
function enviarMensagem(message, conteudo) {
    message.channel.send(conteudo);
}

// Evento quando o bot estiver online
client.once('ready', () => {
    console.log('Bot está online!');

    // Inicializa o painel web somente quando o bot estiver pronto
    const express = require('express');
    const app = express();
    const PORT = 3000;

    app.get('/', (req, res) => {
        const servidores = client.guilds.cache.map(guild => `• ${guild.name}`).join('<br>');
        res.send(`
            <h1>🤖 Painel do Bot</h1>
            <p>O bot está online em ${client.guilds.cache.size} servidores:</p>
            <p>${servidores}</p>
        `);
    });

    app.listen(PORT, () => {
        console.log(`Painel disponível em http://localhost:${PORT}`);
    });
});

// Evento ao receber mensagens
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
            enviarMensagem(message, `Resultados:\n${mensagemFinal}`);
        } else {
            enviarMensagem(message, 'Por favor, forneça números válidos para quantidade e faces do dado.');
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
        enviarMensagem(message, 'Este bot rola dados e fornece comandos úteis para jogos no Discord.');
        return;
    }

    if (conteudo === '!rollhelp') {
        enviarMensagem(message, 'Use o formato xDy para rolar dados. Ex: 2d6 rola 2 dados de 6 lados.');
        return;
    }
});

// Inicializa o bot com seu token
client.login(process.env.DISCORD_TOKEN);
