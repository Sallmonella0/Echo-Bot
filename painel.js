const express = require('express');
const client = require('./bot'); // Importa o bot

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    if (!client.isReady()) {
        return res.send('⏳ Bot ainda está iniciando...');
    }

    const servidores = client.guilds.cache.map(guild => `• ${guild.name} (${guild.memberCount} membros)`).join('<br>');
    res.send(`
        <h2>🤖 Painel do Bot</h2>
        <p>Conectado a <strong>${client.guilds.cache.size}</strong> servidores:</p>
        <p>${servidores}</p>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Painel disponível em: http://localhost:${PORT}`);
});
