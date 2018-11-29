const axios = require('axios')
const moment = require('moment')

module.exports = (object) => {
  if (!object || !object.reports || !object.reports.data || object.reports.data.length === 0) return

  const attachments = object.reports.data.map((e, index) => {
    return {
      fallback: 'king tasks',
      color: "#03A9F4",
      "fields": [{
        "title": `${e.deadlines}`,
        "value": `${e.text} @from ${e.date}`,
        "mrkdwn_in": [
          "text"
        ]
      }]
    }
  })

  axios.post(process.env.SLACK_HOOK_URL, {
    'channel': '#' + process.env.SLACK_CHANNEL,
    'username': 'KingTaskManager',
    'icon_emoji': ':robot_face:',
    'text': `*${moment().format('YYYY/MM/DD HH:mm:ss')}* 取得`,
    "attachments": attachments
  })
  console.log(`${moment().format('YYYY/MM/DD HH:mm:ss')} 取得`)
}
