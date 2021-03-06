const utils = require('../utils/utils');
const Team = require('../models/teams.model');
const Enigma = require('../models/enigma.model')

exports.submitAnswer = (params) => {
	const msg = params.message;
	const args = msg.content.split(' ');
	const timeBetweenSubmit = 600;
	let embedMsg;

	let team;
	if (!(team = utils.userInTeam(params))) { return; }

	if (args.length != 3) {
		msg.author.send({ embed: params.config.help.dm });
		return;
	}
	const mdp = args[2];
	const number = args[1];

	if (msg.author.id in global.users) {
		const timeBetween = (new Date() - global.users[msg.author.id]["submit"]) / 1000;
		if (timeBetween <= timeBetweenSubmit) {
			msg.author.send(params.config.time.submit);
			return;
		}
	} else {
		// TODO: verfier si ca empeche pas un utilisateur de submit et de pouvoir report sans attendre... Parce que la je crois que si
		// global.users[msg.author.id] = {
		// 	"submit": new Date(),
		// 	"report": new Date()
		// };
	}

	let enigma = global.enigmas.filter(e => e.id == number);

	if (enigma.length == 0) {
		embedMsg = params.config.submit.doesNotExist;
		msg.author.send({ embed: embedMsg });
		return;
	}
	enigma = enigma[0];

	if (parseFloat(enigma.id.toString().replace(",", ".")) > team.step + 1) {
		embedMsg = params.config.submit.notUnlocked;
		msg.author.send({ embed: embedMsg });
		return;
	}

	if (team.validations && team.validations.includes(enigma.id)) {
		embedMsg = params.config.submit.alreadySubmited;
		msg.author.send({ embed: embedMsg });
		return;
	}

	if (mdp == enigma.final_password) {
		let updateTeam = Team.fromJSON(team);
		let updateEnigma = Enigma.fromJSON(enigma);
		const deltaScore = updateEnigma.max_points - ((updateEnigma.validations < 5 ? updateEnigma.validations : 5) * updateEnigma.amount_to_remove);
		updateTeam.score += deltaScore;
		updateTeam.players[msg.author.id].score += deltaScore;
		(updateTeam.step + 1) == enigma.id ? updateTeam.step++ : null;
		if (!updateTeam.validations) {
			updateTeam.validations = [enigma.id];
		} else {
			updateTeam.validations.push(enigma.id);
		}
		updateEnigma.validations++;

		utils.saveToDB(params.db, '/enigmas/teams/', updateTeam.teamID, updateTeam.toJSON());
		utils.saveToDB(params.db, '/enigmas/solutions/', updateEnigma.id, updateEnigma.toJSON());


		// congratzMsg(params, updateTeam, number);
		embedMsg = JSON.parse(JSON.stringify(params.config.submit.final));
		embedMsg.description = embedMsg.description.replace("$number", number).replace("$pts", deltaScore);
		msg.author.send({ embed: embedMsg });
		return;
	}

	const steps = enigma.steps;
	let index;
	const res = steps.filter((s, i) => {
		if (s.password == mdp) {
			index = i;
			return s.password == mdp
		}
	});

	if (res.length != 0) {
		msg.author.send("Bravo, vous avez trouv?? la partie " + index + " de l'enigme " + number + "\nIndice: " + res[0].next_clue);
	} else {
		msg.author.send("Non, ce n'est pas le bon mot de passe v??rfie ta r??ponse et relit les indices...");
	}

}

function congratzMsg(params, team, enigmaNumber) {
	const generalChanelID = "851361677601275914";
	let embedMsg = params.config.submit.congratz;
	embedMsg.description = embedMsg.description.replace("team.name", team.name).replace("enigmaNumber", enigmaNumber).replace("team.score", team.score);
	params.client.channels.cache.get(generalChanelID).send({ embed: embedMsg });
}