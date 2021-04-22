const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = `${process.env.DJS_TOKEN}`;

client.once('ready', () => {
  console.log('Ready!');
});

client.login(TOKEN);

client.on('message', onMessage);

async function onMessage (message) {
  console.log(message.content);

  if (message.member.voice.channel && message.content) {
    const usrMsg = message.content.replace(';', '');
    const connection = await message.member.voice.channel.join();

    const dispatcher = connection.play(`audio/${usrMsg}.mp3`);

    dispatcher.on('start', () => {
      console.log(`${usrMsg} is now playing!`);
      message.delete();
    });

    dispatcher.on('finish', () => {
      console.log(`${usrMsg} has finished playing!`);
    });

    dispatcher.on('error', (err) => {
      console.log(`${usrMsg} error`, err);
      connection.disconnect();
    });
  }
}