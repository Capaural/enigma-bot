exports.general = {
	title: 'Aide',
	description: 'Voici les commandes que vous pouvez utiliser pour interagir avec notre bot !',
	color: "FFCE30",
	fields: [
		{
			name: '-enigma contact',
			value: 'Pour contacter rapidement le bot (Il vous envoie un message).',
		},
		{
			name: '-enigma leaderboard',
			value: 'Affiche le classement des premières équipes.'
		},
		{
			name: '-enigma infos',
			value: 'Si vous êtes dans une équipe, il affiche les informations de cette équipe.'
		},
		{
			name: '-enigma help',
			value: 'Affiche ce message.'
		}
	]
}

exports.dm = {
	title: 'Aide',
	description: 'Voici les commandes que vous pouvez utiliser pour interagir avec notre bot !',
	color: "FFCE30",
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