const chalk = require('chalk');
const config = require('../config');

function loadEvents(client, lang){
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Events","Status","Folder");
    const active = config
    const folders = fs.readdirSync("./events").filter(file => !file.startsWith("Urgence"));
    for (const folder of folders) {
        const files = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        for(const file of files) {
            const event = require(`../events/${folder}/${file}`);

            if(file.startsWith("ChannelCreate.js")){
                if(active.antiraid.ChannelCreate == true){
                    if(active.restore.ChannelReDelete == true)continue;
                }else continue;
            }
            if(file.startsWith("ChannelCreateDelete.js")){
                if(active.antiraid.ChannelCreate == true){
                    if(active.restore.ChannelReDelete == false)continue;
                }else continue;
            }
            if(file.startsWith("ChannelDelete.js")){
                if(active.antiraid.ChannelDelete == true){
                    if(active.restore.ChannelReCreate == true)continue;
                }else continue;
            }
            if(file.startsWith("ChannelDeleteCreate.js")){
                if(active.antiraid.ChannelDelete == true){
                    if(active.restore.ChannelReCreate == false)continue;
                }else continue;
            }
            if(active.antiraid.EmojiCreate == false && file.startsWith('EmojiCreate.js'))continue;
            if(active.antiraid.EmojiDelete == false && file.startsWith('EmojiDelete.js'))continue;
            if(file.startsWith("BanAdd.js")){
                if(active.antiraid.BanAdd == true){
                    if(active.restore.Reban == true)continue;
                }else continue;
            }
            if(file.startsWith("BanAddRemove.js")){
                if(active.antiraid.BanAdd == true){
                    if(active.restore.Reban == false)continue;
                }else continue;
            }
            if(file.startsWith("BanRemove.js")){
                if(active.antiraid.BanRemove == true){
                    if(active.restore.Unban == true)continue;
                }else continue;
            }
            if(file.startsWith("BanRemoveAdd.js")){
                if(active.antiraid.BanRemove == true){
                    if(active.restore.Unban == false)continue;
                }else continue;
            }
            if(active.antiraid.Kick == false && file.startsWith('Kick.js'))continue;
            if(file.startsWith("RoleCreate.js")){
                if(active.antiraid.RoleCreate == true){
                    if(active.restore.RoleReDelete == true)continue;
                }else continue;
            }
            if(active.antiraid.BotAdd == false && file.startsWith('BotAdd.js'))continue;
            if(file.startsWith("RoleCreateDelete.js")){
                if(active.antiraid.RoleCreate == true){
                    if(active.restore.RoleReDelete == false)continue;
                }else continue;
            }
            if(active.antiraid.RoleDelete == false && file.startsWith('RoleDelete.js'))continue;
            if(active.antiraid.StickerCreate == false && file.startsWith('StickerCreate.js'))continue;
            if(active.antiraid.StickerDelete == false && file.startsWith('StickerDelete.js'))continue;

            if(event.rest) {
                if(event.once)
                    client.rest.once(event.name, (...args) => event.execute(...args, client, lang));
                else
                    client.rest.on(event.name, (...args) => event.execute( ...args, client, lang));
            } else {
                if (event.once)
                    client.once(event.name, (...args) => event.execute( ...args, client, lang));
                else client.on(event.name, (...args) => event.execute( ...args, client, lang));
            }
            table.addRow(file, lang.enable, folder);
            continue;
        }
    }
    return console.log(table.toString(), "\nEvents chargés")
}

module.exports = { loadEvents };