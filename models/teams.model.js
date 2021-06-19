module.exports = class Team {

	static fromJSON(obj) {
		return new Team(obj.name, obj.score, obj.step, obj.teamID, obj.players, obj.validations);
	}

	constructor(name, score, step, teamID, players, validations) {
		this.name = name;
		this.score = score;
		this.teamID = teamID;
		this.players = players;
		this.validations = validations;
		this.step = step;
	}

	toJSON() {
		return {
			'name': this.name,
			'score': this.score,
			'step': this.step,
			'teamID': this.teamID,
			'players': this.players,
			'validations': this.validations ? this.validations : ""
		}
	}
}