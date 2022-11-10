const { GuildBan, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "guildBanAdd",
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
        
        const dblimit = config.limits.BanAdd
        if(!dblimit)return;
        const fetchLog = await GuildBan.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd
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
        const dbplayer = await joueur.get(`AntiRaid_BanAdd_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_BanAdd_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_BanAdd_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_BanAdd_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.BanAdd
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.banAdd.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.banAdd.BanCatch2).catch()
                        })
                        executor.send(lang.banAdd.Ban1 + GuildBan.guild.name + lang.banAdd.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_BanAdd_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.banAdd.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.banAdd.KickCatch2).catch()
                        })
                        executor.send(lang.banAdd.Kick1 + GuildBan.guild.name + lang.banAdd.Kick2)
                        return await joueur.delete(`AntiRaid_BanAdd_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.banAdd.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.banAdd.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.banAdd.removeRole1 + GuildBan.guild.name + lang.banAdd.removeRole2)
                        return await joueur.delete(`AntiRaid_BanAdd_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_BanAdd_${executor.id}`))return;
            joueurverif.add(`AntiRaid_BanAdd_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}