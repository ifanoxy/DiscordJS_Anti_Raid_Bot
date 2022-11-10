const { CommandInteraction, EmbedBuilder} = require('discord.js');
const { Client } = require("discord.js")

module.exports = {
    name:'interactionCreate',
    once: false,
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client, lang) {
        try{
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if(!command) {
            return interaction.reply({embeds:[new EmbedBuilder().setColor("#36393F").setDescription('Cette commande est inexistante !')], ephemeral: true})
        }

        command.execute(interaction, client, lang);

        } catch {
            console.log(`Une erreur c'est produite ressayez plus tard`)
        }      
    }
}