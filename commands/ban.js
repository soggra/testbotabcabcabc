const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You don't have `BAN_MEMBERS` permission!")
    if(args[0] == "help"){
      message.reply("Usage: !ban <user> <reason>");
      return;
    }
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.reply("You didn't mention a user!")
    if(bUser.id === bot.user.id) return message.reply("You can't ban this person!")
    let bReason = args.join(" ").slice(22);
    if(!bReason) return message.reply("You need to type a **specific reason!**")
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't ban this person!")


    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "mod-logs")
    if(!incidentchannel) return message.channel.send("**Please create a channel with the name `mod-logs` Or use the command `setup`**").then(msg => msg.delete(5000));

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);
}

module.exports.help = {
  name:"ban",
  description: "Banning user from the server",
  aliases: ["ba"]
}
