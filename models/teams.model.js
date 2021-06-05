module.exports = class Team {

  static fromJSON(obj) {
    return new Team(obj.name, obj.score, obj.teamID, obj.players);
  }

  constructor(name, score, teamID, players) {
    this.name = name;
    this.score = score;
    this.teamID = teamID;
    this.players = players;
  }

  toJSON() {
    return {
      'name': this.name,
      'score': this.score,
      'teamID': this.teamID,
      'players': this.players
    }
  }
}