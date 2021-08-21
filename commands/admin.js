const utils = require("../utils/utils");
const template = require("../utils/template.json");

exports.sendTemplate = (params) => {
	const author = params.message.author;
	const channel = params.message.channel;
	const uid = author.id;

	// Prevent access to non admin users
	if (!utils.checkIfUserHasAdminPermissions(uid)) {
		channel.send(params.config.help.dm);
		return;
	}

	// Send the contents of /utils/template.json using discord's built in code formatter
	const message = "```json\n" + JSON.stringify(template, null, 2) + "```";
	utils.saveInLog([params.client.user.username, "[+] send template"]);
	channel.send(message);
};

exports.createEnigma = (params) => {
	const msg = params.message;
	const author = msg.author;
	const channel = msg.channel;
	const channelID = channel.id;
	const uid = author.id;

	// Prevent access to non admin users
	if (!utils.checkIfUserHasAdminPermissions(uid)) {
		channel.send(params.config.help.dm);
		utils.saveInLog([params.client.user.username, "[-] User try to use admin command"]);
		return;
	}

	// Prevent command being used in the wrong channel
	if (!(channelID === params.config.channel_ids.createEnigma)) {
		channel.send(params.config.help.general);
		utils.saveInLog([params.client.user.username, "[-] Dans le mauvais channel la..."]);
		return;
	}

	// Remove discord's code formatting and language :
	let command_params = params.command_params.replace(/```/g, "").split(" ");
	command_params.shift();
	command_params = command_params.map((el) => el.replace("\n", ""));
	command_params = command_params.join(" ");


	let contents = JSON.parse(command_params);

	contents.id = String(contents.id).replace(".", ",");
	if (global.enigmas.filter((e) => e.id == contents.id).length != 0) {
		params.message.channel.send({
			embed: params.config.create_enigma.alreadyCreated,
		});
		return;
	}

	utils.saveInLog([params.client.user.username, "[+] Nouvelle énigme ajoutée dans la base de donnée"]);
	utils.saveToDB(params.db, "/enigmas/solutions/", contents.id, contents);
};
