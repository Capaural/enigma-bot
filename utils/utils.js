const { admins_id } = require("../private/creds.json");
const { google } = require("googleapis");
const FILE_PATH = "./private/sheet.json";

const SHEET_ID = "1Bm0u3nx0T3n-LDOu-8bCBDB8wBg7SqvSXV6LSrXFYfI";
const auth = new google.auth.GoogleAuth({
	keyFile: FILE_PATH,
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

function saveInLog(msg) {
	msg.unshift(logPrefix());

	const request = {
		spreadsheetId: SHEET_ID,
		range: "E7:G7",
		valueInputOption: "USER_ENTERED",
		insertDataOption: "INSERT_ROWS",
		resource: {
			values: [msg],
		},
		auth: auth,
	};

	sheets.spreadsheets.values.append(request);
}

function logPrefix() {
	let currentdate = new Date();
	let datetime =
		currentdate.getDate() +
		"/" +
		(currentdate.getMonth() + 1) +
		"/" +
		currentdate.getFullYear() +
		" @ " +
		currentdate.getHours() +
		":" +
		currentdate.getMinutes() +
		":" +
		currentdate.getSeconds();
	return datetime.toString();
}


exports.saveInLog = (msg) => {
	saveInLog(msg);
};

exports.logPrefix = () => {
	return logPrefix();
};

exports.checkIfUserHasAdminPermissions = (user_id) => {
	return admins_id.includes(user_id);
};

exports.saveToDB = (db, path, id, data) => {
	db.ref(path)
		.child(id)
		.set(data, function (error) {
			if (error) {
				// console.log("Data could not be saved." + error);
				saveInLog(["ADMIN", "[-] Data could not be saved ".concat(error)]);
			} else {
				// console.log("Data saved successfully.");
				saveInLog(["ADMIN", "[+] Data saved successfully."]);
			}
		});
};

exports.userInTeam = (params) => {
	const msg = params.message;
	const team = global.teams.filter(team => msg.author.id in team.players);
	if (team.length == 0) {
		msg.author.send({ embed: params.config.teams.notInTeam });
		return;
	}
	return team[0];
}