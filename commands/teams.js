const Team = require('../models/teams.model');
const Player = require('../models/player.model');
const utils = require('../utils/utils');

exports.createTeam = (params) => {
  const db = params.db;
  const msg = params.message;
  const args = msg.content.split(' ');

  if (args.length != 2) {
    msg.author.send({embed: params.config.help.dm});
    return;
  }

  const teamName = args[1];

  if (teamName.length > 31) {
    msg.author.send({embed: params.config.help.dm});
    return;
  }

  const alreadyInTeam = global.teams.filter(team => msg.author.id in team.players);
  if (alreadyInTeam.length != 0) {
    const embedMsg = params.config.teams.alreadyInTeam;
    embedMsg.fields.name += alreadyInTeam[0].teamID;
    msg.author.send({ embed: embedMsg });
    return;
  }

  if (global.teams.filter(team => team.name == teamName).length != 0) {
    msg.author.send({ embed: params.config.teams.nameIsAlreadyUsed });
    return;
  }

  let teamID = Math.random().toString(36).substring(7).toUpperCase();

  while (global.teams.filter(team => team.teamID == teamID).length != 0) {
    teamID = Math.random().toString(36).substring(7).toUpperCase();
  }

  const newTeam = new Team(teamName, 0, 0, teamID, { [msg.author.id]: new Player(msg.author.id, msg.author.username) }, []);

  db.ref('/enigmas/teams/').child(teamID).set(newTeam.toJSON(), function (error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log(utils.logPrefix() + "Data saved successfully.");
    }
  });


  let embedMsg = params.config.teams.create;
  embedMsg.description = embedMsg.description.replace('teamName', teamName);
  embedMsg.fields[1].name = embedMsg.fields[1].name.replace('teamID', teamID);

  msg.author.send({ embed: embedMsg });
}

exports.joinTeam = (params) => {
  const db = params.db;
  const msg = params.message;
  const args = msg.content.split(' ');

  if (args.length != 2) {
    msg.author.send({embed: params.config.help.dm});
    return;
  }

  const teamCode = args[1];

  let foundedTeam = global.teams.filter(team => team.teamID == teamCode);
  let embedMsg;

  const alreadyInTeam = global.teams.filter(team => msg.author.id in team.players);
  if (alreadyInTeam.length != 0) {
    embedMsg = params.config.teams.alreadyInTeam;
    embedMsg.fields.name += alreadyInTeam[0].teamID;
    msg.author.send({ embed: embedMsg });
    return;
  }


  if (foundedTeam.length == 0) {
    msg.author.send({ embed: params.config.teams.doesNotExists });
    return;
  }

  foundedTeam = Team.fromJSON(foundedTeam[0]);

  if (foundedTeam.players.length == 2) {
    msg.author.send({ embed: params.config.teams.full });
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

  embedMsg = params.config.teams.join;
  embedMsg.description = embedMsg.description.replace("foundedTeam.name", foundedTeam.name);
  msg.author.send({ embed: embedMsg });
}


exports.infosTeam = (params) => {
  const db = params.db;
  const msg = params.message;

  let embedMsg;

  let team = global.teams.filter(team => msg.author.id in team.players);
  if (team.length == 0) {
    embedMsg = params.config.teams.notInTeam;
  } else {
    team = Team.fromJSON(team[0]);
    playersInTeam = "";

    for (let player in team.players) {
      playersInTeam += team.players[player].username + "\n";
    }

    embedMsg = params.config.teams.infos;
    embedMsg.fields[0].value = team.name;
    embedMsg.fields[1].value = team.teamID;
    embedMsg.fields[2].value = team.score;
    embedMsg.fields[3].value = playersInTeam;
  }
  msg.author.send({ embed: embedMsg });
}

exports.leaderboard = (params) => {
  const icons = params.config.teams.icons;

  let embedMsg = params.config.teams.leaderboard;

  for (let i = 0; i < Math.min(10,global.teams.length); i++) {
    const team = global.teams[i];
    embedMsg.description += icons[i] + "- " + team.name + " [" + team.score + "]" + "\n";
  };

  params.message.channel.send({embed: embedMsg});
}

exports.globalInfos = (params) => {
  let embedMsg = params.config.infos;
  const teamNumber = global.teams.length;
  const enigmaNumber = global.enigmas.length;

  embedMsg.description = embedMsg.description.replace('teamNumber', teamNumber).replace('enigmaNumber', enigmaNumber);

  let validationNumber = 0;
  global.enigmas.forEach(e => {
    embedMsg.fields.push({
      "name": "Enigme " + e.id,
      "value": e.validations + " validations"
    });
    validationNumber += parseInt(e.validations);
  });

  embedMsg.description = embedMsg.description.replace('validationNumber', validationNumber)
  params.message.channel.send({embed: embedMsg});
}