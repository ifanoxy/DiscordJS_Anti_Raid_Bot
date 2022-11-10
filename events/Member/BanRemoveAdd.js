const { GuildBan, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "guildBanRemove",
    once: false,
    /**
     * 
     * @param {GuildBan} GuildBan 
     * @param {Client} client 
     * @returns 
     */
    async execute(GuildBan, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        
        const dblimit = config.limits.BanRemove
        if(!dblimit)return;
        const fetchLog = await GuildBan.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove
        })
        const { executor } = fetchLog.entries.first();
        if(executor.id == client.user.id)return;
        const member = await GuildBan.guild.members.fetch(executor.id).catch(()=> {return})
        const owner = await GuildBan.guild.fetchOwner()
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
        const joueur = db.table('Joueur')
        const dbplayer = await joueur.get(`AntiRaid_BanRemove_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_BanRemove_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_BanRemove_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_BanRemove_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.BanRemove
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.banRemove.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.banRemove.BanCatch2).catch()
                        })
                        executor.send(lang.banRemove.Ban1 + GuildBan.guild.name + lang.banRemove.Ban2)
                        .catch()
                        await joueur.delete(`AntiRaid_BanRemove_${executor.id}`);
                        const fetchLog = await GuildBan.guild.fetchAuditLogs({
                            limit: config.limits.BanRemove,
                            type: AuditLogEvent.MemberBanRemove
                        })
                        fetchLog.entries.map(channel => {
                            const id = channel.target.id;
                            GuildBan.guild.bans.create(id)
                        })
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.banRemove.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.banRemove.KickCatch2).catch()
                        })
                        executor.send(lang.banRemove.Kick1 + GuildBan.guild.name + lang.banRemove.Kick2)
                        await joueur.delete(`AntiRaid_BanRemove_${executor.id}`);
                        const fetchLog = await GuildBan.guild.fetchAuditLogs({
                            limit: config.limits.BanRemove,
                            type: AuditLogEvent.MemberBanRemove
                        })
                        fetchLog.entries.map(channel => {
                            const id = channel.target.id;
                            GuildBan.guild.bans.create(id)
                        })
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.banRemove.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.banRemove.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.banRemove.removeRole1 + GuildBan.guild.name + lang.banRemove.removeRole2)
                        await joueur.delete(`AntiRaid_BanRemove_${executor.id}`);
                        const fetchLog = await GuildBan.guild.fetchAuditLogs({
                            limit: config.limits.BanRemove,
                            type: AuditLogEvent.MemberBanRemove
                        })
                        fetchLog.entries.map(channel => {
                            const id = channel.target.id;
                            GuildBan.guild.bans.create(id)
                        })
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_BanRemove_${executor.id}`))return;
            joueurverif.add(`AntiRaid_BanRemove_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}