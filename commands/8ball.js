const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    
    if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);
    if(!args[2]) return message.reply("Please ask a full question!")
    let replies = ["Yes.", "No" , "I don't know?", "Ask me again later!"];

    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(0).join(" ");

    let ballembed = new Discord.RichEmbed()
    .setAuthor(message.author.tag)
    .setColor("RANDOM")
    .addField("Question", question)
    .addField("Answer", replies[result]);
    message.channel.send(ballembed);
}

module.exports.help = {
    name:"8ball",
    description: "Yes, No Answers",
    aliases: ["ball"]
  }
  