module.exports = {
  name: 'close',
  async execute (message) {
    if (message.channel.parentID !== '712220796449456238') return

    const qUser = message.channel.topic.replace(/<@!|> の質問/, '')
    const modUser = [qUser, '612599805310402561', '418670054574391316', '723052392911863858', '682838384909090841']

    if (!modUser.includes(message.author.id)) return

    message.channel.edit({ parentID: '712222487798349845' })

    message.react('✅')
  }
}
