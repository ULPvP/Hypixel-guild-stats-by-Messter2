const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");


//Discord機器人Token
const DISCORD_TOKEN = process.env.TOKEN
//到Hypixel大廳打 /api new 取得
const HYPIXEL_API = process.env.HYAPI

const PREFIX = "ul!";
const CMD = "guild";
//狀態刷新秒數 不要設定低於0.5秒
const TIME = 5;


client.on('ready', () => {
  console.log("啟動成功");
  client.user.setGame('ul!guild Messter2|By UL#1188')
})

client.on('message', async msg => {
  let args = msg.content.split(" ").slice(1);
  if(msg.content.startsWith(PREFIX + CMD)) {
    let sendingemb = new Discord.RichEmbed()
      .setTitle("Searching...");
    let sending = await msg.channel.send(sendingemb);
    if(!args[0]) {
        let noarg = new Discord.RichEmbed()
          .setTitle("Please Enter Your IGN")
          .setDescription(`Example\n\`${PREFIX}${CMD} Messter2\``);
        return sending.edit(noarg);
    }
    request({method:'GET', url:`https://api.hypixel.net/player?key=${HYPIXEL_API}&name=${args[0]}`, json:true}, (err,res,data) => {
        if(data.player == null) {
          let error = new Discord.RichEmbed()
            .setTitle("You've entered a wrong IGN")
            .setDescription(`Example\n\`${PREFIX}${CMD} Messter2\``);
            return sending.edit(error);
        }
        request({method:'GET', url:`https://api.hypixel.net/findGuild?key=${HYPIXEL_API}&byUuid=${data.player.uuid}`, json:true}, (err,res,data1) => {
          if(!data1.success) {
            let unkown = new Discord.RichEmbed()
              .setTitle("Unknown Error");
            return sending.edit(unkown);
          }
          if(data1.guild == null) {
            let nullerr = new Discord.RichEmbed()
              .setTitle("Erroe")
              .setDescription("The player you've entered haven't join any hypixel guild.");
            return sending.edit(nullerr);
          }
          request({method:'GET', url:`https://api.hypixel.net/guild?key=${HYPIXEL_API}&id=${data1.guild}`, json:true}, (err,res,data2) => {
            if(!data2.success) {
              let unkown1 = new Discord.RichEmbed()
                .setTitle("Unknown Error");
              return sending.edit(unkown1);
            }
            let successGuild = new Discord.RichEmbed()
              successGuild.setTitle(`${data.player.displayname} 's guild information`)
              successGuild.setColor(getRandomColor())
              successGuild.addField("Guild Name", `\`${data2.guild.name}\``);
            if(data2.guild.description != null) successGuild.addField("Description", `\`${data2.guild.description}\``);

              if(data2.guild.tagColor != null) successGuild.addField("Tag/Color", `\`${data2.guild.tag}/${data2.guild.tagColor}\``, true);
              successGuild.addField("Members", `\`${data2.guild.members.length}\``, true)
              successGuild.addField("Online Player", `\`${data2.guild.achievements.ONLINE_PLAYERS}\``, true)
              successGuild.addField("Level", `\`${Math.floor(getLevel(data2.guild.exp))}\``, true)
              successGuild.addField("Creation Date", `\`${convert(data2.guild.created)}\``, true)
            


              if(data2.guild.preferredGames != null) successGuild.addField("Preferred Games", `\`${data2.guild.preferredGames.join(",")}\``);
              successGuild.setTimestamp();
            sending.edit(successGuild)
          })
          setInterval(function(){
          request({method:'GET', url:`https://api.hypixel.net/guild?key=${HYPIXEL_API}&id=${data1.guild}`, json:true}, (err,res,data2) => {
            if(!data2.success) {
              let unkown1 = new Discord.RichEmbed()
                .setTitle("Unknown Error2");
              return sending.edit(unkown1);
            }

            let successGuild = new Discord.RichEmbed()
              successGuild.setTitle(`${data.player.displayname} 's guild information`)
              successGuild.setColor(getRandomColor())
              successGuild.addField("Guild Name", `\`${data2.guild.name}\``);
            if(data2.guild.description != null) successGuild.addField("Description", `\`${data2.guild.description}\``);

              if(data2.guild.tagColor != null) successGuild.addField("Tag/Color", `\`${data2.guild.tag}/${data2.guild.tagColor}\``, true);
              successGuild.addField("Members", `\`${data2.guild.members.length}\``, true)
              successGuild.addField("Online Players", `\`${data2.guild.achievements.ONLINE_PLAYERS}\``, true)
              successGuild.addField("Level", `\`${Math.floor(getLevel(data2.guild.exp))}\``, true)
              successGuild.addField("Creation Date", `\`${convert(data2.guild.created)}\``, true)





              if(data2.guild.preferredGames != null) successGuild.addField("Preferred Games", `\`${data2.guild.preferredGames.join(",")}\``);
              successGuild.setTimestamp();
            sending.edit(successGuild)
          })
        }, TIME*1000);
})
    })
  }
})

function boolToString(bool) {
  if(bool) {
    return "Yes";
  }
  if(!bool) {
    return "No";
  }
}

function getLevel(exp) {
  const EXP_NEEDED = [
    100000,
    150000,
    250000,
    500000,
    750000,
    1000000,
    1250000,
    1500000,
    2000000,
    2500000,
    2500000,
    2500000,
    2500000,
    2500000,
    3000000,
  ];

  let level = 0;

  // Increments by one from zero to the level cap
  for (let i = 0; i <= 100; i += 1) {
    // need is the required exp to get to the next level
    let need = 0;
    if (i >= EXP_NEEDED.length) {
      need = EXP_NEEDED[EXP_NEEDED.length - 1];
    } else { need = EXP_NEEDED[i]; }

    // If the required exp to get to the next level isn't met returns
    // the current level plus progress towards the next (unused exp/need)
    // Otherwise increments the level and substracts the used exp from exp var
    if ((exp - need) < 0) {
      return Math.round((level + (exp / need)) * 100) / 100;
    }
    level += 1;
    exp -= need;
  }

  // Returns the level cap - currently 100
  // If changed here, also change in for loop above
  return 100;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function convert(unix){
// Unixtimestamp
var unixtimestamp = unix;
// Months array
var months_arr = ['January','February','March ','April','May','June','July','August','September','October','November','December'];
// Convert timestamp to milliseconds
var date = new Date(unixtimestamp);
// Year
var year = date.getFullYear();
// Month
var month = months_arr[date.getMonth()];
// Day
var day = date.getDate();
// Hours
var hours = date.getHours();
// Minutes
var minutes = "0" + date.getMinutes();
// Seconds
var seconds = "0" + date.getSeconds();
// Display date time in MM-dd-yyyy h:m:s format
return `${year} ${month} ${day} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}

if(TIME < 0.5) {
  console.error("Time cannot set under 0.5seconds otherwise,it will reached Hypixel API limited");

}
client.login(DISCORD_TOKEN)


