exports.submitAnswer = (params) => {
    const msg = params.message;
    const args = msg.content.split(' ');
    const timeBetweenSubmit = 00;
    let embedMsg;

    let team = global.teams.filter(team => msg.author.id in team.players);
    if (team.length == 0) { 
      msg.author.send({embed: params.config.teams.notInTeam});
      return;
    }
    team = team[0];

    if (args.length != 3) {
        msg.author.send({embed: params.config.help.dm});
        return;
    }
    const mdp = args[2];
    const number = args[1];

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

    let enigma = global.enigmas.filter(e => e.id == number);

    if (enigma.length == 0) {
        embedMsg = params.config.submit.doesNotExist;
        msg.author.send({embed: embedMsg});
        return;
    }
    enigma = enigma[0];

    if (enigma.id > team.step) {
        embedMsg = params.config.submit.notUnlocked;
        msg.author.send({embed: embedMsg});
        return;
    }

    if (enigma.id in team.validations) {
        embedMsg = params.config.submit.alreadySubmited;
        msg.author.send({embed: embedMsg});
        return;
    }

    if (mdp == enigma.final_password) {
        let updateTeam = Team.fromJson(team);
        let updateEnigma = Enigma.fromJson(enigma);
        // Ajouter les points de l'équipe
        updateTeam.score += updateEnigma.max_points - (updateEnigma.validations * updateEnigma.amount_to_remove);
        // Incrementer le nombre de personnes à avoir validé l'enigme
        updateEnigma.validations++;

        // Update dans la db les infos (updateXXX)

        congratzMsg(params, team, number);
        embedMsg = params.config.submit.final;
        embedMsg.description = embedMsg.description.replace("$number", number);
        msg.author.send({embed: embedMsg});
        return;
    }

    const subMDP = enigma.submdp;
    let index;
    const res = subMDP.filter((s,i) => {
        if (s.mdp == mdp)
            index = i;
        return s.mdp == mdp
    });

    if (res.length != 0) {
        msg.author.send("Bravo, vous avez trouvé la partie " + index + " de l'enigme " + number + "\nIndice: " + res[0].phrase);
    } else {
        msg.author.send("Non, ce n'est pas le bon mot de passe vérfie ta réponse et relit les indices...");
    }

}

function congratzMsg(params, team, enigmaNumber) {
    const generalChanelID = "851361677601275914";
    let embedMsg = params.config.submit.congratz;
    embedMsg.description = embedMsg.description.replace("team.name", team.name).replace("enigmaNumber",enigmaNumber).replace("team.score", team.score);
    params.client.channels.cache.get(generalChanelID).send({embed: embedMsg});
}