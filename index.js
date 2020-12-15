const Discord = require("discord.js")
const ayarlar = require("./merziki.json")
const db = require("quick.db")
const fs = require("fs");
const client = new Discord.Client({
  fetchAllMembers: true,
  partials: ["MESSAGE", "USER", "REACTION"]
});
const oynuyor = ('Youtube Merziki')

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Her hangi bir komut bulamadım");
    return;
  }
  jsfile.forEach(f => {
    let props = require(`./komutlar/${f}`);
    console.log(`Yüklenen Komut: ${f}`);
    client.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
fs.readdir("./events/", (err, files) => {
  if (err) console.log(err);

  let jsfile1 = files.filter(f => f.split(".").pop() === "js");
  if (jsfile1.length <= 0) {
    console.log("Herhangi bir event bulamadım");
    return;
  }
  jsfile1.forEach(f => {
    const eventName = f.split(".")[0];
    console.log(`Yüklenen Event: ${eventName}`);
    const event = require(`./events/${f}`);

    client.on(eventName, event.bind(null, client));
  });
});




client.on("ready", async () => {
  client.appInfo = await client.fetchApplication();
  setInterval(async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);
console.log('Bot Aktif');

  client.user.setStatus("oynuyor");
  client.user.setActivity(oynuyor, { type: "STREAMING", url: "https://twitch.tv/merziki" });

});


console.log("Youtube Merziki")


client.login(ayarlar.token);
