const serp = require('serp')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'db',
  async execute (message) {
    const searchword = message.content.slice(4)

    if (!searchword) return message.reply('検索語句を指定してください。')

    const msg = await message.reply('検索中です...')

    const links = await serp.search({
      host: 'google.com',
      qs: {
        q: searchword + 'site:battlecats-db.com',
        filter: 0,
        pws: 0
      },
      num: 3
    })

    const embed = new MessageEmbed()
      .setTitle(`「${searchword}」のデータベース検索結果`)
      .setColor('#B06000')
    links.forEach(link => embed.addField('\u200b', `[${link.title}](https://google.com${link.url})`))
    embed.addField('\u200b', `すべての検索結果は[こちら](https://www.google.com/search?q=${searchword.replace(/ |　/g, '+')})`)
    msg
      .edit(null, embed)
      .catch(e => {
        msg.edit(null,
          new MessageEmbed()
            .setDescription('検索結果が見つかりませんでした...\n検索語句を変えて、再度お試しください。')
            .setColor('#B06000')
        )
      })
  }
}
