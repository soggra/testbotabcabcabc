const Discord = require("discord.js");

module.exports.run = async (bot, message, args, messages) => {

  const deleteCount = parseInt(args[0], 10);
  if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have `MANAGE_MESSAGES` permissions ");
  let reason = args.slice(1).join(" ");
  if (!reason) return message.reply('Type a specific reason!').then(msg => msg.delete(5000));
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete.");
   
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  
  let purgeEmbed = new Discord.RichEmbed()
    .setAuthor("♻️ Action | Purge")
    .setColor("RANDOM")
    .addField("Moderator", `<@${message.author.id}>`)
    .addField("Purge", `${args[0]} Messages`)
    .addField("Reason", reason)
    .addField("Channel", message.channel)
    message.channel.send (`God cleared **${args[0]}** messages! `).then(msg => msg.delete(7000));

    let purgeChannel = message.guild.channels.find(`name`, "mod-logs");
    if(!purgeChannel) return message.channel.send("**Please create a channel with the name `mod-logs` Or use the command `setup`**");

    purgeChannel.send(purgeEmbed);

  }
  module.exports.help = {
    name:"clear",
    description: "Clearing messages",
    aliases: ["pruge"]
  }