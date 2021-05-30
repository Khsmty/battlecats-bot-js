const fs = require('fs')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')

const client = new Discord.Client({ intents: Discord.Intents.ALL })
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

/*const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
}*/

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

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName) ||
  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command || !message.guild) return

  if (command.modOnly === true) {
    if (message.author.id !== '723052392911863858') return message.reply('使用権限がありません。')
  }

  const { cooldowns } = client

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
  }
})

client.login(token)
