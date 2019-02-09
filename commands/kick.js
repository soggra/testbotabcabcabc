const Discord = require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {


    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You don't have permission to kick!")
    if(args[0] == "help"){
      message.reply("Usage: $kick <user> <reason>");
      return;
    }
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.reply("You didn't mention a user!")
    let kReason = args.join(" ").slice(22);
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't kick this person!").then(msg => msg.delete(5000));


    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("RANDOM")
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "mod-logs")
    if(!kickChannel) return message.channel.send('**Please create a channel with the name `mod-logs` Or use the command `setup`**').then(msg => msg.delete(5000));
    message.guild.member(kUser).kick(kReason);
    message.channel.send(`${kUser} Have been kicked for the server! 🙌`).then(msg => msg.delete(10000));
    kickChannel.send(kickEmbed);
}

module.exports.help = {
  name:"kick",
  description: "",
  aliases: ["keck"]
}
