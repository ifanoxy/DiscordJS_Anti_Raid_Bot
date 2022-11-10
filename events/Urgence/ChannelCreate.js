const { GuildChannel, Client, AuditLogEvent, WebhookClient, ChannelType } = require("discord.js");
const config = require('../../config')

module.exports = {
    name: "channelCreate",
    once: false,
    /**
     * 
     * @param {GuildChannel} GuildChannel 
     * @param {Client} client 
     * @returns 
     */
    async execute(GuildChannel, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        const fetchLog = await GuildChannel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate
        })
        const { executor } = fetchLog.entries.first();
        if(executor.id == client.user.id)return;
        const member = await GuildChannel.guild.members.fetch(executor.id).catch()
        const owner = await GuildChannel.guild.fetchOwner()
        if(executor.id == owner.id)return;
        let whitelist;
        if(wlrole){
            for(const r of wlrole){
                if(member.roles.cache.has(r))return whitelist = true;
            }
        }
        if(wluser){
            for(const i of wluser){
                if(executor.id == i)return whitelist = true;
            }
        }
        if(whitelist == true)return;

        const sanc = config.sanction.Urgence
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.urgence.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.urgence.BanCatch2).catch()
                        })
                        executor.send(lang.urgence.Ban1 + GuildChannel.guild.name + lang.urgence.Ban2)
                        .catch()
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.urgence.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.urgence.KickCatch2).catch()
                        })
                        executor.send(lang.urgence.Kick1 + GuildChannel.guild.name + lang.urgence.Kick2)
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.urgence.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.urgence.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.urgence.removeRole1 + GuildChannel.guild.name + lang.urgence.removeRole2)
                    }break;
                }
                
        GuildChannel.guild.channels.delete()
    },
}