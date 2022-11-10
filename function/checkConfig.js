const chalk = require('chalk')
const config = require('../config')
const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
)
  
function CheckConfig(lang) {
    if(!config.DeveloperGuildID)return console.log(chalk.red(lang.checkConfig.DeveloperGuild)), process.exit();
    objectMap(config.antiraid, v => {if(typeof v !== "boolean")return console.log(chalk.red(lang.checkConfig.AntiRaid) + chalk.blue(` | "${v}" Invalid`)), process.exit();})
    objectMap(config.limits, v => {if(!Number.isInteger(v))return console.log(chalk.red(lang.checkConfig.limits) + chalk.blue(` | "${v}" Invalid`)), process.exit();})
    objectMap(config.restore, v => {if(typeof v !== "boolean")return console.log(chalk.red(lang.checkConfig.restore) + chalk.blue(` | "${v}" Invalid`)), process.exit();})
    if(config.restore.ChannelReDelete == true && config.antiraid.ChannelCreate == false)console.log(chalk.yellow(lang.checkConfig.warning1 + " 'ChannelCreate' " + lang.checkConfig.warning2 + " 'ChannelReDelete'"));
    if(config.restore.ChannelReCreate == true && config.antiraid.ChannelDelete == false)console.log(chalk.yellow(lang.checkConfig.warning1 + " 'ChannelDelete' " + lang.checkConfig.warning2 + " 'ChannelReDreate'"));
    if(config.restore.Reban == true && config.antiraid.BanRemove == false)console.log(chalk.yellow(lang.checkConfig.warning1 + " 'BanRemove' " + lang.checkConfig.warning2 + " 'Reban'"));
    if(config.restore.Unban == true && config.antiraid.BanAdd == false)console.log(chalk.yellow(lang.checkConfig.warning1 + " 'BanAdd' " + lang.checkConfig.warning2 + " 'Unban'"));
    if(config.restore.RoleReDelete == true && config.antiraid.RoleCreate == false)console.log(chalk.yellow(lang.checkConfig.warning1 + " 'RoleCreate' " + lang.checkConfig.warning2 + " 'RoleReDelete'"));
    const sanction = ["ban", "kick", "removerole"]
    objectMap(config.sanction, v => {if(!sanction.some(s => v.toLocaleLowerCase().includes(s)))return console.log(chalk.red(lang.checkConfig.sanction) + chalk.blue(` | "${v}" Invalid`)), process.exit();})
    objectMap(config.Urgence, v => {if(typeof v !== "boolean")return console.log(chalk.red(lang.checkConfig.Urgence) + chalk.blue(` | "${v}" Invalid`)), process.exit();})
}
module.exports = { CheckConfig }