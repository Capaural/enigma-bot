const help = require("./config/help");
const teams = require("./config/teams");
const submit = require("./config/submit");
const rules = require("./config/rules");

exports.config = {
  help: {
    general: help.general,
    dm: help.dm,
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
    nameIsAlreadyUsed: teams.nameIsAlreadyUsed,
  },
  submit: {
    congratz: submit.congratz,
    doesNotExist: submit.doesNotExist,
    notUnlocked: submit.notUnlocked,
    alreadySubmited: submit.alreadySubmited,
    final: submit.final,
  },
  triggeredDM: "Je t'écoute coco.",
  rulesMessage: rules.rulesMessage,
  time: {
    submit: "Vous ne pouvez submit que toutes les 10 min",
    report: "Vous ne pouvez report que toutes les heures",
  },
  infos: {
    title: "Informations",
    description:
      "Vous êtes teamNumber équipes à participer.\n enigmaNumber énigmes ont été créées pour vous et pour le moment, il y a eu validationNumber validations.",
    color: "#288BA8",
    fields: [],
  },
  hint: {
    title: "Indices",
    color: "#288BA8",
    fields: [],
  },
  create_enigma: {
    alreadyCreated: {
      title: "Attention",
      description: "Cet id est déjà utilisé pour une autre enigme...",
      color: "#288BA8",
    },
  },
  channel_ids: {
    createEnigma: "853333392443179008",
    report: "851361677601275914",
  },
};
