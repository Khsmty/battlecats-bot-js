const http = require('http')
http
  .createServer(function (req, res) {
    res.write('OK')
    res.end()
  })
  .listen(8080)

const fs = require('fs')
const Discord = require('discord.js')

const prefix = '.'

const client = new Discord.Client({ intents: Discord.Intents.ALL })
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

const commandFolders = fs.readdirSync('./commands')

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`)
    client.commands.set(command.name, command)
  }
}

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', async message => {
  if (message.channel.id === '712220900878975076' && !message.author.bot) {
    const boardMsg = await message.reply('チャンネルを作成しています...')
    const newChannel = await message.guild.channels.create(message.content, {
      parent: '712220796449456238',
      topic: `<@!${message.author.id}> の質問`
    })
    newChannel.send(
      new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(message.content)
        .setColor('#5865F2')
        .setFooter('解決したら .close と送信')
    )
    boardMsg.edit(null,
      new Discord.MessageEmbed()
        .setTitle('✅ 作成しました')
        .setDescription(`チャンネルを作成しました。\n<#${newChannel.id}>`)
        .setColor('#00B06B')
    )
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(/ +|　+/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command || !message.guild) return

  const modUser = ['612599805310402561', '418670054574391316', '723052392911863858', '682838384909090841']

  if (command.modOnly === true) {
    if (!modUser.includes(message.author.id)) return message.reply('使用権限がありません。')
  }

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
  }
})

client.login(process.env.TOKEN)
