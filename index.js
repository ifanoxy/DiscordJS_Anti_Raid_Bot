const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const { GuildMembers, Guilds, GuildBans, GuildMessages, GuildWebhooks ,GuildEmojisAndStickers, MessageContent} = GatewayIntentBits;
const { User, GuildMember, Channel} = Partials;
const chalk = require("chalk");
const { loadEvents } = require('./handler/eventHandler');
const { loadCommands } = require('./handler/commandsHandler');
const { CheckConfig } = require("./function/checkConfig");
const { SetActivity } = require("./function/ClientActivity");
const config = require("./config");
try{require(`./Local/${config.Language}`)}catch{return console.log(chalk.red("Le langage saisi est introuvable. Langue disponible : 'fr' / 'en' "))}
const lang = require(`./Local/${config.Language}`);
CheckConfig(lang);
const client = new Client({
    intents: [GuildMembers, Guilds, GuildBans, GuildMessages, GuildWebhooks, GuildEmojisAndStickers, MessageContent],
    partials: [User, GuildMember, Channel],
});

client.commands = new Collection();
client.config = config

const { QuickDB } = require('quick.db');
const db = new QuickDB({
    filePath: "Database.sqlite"
});

module.exports = {db, lang}
client
    .login(process.env.TOKEN || client.config.DiscordToken)
    .then(async() => {
        loadEvents(client, lang);
        loadCommands(client, lang);
        SetActivity(client);
    })
    .catch(err => {
        switch(err.message){
            case "An invalid token was provided." : {
                return console.log(chalk.red(lang.MissingToken))
            }break;
            case "Privileged intent provided is not enaled or whitelisted." : {
                return console.log(chalk.red(lang.InvalidIntent))
            }break;
            default : {
                return console.log(chalk.red.underline(lang.error) + "\n\n" + chalk.gray(err.stack))
            }break;
        }
    })

process.on('unhandledRejection', async error => {
    console.log(error.stack)
})

process.on('uncaughtException', async error => {
    console.log(error.stack)
})