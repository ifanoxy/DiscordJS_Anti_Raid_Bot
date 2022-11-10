const { GuildChannel, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "channelDelete",
    once: false,
    /**
     * 
     * @param {GuildChannel} GuildChannel 
     * @param {Client} client 
     */
    async execute(GuildChannel, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        
        const dblimit = config.limits.ChannelDelete
        if(!dblimit)return;
        const fetchLog = await GuildChannel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelDelete
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
        const dbplayer = await joueur.get(`AntiRaid_ChnDelete_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_ChnDelete_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_ChnDelete_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_ChnDelete_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.ChannelDelete
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.channelDelete.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.channelDelete.BanCatch2).catch()
                        })
                        executor.send(lang.channelDelete.Ban1 + GuildChannel.guild.name + lang.channelDelete.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_ChnDelete_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.channelDelete.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.channelDelete.KickCatch2).catch()
                        })
                        executor.send(lang.channelDelete.Kick1 + GuildChannel.guild.name + lang.channelDelete.Kick2)
                        return await joueur.delete(`AntiRaid_ChnDelete_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.channelDelete.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.channelDelete.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.channelDelete.removeRole1 + GuildChannel.guild.name + lang.channelDelete.removeRole2)
                        return await joueur.delete(`AntiRaid_ChnDelete_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_ChnDelete_${executor.id}`))return;
            joueurverif.add(`AntiRaid_ChnDelete_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}