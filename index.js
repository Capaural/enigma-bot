const discord = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./private/firebase.json');
const { bot_token } = require('./private/creds.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capaural-717e1.firebaseio.com"
});

const db = admin.database();
db.ref('/enigmas').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    global.enigmas = [];
    for (var i in data.solutions) {
      global.enigmas.push(data.solutions[i]);
    }
    console.log(global.enigmas);

    global.teams = [];
    for (var i in data.teams) {
      global.teams.push(data.teams[i]);
    }
    global.teams.sort((a,b) => (a.score < b.score) ? 1 : -1 );
  }
});

// Import all the functions
const utils = require('./utils/utils');
const help = require('./commands/help');
const teams = require('./commands/teams');
const contact = require('./commands/contact');
const report = require('./commands/report');
const submit = require('./commands/submit');
const admin_commands = require('./commands/admin');
const config = require('./utils/config').config;
const rules = require('./commands/rules');

const timeBetweenSubmit = 10;
global.users = {}


const prefix = '-enigma';
const client = new discord.Client;
client.once('ready', () => {
  console.log(utils.logPrefix() + 'Enigma bot is online !');
});


const commands_not_in_dm = {
  'contact': contact.triggerMessage,
  'help': help.helpMessage,
  'sendtemplate': admin_commands.sendTemplate,
  'leaderboard': teams.leaderboard,
  'infos': teams.globalInfos,
  'rules': rules.rulesMessage
}

const commands_in_dm = {
  'create': teams.createTeam,
  'join': teams.joinTeam,
  'infos': teams.infosTeam,
  'report': report.report,
  'submit': submit.submitAnswer,
  'help': help.DMHelpMessage,
  'rules': rules.rulesMessage
}


client.on('message', message => {

  const isDM = message.channel.type == "dm";
  if ((!isDM && !message.content.startsWith(prefix)) || message.author.bot) {
    return;
  }

  const args = message.content.split(' ');
  if (args[0] == prefix) {
    args.shift();
  }

  const command = args.shift().toLowerCase();
  const parameters = args.join(' ').toLowerCase();

  const function_params = {
    message: message,
    db: db,
    client: client,
    config: config
  }

  const map = isDM ? commands_in_dm : commands_not_in_dm;
  const type = (map[command] !== undefined) ? command : 'help';
  map[type](function_params);
});

client.login(bot_token);