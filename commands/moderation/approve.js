module.exports = {
  name: 'approve',
  modOnly: true,
  async execute (message) {
    if (!message.mentions.users.size) return message.reply('承認するユーザーを指定してください。')

    const User = message.mentions.users.first()
    const taggedUser = await message.guild.members.fetch(User.id)

    if (taggedUser.roles.cache.has('848586257365336115')) return message.reply('このユーザーは承認済みです。')

    taggedUser.roles.remove('848586319084519434')
    taggedUser.roles.add('848586257365336115')

    message.reply(`**${taggedUser.user.tag}** さんを承認しました。`)
  }
}
