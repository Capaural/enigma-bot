const Team = require("../models/teams.model");
const Player = require("../models/player.model");
const utils = require("../utils/utils");

exports.createTeam = (params) => {
	const db = params.db;
	const msg = params.message;
	const args = msg.content.split(" ");

	if (args.length != 2) {
		msg.author.send({ embed: params.config.help.dm });
		return;
	}

	const teamName = args[1];

	if (teamName.length > 31) {
		msg.author.send({ embed: params.config.help.dm });
		return;
	}

	const alreadyInTeam = global.teams.filter(
		(team) => msg.author.id in team.players
	);
	if (alreadyInTeam.length != 0) {
		const embedMsg = params.config.teams.alreadyInTeam;
		embedMsg.fields.name += alreadyInTeam[0].teamID;
		msg.author.send({ embed: embedMsg });
		return;
	}

	if (global.teams.filter((team) => team.name == teamName).length != 0) {
		msg.author.send({ embed: params.config.teams.nameIsAlreadyUsed });
		return;
	}

	let teamID = Math.random().toString(36).substring(7).toUpperCase();

	while (global.teams.filter((team) => team.teamID == teamID).length != 0) {
		teamID = Math.random().toString(36).substring(7).toUpperCase();
	}

	const newTeam = new Team(
		teamName,
		0,
		-1,
		teamID,
		{ [msg.author.id]: new Player(msg.author.id, msg.author.username) },
		[]
	);

	db.ref("/enigmas/teams/")
		.child(teamID)
		.set(newTeam.toJSON(), function (error) {
			if (error) {
				utils.saveInLog([
					teamID,
					"[-] CreateTeam - Data could not be saved. ".concat(error),
				]);
				console.log("Data could not be saved." + error);
			} else {
				console.log(utils.logPrefix() + "Data saved successfully.");
			}
		});

	let embedMsg = params.config.teams.create;
	embedMsg.description = embedMsg.description.replace("teamName", teamName);
	embedMsg.fields[1].name = embedMsg.fields[1].name.replace("teamID", teamID);

	msg.author.send({ embed: embedMsg });
};

exports.joinTeam = (params) => {
	const db = params.db;
	const msg = params.message;
	const args = msg.content.split(" ");

	if (args.length != 2) {
		msg.author.send({ embed: params.config.help.dm });
		return;
	}

	const teamCode = args[1];

	let foundedTeam = global.teams.filter((team) => team.teamID == teamCode);
	let embedMsg;

	const alreadyInTeam = global.teams.filter(
		(team) => msg.author.id in team.players
	);
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
	foundedTeam.players[msg.author.id] = new Player(
		msg.author.id,
		msg.author.username
	);

	db.ref("/enigmas/teams/")
		.child(teamCode)
		.update(foundedTeam, function (error) {
			if (error) {
				utils.saveInLog([
					teamID,
					"[-] JoinTeam - Data could not be saved. ".concat(error),
				]);
				console.log("Data could not be saved." + error);
			} else {
				console.log(utils.logPrefix() + "Data saved successfully.");
			}
		});

	embedMsg = params.config.teams.join;
	embedMsg.description = embedMsg.description.replace(
		"foundedTeam.name",
		foundedTeam.name
	);
	msg.author.send({ embed: embedMsg });
};

function sortEnigmasByID(a, b) {
	if (a < b) { return -1; }
	if (a > b) { return 1; }
	return 0;
}

function enigmeAvecOuSansS(arr) {
	return "Enigme" + (arr.length > 1 ? "s" : "") + " ";
}

function getEnigmasInfos(team) {
	res = ["done", "unlocked", "locked"];

	if (!team.validations) {
		locked = global.enigmas.filter(e => e.id != "0").map(e => e.id).sort((a, b) => sortEnigmasByID(a, b));

		res[0] = "Aucunes";
		res[1] = "Enigme 0";
		res[2] = locked.length == 0 ? "Aucunes" : enigmeAvecOuSansS(locked) + locked.join(" - ");
	} else {
		console.log("Des enigmes ont été debloquées");
		allEnigmasID = global.enigmas.map(e => e.id).filter(id => !team.validations.includes(id)).map(id => parseFloat(id.toString().replace(",", ".")));
		unlocked = allEnigmasID.filter(id => id <= team.step + 1);
		locked = allEnigmasID.filter(id => !unlocked.includes(id));

		res[0] = enigmeAvecOuSansS(team.validations) + team.validations.sort((a, b) => sortEnigmasByID(a, b)).join(" - ");
		res[1] = unlocked.length == 0 ? "Aucunes bravo!\nDes énigmes seront bientôt disponibles" : enigmeAvecOuSansS(unlocked) + unlocked.map(id => id.toString().replace(".", ",")).sort((a, b) => sortEnigmasByID(a, b)).join(" - ");
		res[2] = locked.length == 0 ? "Aucunes" : enigmeAvecOuSansS(locked) + locked.map(id => id.toString().replace(".", ",")).sort((a, b) => sortEnigmasByID(a, b)).join(" - ");
	}

	return res;
}


exports.infosTeam = (params) => {
	const db = params.db;
	const msg = params.message;

	let embedMsg;

	let team = global.teams.filter((team) => msg.author.id in team.players);
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

		const enigmasInfos = getEnigmasInfos(team);
		embedMsg.fields[4].value = enigmasInfos[0];
		embedMsg.fields[5].value = enigmasInfos[1];
		embedMsg.fields[6].value = enigmasInfos[2];
	}
	msg.author.send({ embed: embedMsg });
};

exports.leaderboard = (params) => {
	const icons = params.config.teams.icons;

	let embedMsg = JSON.parse(JSON.stringify(params.config.teams.leaderboard));

	for (let i = 0; i < Math.min(10, global.teams.length); i++) {
		const team = global.teams[i];
		embedMsg.description +=
			icons[i] + "- " + team.name + " [" + team.score + "]" + "\n";
	}

	params.message.channel.send({ embed: embedMsg });
};

exports.globalInfos = (params) => {
	let embedMsg = JSON.parse(JSON.stringify(params.config.infos));
	const teamNumber = global.teams.length;
	const enigmaNumber = global.enigmas.length;

	embedMsg.description = embedMsg.description
		.replace("teamNumber", teamNumber)
		.replace("enigmaNumber", enigmaNumber);

	let validationNumber = 0;
	global.enigmas.sort((a, b) => sortEnigmasByID(a.id, b.id)).forEach((e) => {
		embedMsg.fields.push({
			name: "Enigme " + e.id,
			value: e.validations + " validations",
		});
		validationNumber += parseInt(e.validations);
	});

	embedMsg.description = embedMsg.description.replace(
		"validationNumber",
		validationNumber
	);
	params.message.channel.send({ embed: embedMsg });
};
