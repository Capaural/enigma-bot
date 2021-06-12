exports.submitAnswer = (params) => {
    const msg = params.message;
    const timeBetweenSubmit = 600;

    let team = global.teams.filter(team => msg.author.id in team.players);
    if (team.length == 0) { 
      msg.author.send({embed: params.config.teams.notInTeam});
      return;
    }
    team = team[0];

    if (msg.author.id in global.users) {
        const timeBetween = (new Date() - global.users[msg.author.id]["submit"])/1000;
        if (timeBetween <= timeBetweenSubmit) {
            msg.author.send(params.config.time.submit);
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
    let embedMsg = params.config.submit.congratz;
    embedMsg.description = embedMsg.description.replace("team.name", team.name).replace("enigmaNumber",enigmaNumber).replace("team.score", team.score);
    params.client.channels.cache.get(generalChanelID).send({embed: embedMsg});
}