const { Client, ActivityType } = require('discord.js')
const config = require("../config")
/**
 * 
 * @param {Client} client 
 */
function SetActivity(client) {
    let acttype;
    const type = config.BotStatus.Type
    switch(type.toLocaleLowerCase()){
        case "playing" : {
            acttype == ActivityType.Playing
        }break;
        case "listening" : {
            acttype == ActivityType.Listening
        }break;
        case "watching" : {
            acttype == ActivityType.Watching
        }break;
        case "competing" : {
            acttype == ActivityType.Competing
        }break;
        default : {
            acttype == ActivityType.Playing
        }
    }
    client.user.setPresence({
        status: config.BotStatus.Status || "online",
        activities: [{
            name: config.BotStatus.Name || "With your security",
            type: acttype,
        }]
    })
}
module.exports = { SetActivity }