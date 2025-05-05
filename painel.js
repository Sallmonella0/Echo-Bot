const express = require('express');
const client = require('./bot'); // importar o client

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    if (!client.isReady()) {
        return res.send('⏳ O bot ainda está inicializando...');
    }

    const servidores = await Promise.all(
        client.guilds.cache.map(async (guild) => {
            const members = await guild.members.fetch(); // garante que memberCount esteja atualizado
            return `
                <li>
                    <strong>${guild.name}</strong><br>
                    🆔 ID: ${guild.id}<br>
                    👥 Membros: ${members.size}
                </li>`;
        })
    );

    res.send(`
        <h2>🤖 Painel do Bot</h2>
        <p>O bot está em <strong>${client.guilds.cache.size}</strong> servidores.</p>
        <ul>${servidores.join('<br>')}</ul>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Painel disponível em http://localhost:${PORT}`);
});
