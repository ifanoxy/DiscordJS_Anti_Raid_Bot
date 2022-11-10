module.exports = {
    // FR | Token de votre bot. N'écrivez rien si vous voulez inscrire le token dans le process (process.env.DISCORDTOKEN)
    // EN | Your bot's token. Do not write anything if you want to save the token in the process (process.env.DISCORDTOKEN)
    DiscordToken: "",
    // FR | L'identifiant de votre serveur.
    // EN | Your server ID.
    DeveloperGuildID: "",
    Language: "fr", // fr / en
    // FR | Définissez ce que l'anti raid va examiner
    // EN | Define what anti-raid will examine
    antiraid: {
        ChannelCreate: true, // True/False | Quand un channel est créé | When a channel is created
        ChannelDelete: true, // True/False | Quand un channel est supprimé | When a channel is deleted
        EmojiCreate: true, // True/False | Quand un emoji est créé | When an emoji is created
        EmojiDelete: true, // True/False | Quand un emoji est supprimé | When an emoji is deleted
        StickerCreate: true, // True/False | Quand un autocollant est créé | When a sticker is created
        StickerDelete: true, // True/False | Quand un autocollant est supprimé | When a sticker is deleted
        BanAdd: true, // True/False | Quand un membre se fait bannir | When a member gets banned
        BanRemove: true, // True/False | Quand un membre se fait débannir | When a member gets unbanned
        Kick: true, // True/False | Quand un membre se fait kick | When a member gets kicked
        RoleCreate: true, // True/False | Quand un role est créé | When a role is created
        RoleDelete: true, // True/False | Quand un role est supprimé | When a role is deleted
        BotAdd: false, // True/False | Limite l'ajout de bot au propriétaire et aux personnes whilister | Limit adding bot to owner and whilister people
    },
    // FR | Définissez des limites anti-raid
    // EN | Set anti-raid limits
    limits: {
        time: 15, // Temps en seconde dans laquel la limite ne peut pas être dépassée | Time in seconds in which the limit cannot be exceeded
        ChannelCreate: 5, // Quand un channel est créé | When a channel is created
        ChannelDelete: 5, // Quand un channel est supprimé | When a channel is deleted
        EmojiCreate: 5, // Quand un emoji est supprimé | When an emoji is created
        EmojiDelete: 5, // Quand un emoji est supprimé | When an emoji is deleted
        StickerCreate: 5, // Quand un autocollant est créé | When a sticker is created
        StickerDelete: 5, // Quand un autocollant est supprimé | When a sticker is deleted
        BanAdd: 5, // Quand un membre se fait bannir | When a member gets banned
        BanRemove: 2, // Quand un membre se fait débannir | When a member gets unbanned
        Kick: 5, // Quand un membre se fait kick | When a member gets kicked
        RoleCreate: 5, // Quand un role est créé | When a role is created
        RoleDelete: 5, // Quand un role est supprimé | When a role is deleted
    },
    // FR | Définissez la sanction appliquer à l'encontre de l'anti raid
    // EN | Define the sanction to apply against the anti raid
    sanction: {
        ChannelCreate: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        ChannelDelete: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        EmojiCreate: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        EmojiDelete: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        StickerCreate: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        StickerDelete: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        BanAdd: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        BanRemove: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        Kick: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        RoleCreate: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        RoleDelete: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        BotAdd: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
        Urgence: "Kick", // Choix possible : "Ban" / "Kick" / "RemoveRole"
    },
    // FR | Définissez ce que vous voulez après qu'une personne ait franchi la limite de l'anti raid.
    // EN | Set whatever you want after someone crosses the anti raid boundary.
    restore: {
        ChannelReDelete: false, // Supprimer les channels qui ont été créés | Delete channels that have been created
        ChannelReCreate: false, // Recréer les channels qui ont été supprimés | Recreate channels that have been deleted
        Unban: false, // Débannir toute les personnes qui ont été bannis | Unban everyone who has been banned
        Reban: false, // Bannir toute les personnes qui ont été débannis | Ban everyone who has been unbanned
        RoleReDelete: false, // Supprimer les Roles qui ont été créés | Delete Role that have been created
    },
    Urgence : {
        ChannelCreate: true, // True/False | Quand un channel est créé | When a channel is created
        ChannelDelete: true, // True/False | Quand un channel est supprimé | When a channel is deleted
        EmojiCreate: true, // True/False | Quand un emoji est créé | When an emoji is created
        EmojiDelete: true, // True/False | Quand un emoji est supprimé | When an emoji is deleted
        StickerCreate: true, // True/False | Quand un autocollant est créé | When a sticker is created
        StickerDelete: true, // True/False | Quand un autocollant est supprimé | When a sticker is deleted
        BanAdd: true, // True/False | Quand un membre se fait bannir | When a member gets banned
        BanRemove: true, // True/False | Quand un membre se fait débannir | When a member gets unbanned
        Kick: true, // True/False | Quand un membre se fait kick | When a member gets kicked
        RoleCreate: true, // True/False | Quand un role est créé | When a role is created
        RoleDelete: true, // True/False | Quand un role est supprimé | When a role is deleted
    },
    // Optionnel / Optional
    // FR | Définir le status du bot.
    // EN | Set bot status.
    BotStatus : {
        Name: "with your security", // What you want
        Type: "Playing", // "Playing" / "Listening" / "Watching" / "Competing"
        Status: "online", // "online" / "idle" / "offline" / "dnd"
    },
    // Optionnel / Optional
    // FR | Les membres pouvant contournés l'anti raid. Saisissez le/les identifiant(s), vous devez les séparer par des virgules.
    // EN | Members who can bypass the anti raid. Enter the identifier(s), you must separate them with commas.
    WhitelistMemberID: [""], // ex: ["ID_1","ID_2"]
    WhitelistRoleID: [""], // ex: ["ID_1","ID_2"]
}