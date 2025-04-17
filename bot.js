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

client.once('ready', () => {
    console.log('Bot está online!');
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

    // Garante que a quantidade seja no mínimo 1
    const quantidade = qtd > 0 ? qtd : 1;

    for (let i = 0; i < quantidade; i++) {
        const resultado = Math.floor(Math.random() * max) + 1; // Gera número entre 1 e 'max'
        resultados.push(resultado);
        console.log(`Dado rolado: ${resultado}`);
    }

    return resultados; // Retorna um array com os resultados
}


// Função para gerar o emoji correspondente ao valor do dado
function gerarEmoji(numero) {
    const emojis = [
        '🚫', '🚫', '🐱', '🐱🦌', '🐱🦌', '🐞', '🐞🐞', '🐞🦌', '🐞🦌🐱', '🐞🐞🐱', '🐞🦌🦌🐱', '🐱🐱'
    ];
    return emojis[numero - 1] || '🎲'; // Fallback para quando não encontrar um emoji específico
}

// Função para enviar mensagens com base nos comandos
function enviarMensagem(message, conteudo) {
    message.channel.send(conteudo);
}

// Processamento das mensagens recebidas
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignora mensagens de outros bots

    if (message.mentions.has(client.user)) {
        enviarMensagem(message, 'Oi! Você me mencionou? Precisa de ajuda? Digite `!ajuda` para ver o que eu posso fazer!');
        return;
    }

    const conteudo = message.content.trim().toLowerCase(); // Conteúdo da mensagem

    // Se o comando segue o formato 'xDy'
    const regex = /^(\d*)d(\d+)$/i; // Regex agora aceita !D6 e !2D6
    const match = conteudo.match(regex);
    if (match) {
        const qtd = match[1] ? parseInt(match[1]) : 1; // Se não houver número antes do D, assume 1
        const max = parseInt(match[2]); // Número de faces do dado

        if (qtd > 0 && max > 0) {
                const resultados = rolarDado(qtd, max);
                const emojis = resultados.map(gerarEmoji);
                const mensagemFinal = emojis.map((e, i) => `Resultado ${i + 1}: ${e}`).join('\n');
            
                enviarMensagem(message, `🎲 Resultados:\n${mensagemFinal}`);
                return;
            }else { 
            enviarMensagem(message, 'Por favor, forneça números válidos para a quantidade de rolagens e o número máximo de faces do dado.');
        }
        return;
    }


    if (conteudo === '!ajuda') {
        const textoAjuda = Object.entries(COMANDOS)
            .map(([comando, descricao]) => `${comando} – ${descricao}`)
            .join('\n');
    
        enviarMensagem(message, `📋 Aqui estão os comandos disponíveis:\n${textoAjuda}`);
        return;
    }

    // Comando !ping
    if (conteudo === '!ping') {
        enviarMensagem(message, 'Pong! O bot está online.');
        return;
    }

    // Comando !info
    if (conteudo === '!info') {
        enviarMensagem(message, 'Este bot foi criado para rolar dados e fornecer informações sobre o jogo. Ele suporta comandos como !ajuda para mostrar a lista de comandos.');
        return;
    }

    // Comando !rollhelp a
    if (conteudo === '!rollhelp') {
        enviarMensagem(message, 'Use o comando xdy para rolar dados. Exemplo: 2d6 rola 2 dados de 6 faces. O primeiro número é a quantidade de dados, e o segundo é o número de faces do dado.');
        return;
    }
});

// Inicializando o bot com o token
client.login(process.env.DISCORD_TOKEN);
