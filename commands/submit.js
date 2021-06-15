const utils = require('../utils/utils');
const Team = require('../models/teams.model');
const  Enigma = require('../models/enigma.model')

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

    if (enigma.id > team.step + 1) {
        embedMsg = params.config.submit.notUnlocked;
        msg.author.send({embed: embedMsg});
        return;
    }

    if (team.validations && enigma.id in team.validations) {
        embedMsg = params.config.submit.alreadySubmited;
        msg.author.send({embed: embedMsg});
        return;
    }

    if (mdp == enigma.final_password) {
        let updateTeam = Team.fromJSON(team);
        let updateEnigma = Enigma.fromJSON(enigma);
        updateTeam.score += updateEnigma.max_points - ((updateEnigma.validations<5?updateEnigma.validations:5) * updateEnigma.amount_to_remove);
        if (!updateTeam.validations) {
            updateTeam.validations = {[enigma.id]: true};
        } else {
            updateTeam.validations[enigma.id] = true;
        }
        updateEnigma.validations++;

        utils.saveOnDB(params.db, '/enigmas/teams/', updateTeam.teamID, updateTeam.toJSON());
        utils.saveOnDB(params.db, '/enigmas/solutions/', updateEnigma.id, updateEnigma.toJSON());


        congratzMsg(params, team, number);
        embedMsg = params.config.submit.final;
        embedMsg.description = embedMsg.description.replace("$number", number);
        msg.author.send({embed: embedMsg});
        return;
    }

    const steps = enigma.steps;
    let index;
    const res = steps.filter((s,i) => {
        if (s.password == mdp) {
            index = i;
            return s.password == mdp
        }
    });

    if (res.length != 0) {
        msg.author.send("Bravo, vous avez trouvé la partie " + index + " de l'enigme " + number + "\nIndice: " + res[0].next_clue);
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