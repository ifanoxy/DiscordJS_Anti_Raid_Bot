const chalk = require('chalk');

function loadCommands(client, lang) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Commandes","Status");

    let commandsArray = [];
    let developerArray = [];

    const commandsFolders = fs.readdirSync("./commandes");
    for (const folder of commandsFolders) {
        const commandFiles = fs
        .readdirSync(`./commandes/${folder}`)
        .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const commandFile = require(`../commandes/${folder}/${file}`);

            client.commands.set(commandFile.data.name, commandFile);

            if(commandFile.developer) developerArray.push(commandFile.data.toJSON())
            else commandsArray.push(commandFile.data.toJSON());

            table.addRow(file, "✔️");
            continue;
        }
    }

    client.application.commands.set(commandsArray)

    const developerGuild = client.guilds.cache.get(client.config.DeveloperGuildID)
    if(!developerGuild)return console.log(chalk.red(lang.checkConfig.DeveloperGuild)), process.exit()
    developerGuild.commands.set(developerArray);
    

    return console.log(table.toString(), "\nCommandes chargées")
}

module.exports = { loadCommands }