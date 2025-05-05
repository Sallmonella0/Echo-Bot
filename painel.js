// painel.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware simples de autenticação por senha
const USER = 'admin';
const PASSWORD = '1234'; // Troque isso por uma senha segura

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth.indexOf('Basic ') === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Painel do Bot"');
    return res.status(401).send('Autenticação requerida.');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [user, password] = credentials.split(':');

  if (user === USER && password === PASSWORD) {
    next();
  } else {
    return res.status(403).send('Credenciais inválidas.');
  }
});

// Rota principal do painel (supondo que client esteja importado ou acessível)
app.get('/', (req, res) => {
  const servidorCount = client.guilds.cache.size;
  const usuarioCount = client.users.cache.size;

  let servidores = '';
  client.guilds.cache.forEach(guild => {
    servidores += `<li>${guild.name} (${guild.id})</li>`;
  });

  res.send(`
    <html>
    <head><title>Painel do Bot</title></head>
    <body>
      <h1>Painel de Administração do Bot</h1>
      <p><strong>Total de Servidores:</strong> ${servidorCount}</p>
      <p><strong>Total de Usuários:</strong> ${usuarioCount}</p>
      <h3>Servidores:</h3>
      <ul>${servidores}</ul>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Painel rodando em http://localhost:${PORT}`);
});

const client = require('./bot'); // ou './index' dependendo do nome do seu arquivo
