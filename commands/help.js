const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
const prefix = botconfig.prefix

module.exports.run = async (bot, message, args) => {

    if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);
    if(args[0] == "help") return message.channel.send(`Just do ${prefix}help instead.`)

    if(args[0]) {
        let command = args[0];
        if(bot.commands.has(command)) {
            command = bot.commands.get(command)
            var SHembed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setAuthor(`Soggra's Bot Help`, message.guild.iconURL)
            .setDescription(`The bot prefix is: ${prefix}\n\n**Command:** ${command.help.name}\n**Description:** ${command.config.description || "No Description"}\n**Usage:** ${command.config.usage || "No Usage"}\n**Accessable by:** ${command.config.accessableby || "Members"}\n**Aliases:** ${command.config.noalias || command.config.aliases}`)
            return message.channel.send(SHembed);

        }}

    if(!args[0]) {
        message.delete();
        let embed = new Discord.RichEmbed()
        .setAuthor(`Help Command!`, message.guild.iconURL)
        .setColor("RANDOM")
        .setDescription(`${message.author.username} check your dms's!`)

        let SHembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Soggra's Bot Help`, message.guild.iconURL)
        .setThumbnail(bot.user.displayAvatarURL)
        .setDescription(`These are avaliable commands for the Soggra's Bot\nThe bot prefix is: **${prefix}**`)
        .addField(`Commands`, "`ban` `kick` `clear` `help` `mute` `setup` `unmute` `vm` `verify` `warn` `warnlevel` `coins` `level`")
        message.channel.send(embed).then(m => m.delete(10000));
        message.author.send(SHembed);
    }
    
}

module.exports.help = {
    name: "help",
    aliases: ["h", "halp", "commands"],
    usage: "!usage",
    description: "",
    noalias: "No Aliases",
    accessibleby: "Members"
}