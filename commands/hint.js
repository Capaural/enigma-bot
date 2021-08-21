const utils = require('../utils/utils');

exports.hintEnigma = (params) => {
	const msg = params.message;
	const args = msg.content.split(' ');
	const timeBetweenSubmit = 600;
	let embedMsg;

	let team;
	if (!(team = utils.userInTeam(params))) { return; }

	if (args.length != 2) {
		msg.author.send({ embed: params.config.help.dm });
		return;
	}
	const number = args[1];

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

	embedMsg = JSON.parse(JSON.stringify(params.config.hint));
	embedMsg.fields.push({
		name: "Consignes",
		value: enigma.clues[0].value,
	});
	let i = 1;
	enigma.clues.slice(1).forEach(clue => {
		if (clue.unlocked) {
			embedMsg.fields.push({
				name: "Indice " + i++,
				value: clue.value,
			});
		}
	});

	msg.author.send({ embed: embedMsg });
};
