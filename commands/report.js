const axios = require('axios');
const { gitlab_token } = require('../private/creds.json');


exports.report = (params) => {
    const msg = params.message;
    const timeBetweenReport = 3600;
    const args = msg.content.split(' ');

    if (msg.author.id in global.users) {
        const timeBetween = (new Date() - global.users[msg.author.id]["report"]) / 1000;
        if (timeBetween <= timeBetweenReport) {
            msg.author.send("Vous ne pouvez report que toutes les heures");
            return;
        }
    } else {
        global.users[msg.author.id] = {
            "submit": new Date(),
            "report": new Date()
        };
    }

    const teamName = args[1];
    console.log(teamName);

    // axios
    //     .post('https://gitlab.etude.eisti.fr/api/v4/projects/6040/issues', {
    //         title: 'fromNodejs',
    //         labels: 'testbug,%20db,%20featur',
    //         milestone_id: 172
    //     }, {
    //         headers: {'PRIVATE-TOKEN': gitlab_token}
    //       })
    //     .then((res) => {
    //         console.log(`statusCode: ${res.statusCode}`)
    //     })
    //     .catch((error) => {
    //         console.error(error)
    //     })


    msg.author.send("vous avez bien report");
}