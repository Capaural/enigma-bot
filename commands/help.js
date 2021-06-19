exports.helpMessage = (params) => {
	params.message.channel.send({ embed: params.config.help.general });
}

exports.DMHelpMessage = (params) => {
	params.message.author.send({ embed: params.config.help.dm });
}