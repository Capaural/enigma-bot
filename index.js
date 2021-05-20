const discord = require('discord.js');
const { bot_token } = require('./creds.json');

const client = new discord.Client;
client.once('ready', () => {
  console.log('Enigma bot is online !');
});

client.login(bot_token);