const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

mention = message.mentions.users.first();

if (mention == null) {return;}
  message.delete();
  mentionMessage = args.slice(1).join(" ");
  mention.send(mentionMessage);
  message.channel.send ("The message has been sended!").then(msg => msg.delete(7000));

}

module.exports.help = {
  name: "send",
  description: "",

  aliases: ["sand"]
}
