const discord = require('discord.js');
const { bot_token } = require('./creds.json');
// const admin = require('firebase-admin');

// const serviceAccount = require('./firebase.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://capaural-717e1.firebaseio.com"
// });

const client = new discord.Client;
client.once('ready', () => {
  console.log('Enigma bot is online !');
});

client.on('message', msg => {
  //   Check if message is a dm
  if (msg.channel.type == "dm") {

  } else {

    switch (msg.content) {
      case "-dm me":
        msg.author.send("Oui mon petit coco ?");
        break;
      case "-leaderboard":
        msg.send("Leaderboard:");
        break;
      case "-infos":
        msg.send("Affiche des infos sur les différents groupes, voir autres choses...");
      default:
        helpMessage(msg);
    }
  }
});

function helpMessage(msg) {
  const res = "Bienvenue dans l'aide du Bot Enigma";
  msg.send(res);
}

client.login(bot_token);