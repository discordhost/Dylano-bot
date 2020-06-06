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

});


// ALLE BERICHTEN
client.on("message", async message =>{

    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var args = messageArray.slice(1);



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
            mutePerson.roles.add(realRole.id);
            message.channel.send(`${mutePerson} is niet meer gestraft!`);

        }, ms(muteTime));
    }

    
    // HELP
    if(command === `${prefix}help`){

        var botEmbed = new discord.MessageEmbed()
        .setTitle("Help")
        .setDescription("Welkom bij Dylano Bot!")
        .addFields(
            {name: "Wil jij deze bot gebruiken?", value: "Gebruik dan even '&commands' zo kan je alle commands zien die je kan gebruiken met deze bot!"},
            {name: "Er is een probleem met de bot!", value: "Heb jij iets opgemerkt dat niet werkt. Dan kan je altijd de owner van de bot contacteren. Discord owner: 'Dylano #3251'"}
            )
        .setColor("#05f8f8")
        .setFooter("Server: Dylano")
        .setTimestamp()
        return message.channel.send(botEmbed);
    }


    // VALORANT
    if(command === `${prefix}valorant`){

        var botEmbed = new discord.MessageEmbed()
        .setTitle("VALORANT naam")
        .addField("VALORANT naam + tag", "LaatMaarKomen #3746")
        .setColor("#06eb3d")
        .setFooter("Server: Dylano")
        .setTimestamp()

        return message.channel.send(botEmbed);
    }


    // CALL OF DUTY MW
    if(command === `${prefix}MW`){

        var botEmbed = new discord.MessageEmbed()
        .setTitle("Call Of Duty MW naam")
        .setDescription("Naam en tag in geven op battle.net!")
        .addField("Call Of Duty MW naam + tag", "dylano#21611")
        .setColor("#0ceea9")
        .setFooter("Server: Dylano")
        .setTimestamp()

        return message.channel.send(botEmbed);
    }


    // TWITCH
    if(command === `${prefix}twitch`){

        var botEmbed = new discord.MessageEmbed()
        .setTitle("Twitch")
        .setDescription("Hier heb je een linkje om naar de Twitch channel te gaan!")
        .addFields(
            {name: "Twitch link", value:"https://www.twitch.tv/dylanodelaere"}
        )
        .setColor("#9f2be2")
        .setFooter("Server: Dylano")
        .setTimestamp()
        
        return message.channel.send(botEmbed);
    }


    // COMMANDS
    if(command === `${prefix}commands`){
        
        var botEmbed = new discord.MessageEmbed()
        .setTitle("Alle commands voor deze bot!")
        .setDescription("Hier kan je alle commands zien die je kan gebruiken mat deze bot!")
        .setColor("#05f8f8")
        .addFields(
            {name: "Help command", value:"&help"},
            {name: "Info over de server", value:"&serverinfo"},
            {name: "Twitch link", value: "&twitch"},
            {name: "VALORANT naam", value: "&valorant"},
            {name: "Call Of Duty MW naam", value: "&MW"}
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
            {name: "Totaal aantal mensen op deze server:", value:message.guild.memberCount},
            {name: "Je bent lid geworden van deze server sinds:", value:message.member.joinedAt},
            {name: "Bot naam:", value:client.user.username}
        )
        .setColor("#05f8f8")
        .setFooter("Server: Dylano", "https://imgur.com/w9x1Jwe.png")
        .setTimestamp()
        return message.channel.send(botEmbed);
    }
});


client.login(token).catch(err => console.log(err));