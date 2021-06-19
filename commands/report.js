const axios = require('axios');
const { gitlab_token } = require('../private/creds.json');


exports.report = (params) => {
	const client = params.client;
	const reportChannelID = "851361677601275914";
	const msg = params.message;
	const timeBetweenReport = 3600;
	let args = msg.content.split(' ');

	if (msg.author.id in global.users) {
		const timeBetween = (new Date() - global.users[msg.author.id]["report"]) / 1000;
		if (timeBetween <= timeBetweenReport) {
			msg.author.send(params.config.time.report);
			return;
		}
	} else {
		global.users[msg.author.id] = {
			"submit": new Date(),
			"report": new Date()
		};
	}

	args.shift();
	const data = args.join(' ').split(':');
	const title = "[Report] " + data[0];
	data.shift();
	const description = (data.length > 0 ? data.join(':') : "Pas de description") + "\nReport  by " + msg.author.username;

	axios
		.post('https://gitlab.etude.eisti.fr/api/v4/projects/6040/issues', {
			title: title,
			labels: 'report',
			description: description,
			milestone_id: 172
		}, {
			headers: { 'PRIVATE-TOKEN': gitlab_token }
		})
		.then((res) => {
			console.log(`statusCode: ${res.statusCode}`)
		})
		.catch((error) => {
			console.error(error)
		})

	const embedMsg = {
		title: title,
		description: description,
		color: "#E74C3C"
	}

	client.channels.cache.get(reportChannelID).send({ embed: embedMsg });

	msg.author.send("vous avez bien report");
}