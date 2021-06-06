exports.submitAnswer = (params) => {
    const msg = params.message;
    const timeBetweenSubmit = 600;

    if (msg.author.id in global.users) {
        const timeBetween = (new Date() - global.users[msg.author.id]["submit"])/1000;
        if (timeBetween <= timeBetweenSubmit) {
            msg.author.send("Vous ne pouvez submit que toutes les 10 min");
            return;
        }
    } else {
        global.users[msg.author.id] = {
            "submit": new Date(),
            "report": new Date()
        };
    }

    msg.author.send("vous avez bien submit");
}