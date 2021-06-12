const utils = require('../utils/utils');
const template = require('../utils/template.json');

exports.sendTemplate = (params) => {
  const author = params.message.author;
  const channel = params.message.channel;
  const uid = author.id;

  // Prevent access to non admin users
  if (!(utils.checkIfUserHasAdminPermissions(uid))) {
    channel.send(params.config.unauthorized);
    return;
  }

  // Send the contents of /utils/template.json using discord's built in code formatter
  const message = "```json\n" + JSON.stringify(template, null, 2) + "```";
  channel.send(message);
}

exports.createEnigma = (params) => {
  const msg = params.message;
  const author = msg.author;
  const channel = msg.channel;
  const channelID = channel.id;
  const uid = author.id;

  // Prevent access to non admin users
  if (!(utils.checkIfUserHasAdminPermissions(uid))) {
    channel.send(params.config.unauthorized);
    return;
  }

  // Prevent command being used in the wrong channel
  if (!(channelID === params.config.create_enigma.channelID)) {
    channel.send(params.config.create_enigma.wrong_channel_error_message);
    return;
  }

  console.log(msg.content);
}