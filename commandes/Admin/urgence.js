const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder} = require('discord.js');
const config = require('../../config');
const fs = require('fs');
const { loadEvents } = require('../../handler/eventHandler');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName('urgence')
    .setNameLocalizations({fr: "urgence", "en-GB": "emergency", "en-US": "emergency"})
    .setDescription('Cette commande vous permet de bloquer toute interaction avec le serveur')
    .setDescriptionLocalizations({
        fr: "Cette commande vous permet de bloquer toute interaction avec le serveur",
        "en-GB":"This command allows you to block any interaction with the server",
        "en-US":"This command allows you to block any interaction with the server",
    })
    .setDMPermission(false)
    .addBooleanOption(option => 
        option.setName('status').setDescription('Activer ou désactiver le mode d\'urgence.').setDescriptionLocalizations({fr: "Activer ou désactiver le mode d'urgence.", "en-GB":"Activate or deactivate emergency mode.", "en-US": "Activate or deactivate emergency mode."}).setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        const member = interaction.member
        let whitelist;
        if(interaction.guild.ownerId == member.id){whitelist = true}
        else{
            if(wlrole){
                for(const r of wlrole){
                    if(member.roles.cache.has(r))return whitelist = true;
                }
            }
            if(wluser){
                for(const i of wluser){
                    if(interaction.user.id == i)return whitelist = true;
                }
            }
        }
        if(whitelist !== true)return interaction.reply({ephemeral: true,embeds: [new EmbedBuilder().setColor('Red').setTitle(lang.command.notwhitelist.title).setDescription(lang.command.notwhitelist.description)]});
        switch (interaction.options.getBoolean('status')) {
            case true: {
                const files = fs
                .readdirSync(`./events/Urgence`)
                .filter((file) => file.endsWith(".js"));
                for(const file of files) {
                    switch (file) {
                        case "ChannelCreate.js" : {
                            if(config.Urgence.ChannelCreate == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "ChannelDelete.js" : {
                            if(config.Urgence.ChannelDelete == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "RoleDelete.js" : {
                            if(config.Urgence.RoleDelete == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "RoleCreate.js" : {
                            if(config.Urgence.RoleCreate == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "EmojiDelete.js" : {
                            if(config.Urgence.EmojiDelete == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "EmojiCreate.js" : {
                            if(config.Urgence.EmojiCreate == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "GuildBanAdd.js" : {
                            if(config.Urgence.BanAdd == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "GuildBanRemove.js" : {
                            if(config.Urgence.BanRemove == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "Kick.js" : {
                            if(config.Urgence.Kick == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "StickerCreate.js" : {
                            if(config.Urgence.StickerCreate == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                        case "StickerDelete.js" : {
                            if(config.Urgence.StickerDelete == false)return;
                            const event = require(`../../events/Urgence/${file}`);
                            client.on(event.name, (...args) => event.execute( ...args, client, lang));
                        }break;
                    }
                }
                
                interaction.reply({ephemeral: true,embeds: [new EmbedBuilder().setColor('Green').setTitle(lang.command.actif.title).setDescription(lang.command.actif.description)]});
            }break;
            case false: {
                client.removeAllListeners();
                loadEvents(client, lang);
                interaction.reply({ephemeral: true,embeds: [new EmbedBuilder().setColor('Orange').setTitle(lang.command.inactif.title).setDescription(lang.command.inactif.description)]});
            }break;
        }
    }
}