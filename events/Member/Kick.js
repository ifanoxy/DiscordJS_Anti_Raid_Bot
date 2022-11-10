const { GuildMember, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')
;
module.exports = {
    name: "guildMemberRemove",
    once: false,
    /**
     * 
     * @param {GuildMember} GuildMember 
     * @param {Client} client 
     * @returns 
     */
    async execute(GuildMember, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        
        const dblimit = config.limits.Kick
        if(!dblimit)return;
        const fetchLog = await GuildMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick
        })
        const { executor, createdTimestamp } = fetchLog.entries.first();
        function between(x, max){
            return x <= max;
        }
        if(!between(Date.now(), createdTimestamp+6000))return
        if(executor.id == client.user.id)return;
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
        const joueur = db.table('Joueur')
        const dbplayer = await joueur.get(`AntiRaid_Kick_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_Kick_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_Kick_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_Kick_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.Kick
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.kick.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.kick.BanCatch2).catch()
                        })
                        executor.send(lang.kick.Ban1 + GuildMember.guild.name + lang.kick.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_Kick_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.kick.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.kick.KickCatch2).catch()
                        })
                        executor.send(lang.kick.Kick1 + GuildMember.guild.name + lang.kick.Kick2)
                        return await joueur.delete(`AntiRaid_Kick_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.kick.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.kick.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.kick.removeRole1 + GuildMember.guild.name + lang.kick.removeRole2)
                        return await joueur.delete(`AntiRaid_Kick_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_Kick_${executor.id}`))return;
            joueurverif.add(`AntiRaid_Kick_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}