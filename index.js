const Discord = require('discord.js');
const fs = require('fs'); // file-system reader
const client = new Discord.Client();
const TOKEN = `${process.env.DJS_TOKEN}`; // private token on Heroku

client.once('ready', () => {
  console.log('Ready to dance mofo! 😎😎');
});

client.login(TOKEN);

client.on('message', onMessage);

const soundsList = fs.readdirSync('./audio');

async function onMessage (message) {
  console.log(`👉🏼 ${message.content}`);

  // play a user's requested sound 
    if (message.member.voice.channel && message.content.startsWith(';')) {
      const usrMsg = message.content.replace(';', '');
      const connection = await message.member.voice.channel.join();

      const dispatcher = connection.play(`./audio/${usrMsg}.mp3`);

      dispatcher.on('start', () => {
        console.log(`${usrMsg} is now playing! 🎷`);
        message.delete({ timeout: 5000 });
      });

      dispatcher.on('finish', () => {
        console.log(`${usrMsg} has finished playing! 🎬`);
      });

      dispatcher.on('error', (err) => {
        console.log(`${usrMsg} error 💣`, err);
        connection.disconnect();
      });

    // send a private message with list of sounds available
    if (message.member.voice.channel && message.content === ';help') {
      const user = message.author;
      const list = [];

      soundsList.forEach((sound) => {
        list.push(sound.replace('.mp3', ''));
      });

        user.send(list.join('\n;'));
    }

    // randomly play a sound
    if (message.member.voice.channel && message.content === ';rdm') {
      // const connection = await message.member.voice.channel.join();
      
      // const randomSoundIndex = Math.floor(Math.random() * soundsList.length);
      // const randomSound = soundsList[randomSoundIndex];
      const randFile = soundsList[Math.floor(Math.random() * soundsList.length)]

      const dispatcher = connection.play(`./audio/${randFile}`);

      dispatcher.on('start', () => {
        console.log(`${randFile} is randomly playing! 🐙`);
        message.delete({ timeout: 5000 });
      });

      dispatcher.on('finish', () => {
        console.log(`${randFile} has finished playing randomly! 🦑`);
      });

      dispatcher.on('error', (err) => {
        console.log(`${randFile} error 💣`, err);
        connection.disconnect();
      });
    }
  }
}