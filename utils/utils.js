const { admins_id } = require('../private/creds.json');

exports.logPrefix = () => {
  let currentdate = new Date();
  let datetime = '[' + currentdate.getDate() + '/'
    + (currentdate.getMonth() + 1) + '/'
    + currentdate.getFullYear() + ' @ '
    + currentdate.getHours() + ':'
    + currentdate.getMinutes() + ':'
    + currentdate.getSeconds() + '] ';
  return (datetime.toString());
}

exports.checkIfUserHasAdminPermissions = (user_id) => {
  return admins_id.includes(user_id);
}

exports.saveOnDB = (db, path, id, data) => {
  db.ref(path).child(id).set(data, function (error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log(utils.logPrefix() + "Data saved successfully.");
    }
  });
}