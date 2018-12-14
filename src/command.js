const { worker, rest } = require('./worker')
const { PostWrapper } = require('./utils')

const zpd = d => d.toString().padStart(2, '0')
const renderTime = date => `${zpd(date.getHours())}:${zpd(date.getMinutes())}`

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }

  return array
}

const renderRestTimes = info => {
  let ret = ' なし'

  if (info.restTime.length > 0) {
    ret =
      '\n' +
      info.restTime
        .map(times => {
          if (times[1]) {
            return `- ${renderTime(times[0])} ~ ${renderTime(times[1])}`
          } else {
            return `- ${renderTime(times[0])} ~ now`
          }
        })
        .join('\n')
  }

  return ret
}

const renderStatus = (id, info) =>
  `<@${id}>さんの現在のステータス` +
  `\n開始: ${renderTime(info.startTime)}` +
  `\n休憩時間:${renderRestTimes(info)}`

exports.Command = class {
  constructor(web, worker) {
    this.web = web
    this.worker = worker
    this.post = new PostWrapper(web)
    this.warn = this.post.warn
    this.ok = this.post.ok
  }

  handle(cmd) {
    if (/^stat(u(s?))?$/.test(cmd)) {
      return msg => {
        if (
          !worker.filterK(msg.user, info =>
            this.web.chat.postMessage({
              channel: msg.channel,
              text: renderStatus(msg.user, info),
            }),
          )
        )
          this.warn.work.notStart(msg.channel)
      }
    } else if (/^shuf(f(l(e?))?)?$/.test(cmd)) {
      return (msg, args) =>
        this.web.chat.postMessage({
          channel: msg.channel,
          text: shuffle(args).join(' '),
        })
    }
    // default
    else {
      return () => {
        web.chat.postMessage({
          channel: msg.channel,
          text: `invalid command: ${cmd}`,
        })
      }
    }
  }
}
