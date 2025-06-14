const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('xdy')
    .setDescription('Rola X dados de Y lados (ex: /xdy 2 20)')
    .addIntegerOption(opt =>
      opt.setName('quantidade')
        .setDescription('Quantidade de dados')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('lados')
        .setDescription('Lados do dado')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Cara ou coroa'),
  new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Mostra a lista de comandos'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registrando slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registrados!');
  } catch (error) {
    console.error(error);
  }
})();