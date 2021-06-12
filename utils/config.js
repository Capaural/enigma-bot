const help = require('./config/help');
const teams = require('./config/teams');
const submit = require('./config/submit');

exports.config = {
    help: {
        general: help.general,
        dm: help.dm
    },
    teams: {
        alreadyInTeam: teams.alreadyInTeam,
        full: teams.full,
        doesNotExists: teams.doesNotExists,
        notInTeam: teams.notInTeam,
        infos: teams.infos,
        leaderboard: teams.leaderboard,
        icons: teams.icons,
        join: teams.join,
        create: teams.create,
    },
    submit: {
        congratz: submit.congratz,
    },
    unauthorized: "Tu n'as pas la permission d'utiliser cette commande.",
    triggeredDM: 'Je t\'écoute coco.',
    time: {
        submit: "Vous ne pouvez submit que toutes les 10 min",
        report: "Vous ne pouvez report que toutes les heures"
    }
}