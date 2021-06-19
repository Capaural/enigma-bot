exports.triggerMessage = (params) => {
	params.message.author.send(params.config.triggeredDM);
}