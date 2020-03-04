const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");


//Discord機器人Token
const DISCORD_TOKEN = "NjUzMjAwOTk3MjYyMjk1MDQw.Xl9zTg.cdKgqDSUYaOoDDCAi2pk8EnUCz8";
//到Hypixel大廳打 /api new 取得
const HYPIXEL_API = "99805bc5-3cdd-4b7c-a800-fe7073ecf4fa";

const PREFIX = "ul!";
const CMD = "guild";
//狀態刷新秒數 不要設定低於0.5秒
const TIME = 5;


client.on('ready', () => {
  console.log("啟動成功");
  client.user.setGame('ul!guild Messter|創作者:UL#1188')
})

client.on('message', async msg => {
  let args = msg.content.split(" ").slice(1);
  if(msg.content.startsWith(PREFIX + CMD)) {
    let sendingemb = new Discord.RichEmbed()
      .setTitle("搜尋中...");
    let sending = await msg.channel.send(sendingemb);
    if(!args[0]) {
        let noarg = new Discord.RichEmbed()
          .setTitle("請輸入你的名字")
          .setDescription(`範例\n\`${PREFIX}${CMD} Messter\``);
        return sending.edit(noarg);
    }
    request({method:'GET', url:`https://api.hypixel.net/player?key=${HYPIXEL_API}&name=${args[0]}`, json:true}, (err,res,data) => {
        if(data.player == null) {
          let error = new Discord.RichEmbed()
            .setTitle("錯誤的名字")
            .setDescription(`範例\n\`${PREFIX}${CMD} Messter2\``);
            return sending.edit(error);
        }
        request({method:'GET', url:`https://api.hypixel.net/findGuild?key=${HYPIXEL_API}&byUuid=${data.player.uuid}`, json:true}, (err,res,data1) => {
          if(!data1.success) {
            let unkown = new Discord.RichEmbed()
              .setTitle("未知的錯誤");
            return sending.edit(unkown);
          }
          if(data1.guild == null) {
            let nullerr = new Discord.RichEmbed()
              .setTitle("錯誤")
              .setDescription("該玩家沒有公會");
            return sending.edit(nullerr);
          }
          request({method:'GET', url:`https://api.hypixel.net/guild?key=${HYPIXEL_API}&id=${data1.guild}`, json:true}, (err,res,data2) => {
            if(!data2.success) {
              let unkown1 = new Discord.RichEmbed()
                .setTitle("未知的錯誤");
              return sending.edit(unkown1);
            }
            let successGuild = new Discord.RichEmbed()
              successGuild.setTitle(`${data.player.displayname} 的公會資訊`)
              successGuild.setColor(getRandomColor())
              successGuild.addField("公會名稱", `\`${data2.guild.name}\``);
            if(data2.guild.description != null) successGuild.addField("簡介", `\`${data2.guild.description}\``);

              if(data2.guild.tagColor != null) successGuild.addField("Tag/顏色", `\`${data2.guild.tag}/${data2.guild.tagColor}\``, true);
              successGuild.addField("成員數量", `\`${data2.guild.members.length}\``, true)
              successGuild.addField("在線玩家", `\`${data2.guild.achievements.ONLINE_PLAYERS}\``, true)
              successGuild.addField("等級", `\`${Math.floor(getLevel(data2.guild.exp))}\``, true)
              successGuild.addField("建立時間", `\`${convert(data2.guild.created)}\``, true)
              successGuild.addField("等級排名", `\`${convert(data2.guild.level)}\``, true)


              if(data2.guild.preferredGames != null) successGuild.addField("首選遊戲", `\`${data2.guild.preferredGames.join(",")}\``);
              successGuild.setTimestamp();
            sending.edit(successGuild)
          })
          setInterval(function(){
          request({method:'GET', url:`https://api.hypixel.net/guild?key=${HYPIXEL_API}&id=${data1.guild}`, json:true}, (err,res,data2) => {
            if(!data2.success) {
              let unkown1 = new Discord.RichEmbed()
                .setTitle("未知的錯誤2");
              return sending.edit(unkown1);
            }

            let successGuild = new Discord.RichEmbed()
              successGuild.setTitle(`${data.player.displayname} 的公會資訊`)
              successGuild.setColor(getRandomColor())
              successGuild.addField("公會名稱", `\`${data2.guild.name}\``);
            if(data2.guild.description != null) successGuild.addField("簡介", `\`${data2.guild.description}\``);

              if(data2.guild.tagColor != null) successGuild.addField("Tag/顏色", `\`${data2.guild.tag}/${data2.guild.tagColor}\``, true);
              successGuild.addField("成員數量", `\`${data2.guild.members.length}\``, true)
              successGuild.addField("在線玩家", `\`${data2.guild.achievements.ONLINE_PLAYERS}\``, true)
              successGuild.addField("等級", `\`${Math.floor(getLevel(data2.guild.exp))}\``, true)
              successGuild.addField("建立時間", `\`${convert(data2.guild.created)}\``, true)





              if(data2.guild.preferredGames != null) successGuild.addField("首選遊戲", `\`${data2.guild.preferredGames.join(",")}\``);
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
    return "是";
  }
  if(!bool) {
    return "否";
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
var months_arr = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
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
return `${year}年 ${month} ${day}日 ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}

if(TIME < 0.5) {
  console.error("時間不能設定低於0.5秒會超過Hypixel API限制");

}



