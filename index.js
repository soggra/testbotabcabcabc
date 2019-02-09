const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const antispam = require("discord-anti-spam");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
let coins = require("./coins.json");
let xp = require("./xp.json");
let purple = botconfig.purple;
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));




fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
       bot.aliases.set(alias, props.help.name)
    });
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("A Sexy Girl | $help", { type: 'STREAMING', url: 'https://www.twitch.tv/retard'});

});


bot.on('message', async message => {
	if (message.content === '$vem') {
    const embed = new Discord.RichEmbed()
    .setDescription(`Hello! Welcome to **${message.guild.name}**! Please read the Rules
    and react to the message to verify you have agreed with them.
    Then you will automatically receive your role.`)
    .setColor('RANDOM')
		const reactmessage = await message.channel.send(embed)

		await reactmessage.react('👌');

		const filter = (reaction, user) => reaction.emoji.name === '👌' && !user.bot;
    const collector = reactmessage.createReactionCollector(filter, { time: 15000 });
    let modlog = message.guild.channels.find(`name`, "mod-logs");

    


		collector.on('collect', async reaction => {
			const user = reaction.users.last();
			const guild = reaction.message.guild;
			const member = guild.member(user) || await guild.fetchMember(user);
			member.addRole('450324223521587211');
      console.log(`Added the role to ${member.displayName}`);
		});
	}
});



bot.on("messageUpdate", async(oldMessage, newMessage) => {

  if(oldMessage.content === newMessage.content){
    return;
  }

  let modlog = oldMessage.guild.channels.find(x => x.name  === "mod-logs")

  let logembed = new Discord.RichEmbed()
  .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL)
  .setThumbnail(oldMessage.author.displayAvatarURL)
  .setColor("RANDOM")
  .setDescription("Message Edited")
  .addField("Before", oldMessage.content, true)
  .addField("After", newMessage.content, true)
  .setFooter(`Logs`)
  .setTimestamp()

  modlog.send(logembed)

})


bot.on('messageDelete', async (message) => {
  const logs = message.guild.channels.find('name', 'mod-logs');

  const entry = await message.guild.fetchAuditLogs({
      type: 'MESSAGE_DELETE'
  }).then(audit => audit.entries.first())
  let user;
  if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
      user = entry.executor.username
  } else {
      user = message.author
  }
  const logembed = new Discord.RichEmbed()
      //.setTitle('Message Deleted')
      .setAuthor(user.tag, message.author.displayAvatarURL)
      .setDescription("Message Deleted")
      .addField("Message Content", message.content)
      .setColor(message.guild.member(bot.user).displayHexColor)
      .setFooter(`Logs`)
      .setTimestamp()
  //console.log(entry)
  logs.send(logembed);
})




antispam(bot, {
  warnBuffer: 4, //Maximum amount of messages allowed to send in the interval time before getting warned.
  maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
  interval: 1000, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
  warningMessage: "Hello, Stop spamming! If you will continue spamming you will get **Banned**!", // Warning message send to the user indicating they are going to fast.
  banMessage: "was banned for spamming. Don't try me **bitch** or you will cry", // Ban message, always tags the banned user in front of it.
  maxDuplicatesWarning: 5, // Maximum amount of duplicate messages a user can send in a timespan before getting warned
  maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
  deleteMessagesAfterBanForPastDays: 7 // Delete the spammed messages after banning for the past x days.
});

bot.on('guildMemberAdd', member => {
  let channel = member.guild.channels.find('name', 'welcome');
  let memberavatar = member.user.avatarURL
  
      if (!channel) return;
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(memberavatar)
      .addField(':wave: New member', `Hey, **${member.user.tag}**. Welcome to **${member.guild.name}**!
      You are the **${member.guild.memberCount}**th member!`)
      .setTimestamp()
      channel.sendEmbed(embed);
});

bot.on('guildMemberRemove', member => {
  let channel = member.guild.channels.find('name', 'welcome');
  let memberavatar = member.user.avatarURL
      if (!channel) return;
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .addField(':sob: Member left', `Its look like **${member.user.tag}** has left us. :cry:`)
      .setTimestamp()

      channel.sendEmbed(embed)
});



  
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;


  let blackkisted = ['gay' ,'homo', 'wtf', 'kill', 'https://', 'discord.gg/', 'הומו', 'בן זונה', 'שרמוטה']
  let modlog = message.guild.channels.find(channel => channel.name === 'mod-logs');
  
  let foundInText = false;
  for(var i in blackkisted) {
    if (message.content.toLowerCase().includes(blackkisted[i].toLowerCase())) foundInText = true;
  }
  if (foundInText) {
    message.delete();
    message.reply('Sorry, That word is **BlackListed**!').then(msg => msg.delete(10000));


    let blackword = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Blacklist Message",  `Hello, <@${message.author.id}> Sended a BlackList word! You need to warn him manually!`)

    modlog.send(blackword)
  
  }
 
  if(!coins[message.author.id]){
    coins[message.author.id] = {
      coins: 0
    };
  }

  let coinAmt = Math.floor(Math.random() * 15) + 1;
  let baseAmt = Math.floor(Math.random() * 15) + 1;
  console.log(`${coinAmt} ; ${baseAmt}`);

  if(coinAmt === baseAmt){
    coins[message.author.id] = {
      coins: coins[message.author.id].coins + coinAmt
    };
  fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
    if (err) console.log(err)
  });
  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("RANDOM")
  .addField("💸", `${coinAmt} coins added!`);

  message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
  }

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setTitle("Level Up!")
    .setColor(purple)
    .addField("New Level", curlvl + 1);

    message.channel.send(lvlup).then(msg => {msg.delete(5000)});
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });


//

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
  if(commandfile) commandfile.run(bot,message,args);

});

bot.login(botconfig.token);