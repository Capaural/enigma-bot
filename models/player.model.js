module.exports = class Player {

	static fromJSON(obj) {
		return new Player(obj.id, obj.username, obj.score);
	}

	constructor(id, username) {
		this.id = id;
		this.username = username;
		this.score = 0;
	}

	toJSON() {
		return {
			'id': this.id,
			'username': this.username,
			'score': this.score
		}
	}
}