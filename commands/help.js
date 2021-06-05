exports.helpMessage = (params) => {
  const res = "Bienvenue dans l'aide du Bot Enigma";
  params.message.channel.send(res);
}

exports.DMHelpMessage = (params) => {
  const msg = params.message;

  const embedMsg = {
    title: 'Aide',
    description: 'Voici les commandes que vous pouvez utiliser pour interagir avec notre bot !',
    fields: [
      {
        name: 'Avertissement',
        value: 'Attention, vous ne pouvez créer qu\'une seule équipe, vous ne pourrez pas la quitter pour rejoindre une autre équipe.\nUne fois dans une équipe, vous ne pourrez pas la quitter.'
      },
      {
        name: 'help',
        value: 'Affiche ce message.'
      },
      {
        name: 'create [name]',
        value: 'Crée une équipe avec pour nom [name].'
      },
      {
        name: 'join [teamCode]',
        value: 'Permet de rejoindre une équipe.'
      },
      {
        name: 'infos',
        value: 'Si vous êtes dans une équipe, il affiche les informations de cette équipe.'
      },
    ]
  }
  msg.author.send({ embed: embedMsg });
}