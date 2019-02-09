const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

    message.delete();
    if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);
    if (!message.member.hasPermissions ('MANAGE_MESSAGES')) return message.channel.send("You need **MANAGE_MESSAGES** permissions for use this command.")
    const modlog = message.guild.channels.find(channel => channel.name === 'mod-logs');
    const mod = message.author;
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let users = message.mentions.members.first();
    if (!user) return message.reply("Couldn't find user. You need to tag him!").then(msg => msg.delete(5000));
    let reason = args.slice(2).join(" ");
    if (!reason) return message.channel.send('Type a specific reason and time!').then(msg => msg.delete(5000));
    let muterole = message.guild.roles.find(`name`, "Muted");
    if(args[0] == "help"){
      message.reply("Usage: $mute <user> <time> <reason>");
      return;
    }
  let muteChannel = message.guild.channels.find(`name`, "mod-logs");
  if (!muteChannel) return message.channel.send('**Please create a channel with the name `mod-logs` Or use the command `setup`**').then(msg => msg.delete(5000));
  if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    let mutetime = args[1];
    if(!mutetime) return message.reply("You Didn't type a specify time You need to time - 5s/3m/8h or what do you want!").then(msg => msg.delete(8000));
    await (user.addRole(muterole.id));
    const muteembed = new Discord.RichEmbed()
            .setAuthor(' Action | Mute', `https://images-ext-2.discordapp.net/external/Wms63jAyNOxNHtfUpS1EpRAQer2UT0nOsFaWlnDdR3M/https/image.flaticon.com/icons/png/128/148/148757.png`)
            .addField('User', `<@${user.id}>`)
            .addField('Reason', `${reason}`)
            .addField('Time', `${ms(ms(mutetime))}`)
            .addField('Moderator', `${mod}`)
            .setColor('RANDOM')
        modlog.send(muteembed)
        message.channel.send(`${user} Have been muted for **${ms(ms(mutetime))}**. Now the chat will be silence 😆`).then(msg => msg.delete(10000));

        setTimeout(function(){
            user.removeRole(muterole.id);
            const unmuteembed = new Discord.RichEmbed()
            .setAuthor(' Action | UnMute', `https://images-ext-2.discordapp.net/external/wKCsnOcnlBoNk-__BXsd6BrO6YddfUB-MtmaoaMxeHc/https/lh3.googleusercontent.com/Z5yhBQBJTSJVe5veJgaK-9p29hXm7Kv8LKF2oN0hDnsToj4wTcQbirR94XVpH4Lt5a5d%3Dw300`)
            .addField('User', `<@${user.id}>`)
            .addField('Reason', `${reason}`)
            .addField('Moderator', `${mod}`)
            .setColor('RANDOM')
            modlog.send(unmuteembed)
            message.channel.send(`${user} Have been unmuted! Now can you talk! 😭`).then(msg => msg.delete(10000));



        }, ms(mutetime));
  
  
}


exports.conf = {
    aliases: [],
    permLevel: 2
};

module.exports.help = {
    name: "mute",
    category: "MODERATION",
    description: "",

    aliases: ["muted"]
}