require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const COMANDOS = {
    '!ajuda': 'Mostra a lista de comandos disponíveis',
    '!status': 'Mostra os status do personagem',
    '!assimilacao': 'Ativa ou verifica uma assimilação',
    '!info': 'Mostra informações sobre o bot',
    '!rollhelp': 'Explica como usar o comando !xDy para rolar dados',
    '!ping': 'Responde com "Pong!" para verificar se o bot está online'
};

function enviarMensagem(message, conteudo) {
    message.channel.send(conteudo);
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
            enviarMensagem(message, 'Use números válidos para rolagem de dados.');
        }
        return;
    }

    if (conteudo === '!ajuda') {
        const textoAjuda = Object.entries(COMANDOS)
            .map(([comando, desc]) => `${comando} – ${desc}`).join('\n');
        enviarMensagem(message, `📋 Comandos disponíveis:\n${textoAjuda}`);
        return;
    }

    if (conteudo === '!ping') {
        enviarMensagem(message, 'Pong!');
        return;
    }

    if (conteudo === '!info') {
        enviarMensagem(message, 'Este bot foi criado para rolar dados e fornecer comandos úteis.');
        return;
    }

    if (conteudo === '!rollhelp') {
        enviarMensagem(message, 'Use o comando xDy para rolar dados. Exemplo: 2d6 rola 2 dados de 6 faces.');
        return;
    }
});

client.once('ready', () => {
    console.log(`✅ Bot online em ${client.guilds.cache.size} servidores.`);
});

client.login(process.env.DISCORD_TOKEN);

module.exports = client;

