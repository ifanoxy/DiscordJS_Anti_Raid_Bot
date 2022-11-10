const { GuildEmoji, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "emojiDelete",
    once: false,
    /**
     * 
     * @param {GuildEmoji} GuildEmoji 
     * @param {Client} client 
     * @returns 
     */
    async execute(GuildEmoji, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        
        const dblimit = config.limits.EmojiDelete
        if(!dblimit)return;
        const fetchLog = await GuildEmoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiDelete
        })
        const { executor } = fetchLog.entries.first();
        if(executor.id == client.user.id)return;
        const member = await GuildEmoji.guild.members.fetch(executor.id).catch(()=> {return})
        const owner = await GuildEmoji.guild.fetchOwner()
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
        const dbplayer = await joueur.get(`AntiRaid_EmojiDelete_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_EmojiDelete_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_EmojiDelete_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_EmojiDelete_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.EmojiDelete
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.emojiDelete.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.emojiDelete.BanCatch2).catch()
                        })
                        executor.send(lang.emojiDelete.Ban1 + GuildEmoji.guild.name + lang.emojiDelete.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_EmojiDelete_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.emojiDelete.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.emojiDelete.KickCatch2).catch()
                        })
                        executor.send(lang.emojiDelete.Kick1 + GuildEmoji.guild.name + lang.emojiDelete.Kick2)
                        return await joueur.delete(`AntiRaid_EmojiDelete_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.emojiDelete.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.emojiDelete.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.emojiDelete.removeRole1 + GuildEmoji.guild.name + lang.emojiDelete.removeRole2)
                        return await joueur.delete(`AntiRaid_EmojiDelete_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_EmojiDelete_${executor.id}`))return;
            joueurverif.add(`AntiRaid_EmojiDelete_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}