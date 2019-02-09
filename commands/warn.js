const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {

  if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`).then(msg => msg.delete(5000));
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do this!").then(msg => msg.delete(5000));
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  
  if(!wUser) return message.reply("Couldn't find him! You must tag the user!");
  if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't kick a Mod/Admin").then(msg => msg.delete(5000));
  let reason = args.slice(1).join(" ");
  if (!reason) return message.reply('Type a specific reason!').then(msg => msg.delete(5000));

  if(args[0] == "help"){
    message.reply("Usage: $warn <user> <reason>").then(msg => msg.delete(5000));
    return;
  }

  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;

  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnchannel = message.guild.channels.find(`name`, "mod-logs");

  let warnEmbed = new Discord.RichEmbed()
  .setDescription("Warns")
  .setAuthor(message.author.username)
  .setColor("#fc6400")
  .addField("Warned User", `<@${wUser.id}>`)
  .addField("Warned In", message.channel)
  .addField("Number of Warnings", warns[wUser.id].warns)
  .addField("Reason", reason);
  warnchannel.send(warnEmbed);
  message.channel.send(`${wUser} Have been warn by an Moderator!`).then(msg => msg.delete(5000));
  
  if(!warnchannel) return message.reply("**Couldn't find mod-logs, you need to create or use `setup` command!**").then(msg => msg.delete(5000));

  warnchannel.send(warnEmbed);

  if(warns[wUser.id].warns == 2){
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role.").then(msg => msg.delete(5000));

    let mutetime = "60s";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> **has been for 60s muted**`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> **has been unmuted.**`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 5){
    message.guild.member(wUser).kick(reason);
    message.reply(`<@${wUser.id}> has been kicked!`)
  }

}

module.exports.help = {
  name: "warn",
  description: "",

  aliases: ["w"]
}
