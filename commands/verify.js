const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.delete()

    if(!message.content.startsWith(`$`)) return message.reply(`This is not my prefix! The Prefix is **$**`);

    let role = message.guild.roles.find(role => role.name === 'Member');
    if (message.channel.name !== 'verification') return message.reply('You must go to the channel #verification').then(r => r.delete(5000));
    message.member.addRole(role);
    if (message.member.roles.has(role.id)) {
        let verifyEmbed = new Discord.RichEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor('#36393f')
            .setDescription('Your account has already been verified!')
        return message.channel.send((verifyEmbed)).then(r => r.delete(5000));
    } else {
        let verifyEmbed = new Discord.RichEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor('#36393f')
            .setDescription('Your account has been successfully verified.')
            message.channel.send((verifyEmbed)).then(r => r.delete(5000));
    


    let modlog = message.guild.channels.find(`name`, "mod-logs");
    if (!modlog) return message.channel.send('**Please create a channel with the name `mod-logs` Or use the command `setup`**').then(msg => msg.delete(5000));
    
    let modembed = new Discord.RichEmbed()
    .setAuthor(message.member.displayName, message.author.displayAvatarURL)
    .setThumbnail(message.author.displayAvatarURL)
    .addField("User Data", `<@${message.author.id}> ID: ${message.author.id}`)
    .addField("User", "The user have been successful the verify!")
    modlog.send(modembed)

}
}

module.exports.help = {
    name: 'verify',
    description: 'you must have the Member role',
    
    aliases: ["v"]
}