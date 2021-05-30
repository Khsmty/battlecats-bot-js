module.exports = {
  name: 'delete',
  modOnly: true,
  async execute (message) {
    if (message.channel.parentID !== '712222487798349845') return

    message.channel.delete()
  }
}
