const discord = require("discord.js");
const botConfig = require("./botconfig.json");
const client = new discord.Client();
const ms = require('ms');
const token = process.env.token;




// ONLINE MESSAGE LOG
client.on("ready", async () => {

    console.log(`${client.user.username} is now online`);
    client.user.setActivity("&help | &commands", {type: "PLAYING"});
    
});

// RANG JOIN
client.on("guildMemberAdd", member =>{

    var role = member.guild.roles.cache.get('705795057361616939');

    if(!role) return;

    member.roles.add(role);

    var channel = member.guild.channel.cache.get('663095149915537458');

    if(!channel) return;

    channel.send(`Welkom bij de server ${member}`);

})

// ALLE BERICHTEN
client.on("message", async message =>{

    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var args = messageArray.slice(1);


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

    // STRAF
    if(command === `${prefix}straf`){

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Jij kan niemand straffen!");

        if (!args[0]) return message.reply("Geen presoon opgegeven!");

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Geen toegang om iemand te straffen!");

        var mutePerson = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        if (!mutePerson) returnmessage.reply("Kan persoon niet vinden!");

        if (mutePerson.hasPermission("MANAGE_MESSAGES")) return message.reply("Je kan deze persoon niet straffen!");

        var realRole = message.guild.roles.cache.get('715448011789959232');
        if (!realRole) return message.reply("Rol is niet goed ingesteld! Vraag aan de maker van de dot om het goed te zetten!");

        var muteRole = message.guild.roles.cache.get('715448159412813905');
        if (!muteRole) return message.reply("Rol is niet goed ingesteld! Vraag aan de maker van de bot om het goed te zetten!");

        var muteTime = args[1];

        if (!muteTime) return message.reply("Geen tijd gevonden!");

        await(mutePerson.roles.add(muteRole.id));
        (mutePerson.roles.remove(realRole.id));
        message.channel.send(`${mutePerson} is nu gestraft voor ${muteTime}`);

        setTimeout(() => {
            
            mutePerson.roles.remove(muteRole.id);
            message.channel.send(`${mutePerson} is niet meer gestraft!`);

        }, ms(muteTime));
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

    // SERVERINFO
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


client.login(token).catch(err => console.log(err));