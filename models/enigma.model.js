export class Enigma {

  static fromJSON(obj) {
    return new Enigma(obj.id, obj.max_points, obj.validations, obj.amount_to_remove, obj.clues, obj.final_password, obj.steps);
  }

  constructor(id, max_points, validations, amount_to_remove, clues, final_password, steps) {
    this.id = id;                                   // Le numéro de la quete
    this.max_points = max_points;                   // Nombre de pts que vaut la quete
    this.validations = validations;                 // Nombre de teams qui ont validé
    this.amount_to_remove = amount_to_remove;       // Nombre de pts à enlever par validations
    this.clues = clues;                             // Tableau d'indices de la quete
    this.final_password = final_password;           // Mot de passe de la quete
    this.steps = steps;                             // Tableau d'étapes
  }

  toJSON() {
    return {
      "id": this.id,
      "max_points": this.max_points,
      "validations": this.validations,
      "amount_to_remove": this.amount_to_remove,
      "clues": this.clues,
      "final_password": this.final_password,
      "steps": this.steps,
    }
  }
}

class Step {
  constructor(id, clue, passwd) {
    this.id = id;
    this.clue = clue;
    this.passwd = passwd;
  }
}

class Clue {
  constructor(id, value) {
    this.id = id;
    this.unlocked = false;
    this.value = value;
  }
}