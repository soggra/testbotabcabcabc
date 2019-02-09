const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {



    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You can't ban this user!").then(msg => msg.delete(5000));

    var user = message.guild.member(message.mentions.users.first());

    if (!user) return message.reply("You need to tag a user!").then(msg => msg.delete(5000));

    if (user.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission!").then(msg => msg.delete(5000));

    var reason = args.join(" ").slice(22);

    if (!reason) return message.reply("You didn't type a reason!").then(msg => msg.delete(5000));

    var tempBanTime = args[1];

    if (ms(tempBanTime)) {

        await message.guild.member(user).ban(reason);

        message.channel.send(`This ${user} have been banned for ${tempBanTime}`).then(msg => msg.delete(5000));

        setTimeout(function () {
            
            message.guild.unban(user.id);

            message.channel.send(`This ${user} is now **unbanned**!`).then(msg => msg.delete(5000));

        }, ms(tempBanTime));


        let banChannel = message.guild.channels.find(`name`, "mod-logs")
        if(!banChannel) return message.channel.send('**Please create a channel with the name `mod-logs` Or use the command `setup`**').then(msg => msg.delete(5000));



        let banEmbed = new Discord.RichEmbed()
       .setDescription("~Banned~")
       .setColor("RANDOM")
       .addField("Banned User", `${User} with ID ${User.id}`)
       .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
       .addField("Banned In", message.channel)
       .addField("When Banned", message.createdAt)
       .addField('Time', `${ms(ms(mutetime))}`)
       .addField("Reason", reason);
       banChannel.send(banEmbed);

       if(!kickChannel) return message.channel.send('**Please create a channel with the name `mod-logs` Or use the command `setup`**').then(msg => msg.delete(5000));


       

    } else {
        return message.reply("You didn't type a time!").then(msg => msg.delete(5000));
    }

}

module.exports.help = {
    name: "tempban",
    aliases: ["tempb"]
}