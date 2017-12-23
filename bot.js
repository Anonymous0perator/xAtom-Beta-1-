const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const translate = require('google-translate-api');
const isoConv = require('iso-language-converter');
const os = require("os");
const ytdl = require('ytdl-core');
const opusscript = require('./opusscript');
const ud = require('./urban-dictionary')
const fs = require('fs');
const path = require('path')


client.on('ready', () => {
  console.log('Bot is up and running!');
  client.user.setPresence({
    game: {
      name :(`!help`),
      type: 0
    }
  });
});
const prefix = config.prefix;




client.on('message', message => {
  // Return if it is a bot
  if (message.author.bot) return;
  // Return if it is a DM
  if (!message.guild) {
    message.channel.send("You cannot do any of the bot's commands in DM")
    return;
  }

  // Saving memory, if there is no prefix it quits.
  if (!message.content.slice(1) === prefix) return;


  //Function for command checking
  function commandIs(command) {
    if (message.content.startsWith(prefix + command)) {
      return true;
    }
  }






//Membercount servie






if(commandIs("membercount")){
  let member = message.guild.member(message.author);
  let guild = message.guild
  const embed = new Discord.RichEmbed()
    .setDescription("Membercount")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setColor(0x70b080)
    .setFooter("xAtom", client.user.avatarURL)
    .setTimestamp(new Date())
    .addField("Server Name", message.guild.name)
    .addField("Members", guild.memberCount)
  message.channel.send(embed)
  return;

}

if(commandIs("nick")){
  try {
      let member = message.mentions.members.first();
      var mentioned = false
      var numberCount = 2
      if (message.mentions.members.array().length > 1) {
        message.channel.send("You cannot change multiple user's nickname at the same time.")
        return;
      }

      if (!member) {
        member = message.guild.members.get(message.author.id)
      } else {
        mentioned = true
      }
      if (mentioned) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_NICKNAMES")) {
          message.channel.send("You can't manage other's nicknames")
          return;
        }
      } else {
        numberCount = 1
      }
      let nickname = message.content.split(" ").slice(numberCount).join(" ")

      member.setNickname(`${nickname}`)
        .then(() => {
          if (!nickname) {
            nickname = "its default"
          }
          message.channel.send(`${member.user.tag}'s nickname is set to ${nickname}!`)
        })
        .catch(() => {
          message.channel.send("Please, report this problem to xAtom server.")
        })
      return;


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
}
  //Ping Command
  if (commandIs("ping")) {
    message.channel.send(`Pong! The bot's ping is ${Date.now() - message.createdTimestamp} ms`);
    return;
  }
  //mute command need to work on it
if(commandIs("mute")){
  try {
       let role = message.guild.roles.find("name", "Muted");
       let member = message.mentions.members.first();
       let bot = message.guild.member(client.user);

       if (!member) {
         message.channel.send("Please mention a valid member in this guild.");
         return;
       }
       if (!role) {
         message.guild.createRole({
           name: 'Muted',
           color: 'BLACK',
         }).catch(err => message.channel.send(ess.errorHandle(err)))
         message.channel.send("There was no Muted role so I created it. Try the mute command again.")
         return;
       }

       member.setMute(true)
       message.channel.overwritePermissions(member, {
         "SEND_MESSAGES": false
       })
       member.addRole(role)
       message.channel.send("Muted!")
     } catch (err) {
       message.channel.send(ess.errorHandle(err));
     }
}
  // Whois Command updated version
  if (commandIs("userinfo")) {
    let member = message.guild.member(message.author);
    let guild = message.guild
    const embed = new Discord.RichEmbed()
      .setDescription("Description and information about yourself.")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(0x70b080)
      .setFooter("xAtom", client.user.avatarURL)
      .setImage(message.author.avatarURL)
      .setThumbnail(client.user.avatarURL)
      .setTimestamp(new Date())
      .addField("Server Name", message.guild.name)
      .addField("Nickname", member.nickname)
      .addField("Moderator", member.hasPermission("BAN_MEMBERS"))
      .addField("Status", member.presence.status)
    message.channel.send(embed)
    return;
  }
  if(commandIs("botinfo")){
    try {

      //CPU Stuff
      function cpuAverage() {
        var totalIdle = 0,
          totalTick = 0;
        var cpus = os.cpus();

        for (var i = 0, len = cpus.length; i < len; i++) {
          var cpu = cpus[i];
          for (type in cpu.times) {
            totalTick += cpu.times[type];
          }
          totalIdle += cpu.times.idle;
        }
        return {
          idle: totalIdle / cpus.length,
          total: totalTick / cpus.length
        };
      }

      var startMeasure = cpuAverage();

      setTimeout(function() {
          var endMeasure = cpuAverage();
          var idleDifference = endMeasure.idle - startMeasure.idle;
          var totalDifference = endMeasure.total - startMeasure.total;
          var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
          //CPU STUFF OVER

          var botMembers = 0
          for (var i = 0; i < client.guilds.array().length; i++) {
            botMembers = botMembers + client.guilds.array()[i].memberCount
          }

          //HHMMSS
          String.prototype.toHHMMSS = function() {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) {
              hours = "0" + hours;
            }
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            var time = hours + ':' + minutes + ':' + seconds;
            return time;
          }
          //

          const rich = new Discord.RichEmbed()
            .setTitle("Server Internal Status")
            .setDescription("Shows you the internal specification of the server's status")
            .setColor(0xd38cff)
            .setThumbnail("https://nodejs.org/static/images/logo-hexagon.png")
            .setTimestamp(new Date())
            .setFooter("xAtom BETA", client.user.avatarURL, true)
            .addField("CPU Percentage", `${percentageCPU}%`, true)
            .addField("RAM Usage", `${Math.round(process.memoryUsage().heapUsed/ 1024 / 1024 * 100) / 100} MB`, true)
            .addField("Uptime", `${process.uptime().toString().toHHMMSS()}`, true)
            .addField("Servers", client.guilds.array().length, true)
            .addField("Users", botMembers, true)
            .addField("Bot Version", `V1`, true)

          message.channel.send(rich);

        },
        100);
      return;
    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }
//Serverinfo command
if(commandIs("serverinfo")){
  try {
    let guild = message.guild

    const embed = new Discord.RichEmbed()
      .setDescription("Description and information about this server")
      .setColor(0x70b080)
      .setThumbnail(guild.iconURL)
      .setTimestamp(new Date())
      .addField("Name", guild.name, true)
      .addField("ID", guild.id, true)
      .addField("Owner", guild.owner.user.tag, true)
      .addField("Region", guild.region, true)

      .addField("Verification Level", guild.verificationLevel, true)
      .addField("Channels", guild.channels.array().length, true)
      .addField("Members", guild.memberCount, true)
      .addField("Creation Date", guild.createdAt, true)

    message.channel.send(embed)
    return;
  } catch (err) {
    console.log(err);
    message.channel.send(ess.errorHandle(err));
  }

}
//Help commandIs

  if (commandIs("help")) {
    const embed = new Discord.RichEmbed()
      .setTitle("Commands List for xAtom")
      .setDescription(`All the commands provided for the release version of xAtom. Default prefix is ${prefix}`)
      .setColor(0x70b080)
      .addField("nick", "change nick name that you setted")
      .addField("help", "This help panel")
      .addField("ping", "Shows ping (message round trip) of the bot")
      .addField("userinfo", "Information about user in the server")
      .addField("verify", "Gives you a verified role (smart-automatic detection)")
      .addField("creators", "Credits for the bot")
      .addField("purge", "Delete a bulk load of messages (100 max)")
      .addField("ban", "Bans a member from the server")
      .addField("unban", "Unbans the member from the server")
      .addField("kick", "Kicks a member from the server")
      .addField("warn", "It will warn the people who you tagged")
      .addField("translate", "It will any language to English")
      .addField("mute", "Make user not allowed to talk")
      .addField("unmute", "Make user allowed to talk")
      .addField("serverinfo", "Gives all of the information of the server")
      .addField("botinfo", "Shows CPU, RAM, Guild number and more")
      .addField("membercount", "Server user count")
      .setFooter("xAtom BETA", client.user.avatarURL)
      .setThumbnail(client.user.avatarURL)

    message.channel.send(embed);
  }

  if (commandIs("creator")) {
    const embed = new Discord.RichEmbed()
      .setTitle("Creators of xAtom")
      .setDescription("People who made bot xAtom successful and become better than anything before.")
      .setColor(0x70b080)
      .addField("Creator", "UK_0PERAT0R")
      .addField("Developers", "UK_0PERAT0R")
      .addField("GFX Artists", "UK_0PERAT0R")
      .setFooter("xAtom BETA", client.user.avatarURL)
      .setThumbnail(client.user.avatarURL)

    message.channel.send(embed);
  }

if(commandIs("admin call")){
  const embed = new Discord.RichEmbed()
    .setTitle("xAtom BETA")
    .setDescription("Admin call")
    .setColor(0x70b080)
    .addField("Called admin")
    .setFooter("xAtom", client.user.avatarURL)
    .setThumbnail(client.user.avatarURL)
  message.channel.send(embed);
  const me = client.users.get('256397101397704704');

  message.channel.createInvite().then(invite => {
       me.send(invite.url);
  });





}

  if (commandIs("purge")) {
    try {
      if (!Number(message.content.split(" ")[1])) {
        message.channel.send("Please provide numbers to delete")
        return;
      }
      let deleteCount = parseInt(message.content.split(" ")[1])
      if (deleteCount > 99) {
        message.channel.send("Max is 100, Please reenter the amount");
        return;
      }

      message.channel.fetchMessages({
        limit: deleteCount + 1
      }).then(messages => message.channel.bulkDelete(messages));
      message.channel.send("Cleared").then(msg => msg.delete())


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }
  if(commandIs("warn")){

    try {
      let member = message.mentions.members.first();
      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }
      if (!member.kickable) {
        message.channel.send("I cannot warn this user. Please check permissions.");
        return;
      }

      let reason = message.content.split(" ").slice(2).join(" ")
      if (!reason) {
        message.channel.send("Please indicate a reason for the warn!");
        return;
      }

      member.send(`You have been warned for ${reason}`)
      message.channel.send(`${member.user.tag} has been warned by ${message.author.tag} of the reason that ${reason}`);
      return;


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }
  //this


    // Play function


  //this
if(commandIs("translate")){
  if (!message.content.split(" ")[1]) {
    message.channel.send("You need to provide a sentence first!")
    return;
  }
  translate(message.content.split(" ").slice(1).toString(), {
    from: 'auto',
    to: 'en'
  }).then(res => {
    console.log(res.text);
    message.channel.send(`
      From ${isoConv(res.from.language.iso)} to English
      `)
    message.channel.send(res.text);
    return;
  }).catch(err => {
    message.channel.send(ess.errorHandle(err));
  });
}
  if (commandIs("kick")) {
    try {
      let member = message.mentions.members.first();
      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }
      if (!member.kickable) {
        message.channel.send("I cannot kick this user. Please check permissions.");
        return;
      }

      let reason = message.content.split(" ").slice(2).join(" ")
      if (!reason) {
        message.channel.send("Please indicate a reason for the kick!");
        return;
      }

      member.kick(reason)
      message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} of the reason that ${reason}`);
      return;


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }
  if (message.content.startsWith("!ban")) {
    try {
      let member = message.mentions.members.first();
      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }
      if (!member.bannable) {
        message.channel.send("I cannot ban this user. Please check permissions.");
        return;
      }

      let reason = message.content.split(" ").slice(2).join(" ")
      if (!reason) {
        message.channel.send("Please indicate a reason for the ban!");
        return;
      }

      member.send(`You are banned `).then(member.ban(reason))
      message.channel.send(`${member.user.tag} has been baned by ${message.author.tag} of the reason that ${reason}`);
      return;


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }
    if (message.content.startsWith("!updates")) {
      message.channel.send("Forward updates: !tagme, !mute, !unmute, autorole")
    }
if(commandIs("unban")){
  try {

    let userid = message.content.split(" ").slice(1).join(" ")
    if (!userid) {
      message.channel.send("Please use an ID of the user to unban.");
      return;
    }

    message.guild.unban(userid)
    message.channel.send(`<@357479079378681857> has been unbaned by ${message.author.tag}. Lets go to mars to bring my boy back home`);
    return;


  } catch (err) {
    message.channel.send(ess.errorHandle(err));
  }
}
if(commandIs("unmute")){
  try {
      let role = message.guild.roles.find("name", "Muted");
      let member = message.mentions.members.first();
      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }

      member.removeRole(role).catch(e => e)
      member.setMute(false)
      message.channel.permissionOverwrites.get(member.id).delete()
      message.channel.send("Unmuted User!")
      return;
    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
}
if (commandIs("verify")) {
  let role = message.guild.roles.find("name", "Verified");
  if (!role) {
    message.guild.createRole({
      name: 'Verified',
      color: 'GREEN',
    })
  }
  message.guild.member(message.author).addRole(role)
  message.author.sendMessage("You are verified")
  message.delete(1000);
  return;
}


})


client.login(process.env.config.token);
