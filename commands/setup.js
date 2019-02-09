const Discord = require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => { 


    const modlog = message.guild.channels.find(channel => channel.name === 'mod-logs');
    if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);
    const filter = m => m.author.id === message.author.id;
    message.reply("If you want me to create **Welcome** and **Logs** channels... `Yes` or `No` Will be expire in 10 seconds!").then(r => r.delete(3000));
    message.channel.awaitMessages(filter, {
        max:1, 
        time: 10000
    }).then(collected =>{


    if(collected.first().content === "no") {
        return message.reply("Canceled!")
    }


    const welcome = message.guild.channels.find(channel => channel.name === 'welcome');
    let welcomechannel = message.guild.channels.find(`name`, "welcome")
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(collected.first().content));
    let muterole = message.guild.roles.find(`name`, "Muted");
    if (!welcomechannel){
        message.guild.createChannel('Welcome', 'text')
        message.reply(`**Welcome** channel have been created!`).then(r => r.delete(5000));
    }
    let modlogs = message.guild.channels.find(`name`, "mod-logs");
    if(!modlogs){
       message.guild.createChannel('mod-logs', 'text')
       return message.reply('**Mod Logs** Channel have been created!').then(r => r.delete(5000));
    }

    }).catch(err =>{
       message.reply("Time has expied!").then(r => r.delete(5000));
    })

}
module.exports.help = {
    name: "setup",
    aliases: ["set", "setu"],
    description: "",

    category: "MODERATION"
}