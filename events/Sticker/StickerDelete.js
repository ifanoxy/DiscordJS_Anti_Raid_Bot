const { Sticker, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "stickerDelete",
    once: false,
    /**
     * 
     * @param {Sticker} Sticker 
     * @param {Client} client 
     * @returns 
     */
    async execute(Sticker, client, lang) {
        const wluser = config.WhitelistMemberID;
        const wlrole = config.WhitelistRoleID;
        
        const dblimit = config.limits.StickerDelete
        if(!dblimit)return;
        const fetchLog = await Sticker.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.StickerDelete
        })
        const { executor } = fetchLog.entries.first();
        if(executor.id == client.user.id)return;
        const member = await Sticker.guild.members.fetch(executor.id).catch(()=> {return})
        const owner = await Sticker.guild.fetchOwner()
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
        const dbplayer = await joueur.get(`AntiRaid_StickerDelete_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_StickerDelete_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_StickerDelete_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_StickerDelete_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.StickerDelete
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.stickerDelete.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.stickerDelete.BanCatch2).catch()
                        })
                        executor.send(lang.stickerDelete.Ban1 + Sticker.guild.name + lang.stickerDelete.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_StickerDelete_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.stickerDelete.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.stickerDelete.KickCatch2).catch()
                        })
                        executor.send(lang.stickerDelete.Kick1 + Sticker.guild.name + lang.stickerDelete.Kick2)
                        return await joueur.delete(`AntiRaid_StickerDelete_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.stickerDelete.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.stickerDelete.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.stickerDelete.removeRole1 + Sticker.guild.name + lang.stickerDelete.removeRole2)
                        return await joueur.delete(`AntiRaid_StickerDelete_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_StickerDelete_${executor.id}`))return;
            joueurverif.add(`AntiRaid_StickerDelete_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}