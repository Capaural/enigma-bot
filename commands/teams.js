const Team = require('../models/teams.model');

exports.createTeam = (params) => {
  const db = params.db;
  const msg = params.message;
  const args = msg.content.split(' ');

  if (args.length != 2) {
    msg.author.send('Call the help function here');
    return;
  }

  const teamName = args[1];


  if (teamName.length > 30) {
    msg.author.send('Call the help function here');
    return;
  }

  let teamID = Math.random().toString(36).substring(7).toUpperCase();
  
  if (global.teams) {
    while (global.teams.filter(team => team.teamID == teamID)) {
      teamID = Math.random().toString(36).substring(7).toUpperCase();
      console.log("new teamID");
    }
  }

  const newTeam = new Team(teamName, 0, teamID, [msg.author.id]);

  db.push(newTeam, function(error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log("Data saved successfully.");
    }
  });
  

  const embedMsg = {
    title: 'Félicitations',
    description: 'Votre équipe : ' + teamName + ' est créée !',
    fields: [
      {
        name: 'Jouer à plusieurs',
        value: 'Voici le code pour qu\'une personne puisse rejoindre votre équipe.'
      }
    ]
  }
  msg.author.send({ embed: embedMsg });
}