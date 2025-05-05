const express = require('express');
const client = require('./bot'); // importa o client do bot.js

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    if (!client.isReady()) {
        return res.send('⏳ O bot ainda está inicializando...');
    }

    const servidores = client.guilds.cache.map(guild => {
        return `<li>
            <strong>${guild.name}</strong><br>
            🆔 ID: ${guild.id}<br>
            👥 Membros: ${guild.memberCount}
        </li>`;
    }).join('<br>');

    res.send(`
        <h2>🤖 Painel do Bot</h2>
        <p>O bot está em <strong>${client.guilds.cache.size}</strong> servidores.</p>
        <ul>${servidores}</ul>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Painel disponível em http://localhost:${PORT}`);
});
