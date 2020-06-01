const discord = require("discord.js");

module.exports.run = async(bot, message, args) =>{

    return message.channel.send("&help komt binnenkort!");

}

module.exports.help = {
    name: "help"
}