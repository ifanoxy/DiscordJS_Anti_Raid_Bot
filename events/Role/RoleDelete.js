const { Role, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "roleDelete",
    once: false,
    /**
     * 
     * @param {Role} Role 
     * @param {Client} client 
     * @returns 
     */
    async execute(Role, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        
        const dblimit = config.limits.RoleDelete
        if(!dblimit)return;
        const fetchLog = await Role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete
        })
        const { executor } = fetchLog.entries.first();
        if(executor.id == client.user.id)return;
        const member = await Role.guild.members.fetch(executor.id).catch(()=> {return})
        const owner = await Role.guild.fetchOwner()
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
        const dbplayer = await joueur.get(`AntiRaid_RoleDelete_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_RoleDelete_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_RoleDelete_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_RoleDelete_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.RoleDelete
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.roleDelete.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.roleDelete.BanCatch2).catch()
                        })
                        executor.send(lang.roleDelete.Ban1 + Role.guild.name + lang.roleDelete.Ban2)
                        .catch()
                        await joueur.delete(`AntiRaid_RoleDelete_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.roleDelete.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.roleDelete.KickCatch2).catch()
                        })
                        executor.send(lang.roleDelete.Kick1 + Role.guild.name + lang.roleDelete.Kick2)
                        await joueur.delete(`AntiRaid_RoleDelete_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.roleDelete.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.roleDelete.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.roleDelete.removeRole1 + Role.guild.name + lang.roleDelete.removeRole2)
                        await joueur.delete(`AntiRaid_RoleDelete_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_RoleDelete_${executor.id}`))return;
            joueurverif.add(`AntiRaid_RoleDelete_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}