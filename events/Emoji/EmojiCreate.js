const { GuildEmoji, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "emojiCreate",
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
        
        const dblimit = config.limits.EmojiCreate
        if(!dblimit)return;
        const fetchLog = await GuildEmoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiCreate
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
        const dbplayer = await joueur.get(`AntiRaid_EmojiCreate_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_EmojiCreate_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_EmojiCreate_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_EmojiCreate_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.EmojiCreate
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.emojiCreate.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.emojiCreate.BanCatch2).catch()
                        })
                        executor.send(lang.emojiCreate.Ban1 + GuildEmoji.guild.name + lang.emojiCreate.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_EmojiCreate_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.emojiCreate.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.emojiCreate.KickCatch2).catch()
                        })
                        executor.send(lang.emojiCreate.Kick1 + GuildEmoji.guild.name + lang.emojiCreate.Kick2)
                        return await joueur.delete(`AntiRaid_EmojiCreate_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.emojiCreate.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.emojiCreate.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.emojiCreate.removeRole1 + GuildEmoji.guild.name + lang.emojiCreate.removeRole2)
                        return await joueur.delete(`AntiRaid_EmojiCreate_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_EmojiCreate_${executor.id}`))return;
            joueurverif.add(`AntiRaid_EmojiCreate_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}