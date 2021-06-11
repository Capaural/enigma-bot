const Team = require('../models/teams.model');
const Player = require('../models/player.model');
const utils = require('../utils/utils');

exports.createTeam = (params) => {
  const db = params.db;
  const msg = params.message;
  const args = msg.content.split(' ');

  if (args.length != 2) {
    msg.author.send('Call the help function here');
    return;
  }

  const teamName = args[1];

  if (teamName.length > 31) {
    msg.author.send('Call the help function here');
    return;
  }

  const alreadyInTeam = global.teams.filter(team => msg.author.id in team.players);
  if (alreadyInTeam.length != 0) {
    const embedMsg = {
      title: 'Attention',
      description: 'Vous appartenez déjà à une équipe !',
      fields: [
        {
          name: 'Code d\'équipe: ' + alreadyInTeam[0].teamID,
          value: 'Ce code est personnel partagez le uniquement avec votre coéquipier'
        }
      ]
    }
    msg.author.send({ embed: embedMsg });
    return;
  }

  let teamID = Math.random().toString(36).substring(7).toUpperCase();

  while (global.teams.filter(team => team.teamID == teamID).length != 0) {
    teamID = Math.random().toString(36).substring(7).toUpperCase();
  }

  const newTeam = new Team(teamName, 0, teamID, { [msg.author.id]: new Player(msg.author.id, msg.author.username) });

  db.ref('/enigmas/teams/').child(teamID).set(newTeam.toJSON(), function (error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log(utils.logPrefix() + "Data saved successfully.");
    }
  });


  const embedMsg = {
    title: 'Félicitations',
    description: 'Votre équipe : ' + teamName + ' est créée !',
    fields: [
      {
        name: 'Jouer à plusieurs',
        value: 'Voici le code pour qu\'une personne puisse rejoindre votre équipe.'
      },
      {
        name: 'Code d\'équipe: ' + teamID,
        value: 'Ce code est personnel partageait le uniquement avec votre coequipier'
      }
    ]
  }
  msg.author.send({ embed: embedMsg });
}

exports.joinTeam = (params) => {
  const db = params.db;
  const msg = params.message;
  const args = msg.content.split(' ');

  if (args.length != 2) {
    msg.author.send('Call the help function here');
    return;
  }

  const teamCode = args[1];

  let foundedTeam = global.teams.filter(team => team.teamID == teamCode);
  let embedMsg;

  const alreadyInTeam = global.teams.filter(team => msg.author.id in team.players);
  if (alreadyInTeam.length != 0) {
    embedMsg = {
      title: 'Attention',
      description: 'Vous appartenez déjà à une équipe !',
      fields: [
        {
          name: 'Code d\'équipe: ' + alreadyInTeam[0].teamID,
          value: 'Ce code est personnel partagez le uniquement avec votre coéquipier'
        }
      ]
    }
    msg.author.send({ embed: embedMsg });
    return;
  }


  if (foundedTeam.length == 0) {
    embedMsg = {
      title: 'Erreur',
      description: 'Ce code d\'équipe n\'existe pas...',
    }
    msg.author.send({ embed: embedMsg });
    return;
  }

  foundedTeam = Team.fromJSON(foundedTeam[0]);

  if (foundedTeam.players.length == 2) {
    embedMsg = {
      title: 'Erreur',
      description: 'Cette équipe est déjà pleine',
    }
    msg.author.send({ embed: embedMsg });
    return;
  }
  foundedTeam.players[msg.author.id] = new Player(msg.author.id, msg.author.username);

  db.ref('/enigmas/teams/').child(teamCode).update(foundedTeam, function (error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log(utils.logPrefix() + "Data saved successfully.");
    }
  });

  embedMsg = {
    title: 'Félications',
    description: 'Vous venez de rejoindre l\'équipe des ' + foundedTeam.name + '\nBonne chance pour les épreuves!',
  }
  msg.author.send({ embed: embedMsg });
}


exports.infosTeam = (params) => {
  const db = params.db;
  const msg = params.message;

  let embedMsg;

  let team = global.teams.filter(team => msg.author.id in team.players);
  if (team.length == 0) {
    embedMsg = {
      title: 'Attention',
      description: 'Vous n\'appartenez pas encore à une équipe !',
      fields: [
        {
          name: 'Vous vous sentez seul...',
          value: 'Vous pouvez créer une équipe ou même en rejoindre une!'
        }
      ]
    }
  } else {
    team = Team.fromJSON(team[0]);
    playersInTeam = "";

    for (let player in team.players) {
      playersInTeam += team.players[player].username + "\n";
    }


    embedMsg = {
      title: 'Informations',
      description: 'Voici les informations de votre équipe:',
      fields: [
        {
          name: 'Nom de votre équipe',
          value: team.name
        },
        {
          name: 'Code de votre équipe',
          value: team.teamID
        },
        {
          name: 'Score',
          value: team.score
        },
        {
          name: 'Membres',
          value: playersInTeam
        },
      ]
    }

  }
  msg.author.send({ embed: embedMsg });
}

exports.leaderboard = (params) => {
  const icons = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

  let embedMsg = {
    title: 'Leaderboard',
    description: '',
    color: "#6200EE"
  };

  for (let i = 0; i < Math.min(10,global.teams.length); i++) {
    const team = global.teams[i];
    embedMsg.description += icons[i] + "- " + team.name + " [" + team.score + "]" + "\n";
  };

  params.message.channel.send({embed: embedMsg});
}