const discord = require("discord.js");
const botConfig = require("./botconfig.json");
const client = new discord.Client();

client.login(botConfig.token);


// ONLINE MESSAGE
client.on("ready", async () => {

    console.log(`${client.user.username} is now online`);
    client.user.setActivity("&help | &commands", {type: "PLAYING"});
    
});


client.on("message", async message =>{

    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];


    // HELP
    if(command === `${prefix}help`){
        return message.channel.send("&help komt binnenkort!");
    }

    // KICK
    if(command === `${prefix}kick`){

        var args = message.content.slice(prefix.length).split(/ +/);

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Jij kan niemand kicken!");

        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Je heb geen toegang om iemand te kicken");

        if(!args[1]) return message.reply("Er is geen persoon opgegeven!");

        if(!args[2]) return message.reply("Er is geen reden opgegeven!");

        var kickUser = message.guild.member (message.mentions.users.first() || message.guild.members.get(args[1]));

        var Reason = args.splice(2).join(" ");

        if(!kickUser) return message.reply("Persoon niet gevonden!");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Gelieve binnen 30 sec te reageren")
            .setDescription(`Wil je ${kickUser} kicken?`)

        var embed = new discord.MessageEmbed()
            .setColor("#d42424")
            .setFooter(message.member.displayName)
            .setTimestamp
            .setDescription(`**Gekickt: ** ${kickUser} (${kickUser.id})
            **Gekickt door:** ${message.author}
            **Reden:** ${Reason}`);


        message.channel.send(embedPrompt).then(async msg =>{

            var emoji = await promptMessage(msg, message.author, 30, ["✔", "❌"]);

            if(emoji === "✔"){

                msg.delete();

                kickUser.kick(Reason).catch(err => {
                    if (err) return message.reply("Er is iets foutgelopen! Probeer het opnieuw!")
                });

                message.channel.send(embed);
              
            }else if(emoji === "❌"){

                msg.delete();

                (await message.reply("Kick geanuleerd")).then(m => m.delete(5000));

            }
        })
    }

    // COMMANDS
    if(command === `${prefix}commands`){
        
        var botEmbed = new discord.MessageEmbed()
        .setTitle("Alle commands voor deze bot!")
        .setDescription("Hier kan je alle commands zien die je kan gebruiken mat deze bot!")
        .setColor("#f80606")
        .addFields(
            {name: "Help command", value:"&help"},
            {name: "Info over de server", value:"&serverinfo"}
        )
        .setFooter("Server: Dylano", "https://imgur.com/w9x1Jwe.png")
        .setTimestamp()
        return message.channel.send(botEmbed);
    }

    //SERVERINFO
    if(command === `${prefix}serverinfo`){
        
        var botEmbed = new discord.MessageEmbed()
        .setTitle("Server info!")
        .addFields(
            {name: "totaal aantal mensen op deze server:", value:message.guild.memberCount},
            {name: "Je bent lid geworden van deze server sinds:", value:message.member.joinedAt},
            {name: "Bot naam", value:client.user.username}
        )
        .setColor("#f80606")
        .setFooter("Server: Dylano", "https://imgur.com/w9x1Jwe.png")
        .setTimestamp()
        return message.channel.send(botEmbed);
    }
});


async function promptMessage(message, author, time, reactions){

    time *= 1000;

    for(const reaction of reactions){
        await message.react(reactoin);
    }

    var filter = (reaction, user) => reactions.inculudes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, {max:1, time: time}).then(collected.first() && collected.first().emoji.name);
}


bot.login(process.env.token);