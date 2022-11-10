const { GuildChannel, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

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
        
        const dblimit = config.limits.ChannelCreate
        if(!dblimit)return;
        const fetchLog = await GuildChannel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate
        })
        const { executor } = fetchLog.entries.first();
        if(executor.id == client.user.id)return;
        const member = await GuildChannel.guild.members.fetch(executor.id).catch(()=> {return})
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
        const joueur = db.table('Joueur')
        const dbplayer = await joueur.get(`AntiRaid_ChnCreate_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_ChnCreate_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_ChnCreate_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_ChnCreate_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.ChannelCreate
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.channelCreate.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.channelCreate.BanCatch2).catch()
                        })
                        executor.send(lang.channelCreate.Ban1 + GuildChannel.guild.name + lang.channelCreate.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_ChnCreate_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.channelCreate.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.channelCreate.KickCatch2).catch()
                        })
                        executor.send(lang.channelCreate.Kick1 + GuildChannel.guild.name + lang.channelCreate.Kick2)
                        return await joueur.delete(`AntiRaid_ChnCreate_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.channelCreate.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.channelCreate.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.channelCreate.removeRole1 + GuildChannel.guild.name + lang.channelCreate.removeRole2)
                        return await joueur.delete(`AntiRaid_ChnCreate_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_ChnCreate_${executor.id}`))return;
            joueurverif.add(`AntiRaid_ChnCreate_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}