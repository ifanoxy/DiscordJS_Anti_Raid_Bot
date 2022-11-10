const { Sticker, Client, AuditLogEvent } = require("discord.js");
const config = require('../../config')
const { db } = require('../..')

module.exports = {
    name: "stickerCreate",
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
        
        const dblimit = config.limits.StickerCreate
        if(!dblimit)return;
        const fetchLog = await Sticker.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.StickerCreate
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
        const dbplayer = await joueur.get(`AntiRaid_StickerCreate_${executor.id}`)
        if(!dbplayer){
            joueur.set(`AntiRaid_StickerCreate_${executor.id}`, 1)
        }else{
            if(await joueur.get(`AntiRaid_StickerCreate_${executor.id}`) < dblimit - 1){
                await joueur.add(`AntiRaid_StickerCreate_${executor.id}`, 1)
            }else{
                const sanc = config.sanction.StickerCreate
                switch(sanc.toLocaleLowerCase()){
                    case "ban": {
                        member.ban()
                        .catch(async () => {
                            owner.send(lang.stickerCreate.BanCatch1 +`${executor.tag} (${executor.id})`+ lang.stickerCreate.BanCatch2).catch()
                        })
                        executor.send(lang.stickerCreate.Ban1 + Sticker.guild.name + lang.stickerCreate.Ban2)
                        .catch()
                        return await joueur.delete(`AntiRaid_StickerCreate_${executor.id}`);
                    }break;
                    case "kick": {
                        member.kick()
                        .catch(async () => {
                            owner.send(lang.stickerCreate.KickCatch1 +`${executor.tag} (${executor.id})`+ lang.stickerCreate.KickCatch2).catch()
                        })
                        executor.send(lang.stickerCreate.Kick1 + Sticker.guild.name + lang.stickerCreate.Kick2)
                        return await joueur.delete(`AntiRaid_StickerCreate_${executor.id}`);
                    }break;
                    case "removerole": {
                        const allrole = member.roles.cache
                        allrole.map(role => {if(role.name == "everyone"){return}else{member.roles.remove(role.id).catch(() => {owner.send(lang.stickerCreate.removeRoleCatch1 + `${executor.tag} (${executor.id})`+ lang.stickerCreate.removeRoleCatch2 + `${role}` ).catch()})}})
                        executor.send(lang.stickerCreate.removeRole1 + Sticker.guild.name + lang.stickerCreate.removeRole2)
                        return await joueur.delete(`AntiRaid_StickerCreate_${executor.id}`);
                    }break;
                }
            }
        }
        setTimeout( async() => {
            const joueurverif = db.table('Joueur')
            if(!await joueurverif.get(`AntiRaid_StickerCreate_${executor.id}`))return;
            joueurverif.add(`AntiRaid_StickerCreate_${executor.id}`, -1)
        }, config.limits.time * 1000)
    },
}