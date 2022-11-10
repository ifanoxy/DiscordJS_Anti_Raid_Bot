const { AuditLogEvent, GuildMember } = require("discord.js");
const config = require('../../config')

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /**
     * 
     * @param {GuildMember} GuildMember 
     * @returns 
     */
    async execute(GuildMember, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        if(GuildMember.user.bot == false)return;
        const fetchLog = await GuildMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd
        })
        const { executor, target } = fetchLog.entries.first();
        const member = await GuildMember.guild.members.fetch(executor.id).catch(()=> {return})
        const owner = await GuildMember.guild.fetchOwner()
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
        GuildMember.guild.members.kick(target, "Anti-Raid").catch()
        const sanc = config.sanction.BotAdd
        switch(sanc.toLocaleLowerCase()){
            case "ban": {
                member.ban()
                .catch(async () => {
                    owner.send(lang.botAdd.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.botAdd.BanCatch2).catch()
                })
                executor.send(lang.botAdd.Ban1 + GuildMember.guild.name + lang.botAdd.Ban2)
                .catch()
            }break;
            case "kick": {
                member.kick()
                .catch(async () => {
                    owner.send(lang.botAdd.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.botAdd.KickCatch2).catch()
                })
                executor.send(lang.botAdd.Kick1 + GuildMember.guild.name + lang.botAdd.Kick2)
            }break;
            case "removerole": {
                const allrole = member.roles.cache
                allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.botAdd.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.botAdd.removeRoleCatch2 + `${role}` ).catch()})}})
                executor.send(lang.botAdd.removeRole1 + GuildMember.guild.name + lang.botAdd.removeRole2)
            }break;
        }
    }
}