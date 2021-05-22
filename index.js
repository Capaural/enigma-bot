const discord = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./private/firebase.json');
const { bot_token } = require('./private/creds.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capaural-717e1.firebaseio.com"
});


// Import all the functions
const utils = require('./utils/utils');
const help = require('./commands/help');


const prefix = '-enigma';
const client = new discord.Client;
client.once('ready', () => {
  console.log(utils.logPrefix() + 'Enigma bot is online !');
});


client.on('message', message => {
  // Safety checks
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  // Get commands :
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (message.channel.type == "dm") {

  } else {

    switch (command) {
      case "dm me":
        message.author.send("Oui mon petit coco ?");
        break;
      case "-leaderboard":
        message.send("Leaderboard:");
        break;
      case "-infos":
        message.send("Affiche des infos sur les différents groupes, voir autres choses...");
      default:
        help.helpMessage(message);
    }
  }
});

client.login(bot_token);