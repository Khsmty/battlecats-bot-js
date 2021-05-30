// const iab = require('../../modules/button.js')
/* const { Client, Intents } = require('discord.js')
const bot = new Client({ intents: Intents.ALL }) */

module.exports = {
  name: 'approve',
  description: '新規ユーザーを承認します。(モデレーターのみ)',
  modOnly: true,
  async execute (message) {
    /* if (!message.mentions.users.size) {
      return message.reply('承認するユーザーを指定してください。')
    } */

    // const taggedUser = message.mentions.users.first()

    // message.channel.send(`You wanted to kick: ${taggedUser.username}`)

  }
}
