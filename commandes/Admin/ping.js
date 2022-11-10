const { SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Permet de voir la latence du bot")
    .setDMPermission(true),
    /**
     * 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const pingembed = new EmbedBuilder()
        .setTitle('Commande ping')
        .setDescription(`🌍 Latence du bot **${Date.now() - interaction.createdTimestamp}ms** \n🔧  API Latence **${Math.round(client.ws.ping)}ms**`)
        .setColor('Blurple')
  
        interaction.reply({embeds:[pingembed], ephemeral: true})
    }
}