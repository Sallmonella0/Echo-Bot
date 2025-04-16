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
    for (let i = 0; i < qtd; i++) {
        const resultado = Math.floor(Math.random() * max) + 1; // Gera um número entre 1 e 'max'
        resultados.push(resultado);
        console.log(`Dado rolado: ${resultado}`);  // Log para depuração
    }
    return resultados;  // Retorna um array com os resultados de cada dado rolado
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

    const conteudo = message.content.trim(); // Conteúdo da mensagem

    // Se o comando começa com '!' e segue o formato 'xDy'
    const regex = /^!(\d+)D(\d+)$/; // Regex para verificar comandos como !2D8
    const match = conteudo.match(regex);
    if (match) {
        const qtd = parseInt(match[1]);  // Quantidade de dados (x)
        const max = parseInt(match[2]);  // Faces do dado (y)

        if (qtd > 0 && max > 0) {
            const resultados = rolarDado(qtd, max);  // Rola os dados

           
            resultados.forEach((resultado, index) => {
                const emoji = gerarEmoji(resultado);  // Converte cada resultado em emoji
                enviarMensagem(message, `Resultado ${index + 1}: ${emoji}`);  // Envia os emojis como resultado
            });
        } else { 
            enviarMensagem(message, 'Por favor, forneça números válidos para a quantidade de rolagens e o número máximo de faces do dado.');
        }
        return;
    }

    // Se o comando não for reconhecido, sugere comandos
    if (conteudo.startsWith('!')) {
        const sugestoes = sugerirComandos(conteudo);
        if (sugestoes.length > 0) {
            enviarMensagem(message, 'Não encontrei comandos correspondentes. Tente algo como "!ajuda" ou "!ping".');
        }
        return;
    }

    // Comando !ajuda a a
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
        enviarMensagem(message, 'Este bot foi criado para rolar dados e fornecer informações sobre o jogo. Ele suporta comandos como !xDy para rolar dados e !ajuda para mostrar a lista de comandos.');
        return;
    }

    // Comando !rollhelp
    if (conteudo === '!rollhelp') {
        enviarMensagem(message, 'Use o comando !xDy para rolar dados. Exemplo: !2D6 rola 2 dados de 6 faces. O primeiro número é a quantidade de dados, e o segundo é o número de faces do dado.');
        return;
    }
});

// Inicializando o bot com o token
client.login(process.env.DISCORD_TOKEN);
