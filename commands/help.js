exports.helpMessage = (params) => {
  const res = "Bienvenue dans l'aide du Bot Enigma";
  params.message.channel.send(res);
}