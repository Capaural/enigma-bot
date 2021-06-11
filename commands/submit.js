exports.submitAnswer = (params) => {
    const msg = params.message;
    const timeBetweenSubmit = 600;

    let team = global.teams.filter(team => msg.author.id in team.players);
    if (team.length == 0) { 
      msg.author.send({embed: {
        title: 'Attention',
        description: 'Vous n\'appartenez pas encore à une équipe !',
        fields: [
          {
            name: 'Vous vous sentez seul...',
            value: 'Vous pouvez créer une équipe ou même en rejoindre une!'
          }
        ]
      }});
      return;
    }
    team = team[0];

    if (msg.author.id in global.users) {
        const timeBetween = (new Date() - global.users[msg.author.id]["submit"])/1000;
        if (timeBetween <= timeBetweenSubmit) {
            msg.author.send("Vous ne pouvez submit que toutes les 10 min");
            return;
        }
    } else {
        global.users[msg.author.id] = {
            "submit": new Date(),
            "report": new Date()
        };
    }

    msg.author.send("vous avez bien submit");
    congratzMsg(params,team, "1.3");
}

function congratzMsg(params, team, enigmaNumber) {
    const generalChanelID = "851361677601275914";
    params.client.channels.cache.get(generalChanelID).send({
        embed: {
            title: 'Félicitations',
            description: 'Les **' + team.name + '** viennent de résoudre l\'énigme '+ enigmaNumber + "\nIls ont " + team.score + " pts!",
            color: "#FF8849"
        }
    });
}