exports.rulesMessage = (params) => {
    params.message.channel.send({ embed: params.config.rulesMessage });
}