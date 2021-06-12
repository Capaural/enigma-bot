exports.alreadyInTeam = {
    title: 'Attention',
    description: 'Vous appartenez déjà à une équipe !',
    fields: [
      {
        name: 'Code d\'équipe: ',
        value: 'Ce code est personnel partagez le uniquement avec votre coéquipier'
      }
    ]
}

exports.full = {
  title: 'Erreur',
  description: 'Cette équipe est déjà pleine',
}

exports.doesNotExists = {
  title: 'Erreur',
  description: 'Ce code d\'équipe n\'existe pas...',
}

exports.notInTeam = {
  title: 'Attention',
  description: 'Vous n\'appartenez pas encore à une équipe !',
  fields: [
    {
      name: 'Vous vous sentez seul...',
      value: 'Vous pouvez créer une équipe ou même en rejoindre une!'
    }
  ]
}

exports.infos = {
  title: 'Informations',
  description: 'Voici les informations de votre équipe:',
  fields: [
    {
      name: 'Nom de votre équipe',
      value: ''
    },
    {
      name: 'Code de votre équipe',
      value: ''
    },
    {
      name: 'Score',
      value: ''
    },
    {
      name: 'Membres',
      value: ''
    },
  ]
}

exports.leaderboard = {
  title: 'Leaderboard',
  description: '',
  color: "#6200EE"
}

exports.icons = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]

exports.join = {
  title: 'Félications',
  description: 'Vous venez de rejoindre l\'équipe des **foundedTeam.name**!\nBonne chance pour les épreuves!',
}

exports.create = {
  title: 'Félicitations',
  description: 'Votre équipe : teamName est créée !',
  fields: [
    {
      name: 'Jouer à plusieurs',
      value: 'Voici le code pour qu\'une personne puisse rejoindre votre équipe.'
    },
    {
      name: 'Code d\'équipe: teamID',
      value: 'Ce code est personnel partageait le uniquement avec votre coequipier'
    }
  ]
}