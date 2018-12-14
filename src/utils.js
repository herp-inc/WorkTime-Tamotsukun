const zpd = d => d.toString().padStart(2, '0')
const renderTime = date => `${zpd(date.getHours())}:${zpd(date.getMinutes())}`

const ts2date = ts => new Date(parseInt(ts) * 10 ** 3)
const renderRestTimes = info => {
  let ret = ' なし'

  if (info.restTime.length > 0) {
    ret =
      '\n' +
      info.restTime
        .map(times => `- ${renderTime(times[0])} ~ ${renderTime(times[1])}`)
        .join('\n')
  }

  return ret
}

class PostWrapper {
  __post(text) {
    return channel =>
      this.web.chat.postMessage({
        channel: channel,
        text,
      })
  }

  constructor(web) {
    this.web = web

    this.warn = {
      work: {
        alreadyStart: this.__post('労働はすでに始まっている'),
        notStart: this.__post('労働開始してへんで'),
      },
      rest: {
        alreadyStart: this.__post('休憩中やで'),
        notStart: this.__post('休憩開始してへんで'),
        notStop: this.__post('休憩まだ続いてるで'),
      },
    }

    this.ok = {
      work: {
        start: this.__post('労働開始了解!!'),
        stopK: (id, info, time, k) => {
          return k(
            this.__post(
              `<@${id}>さん 労働お疲れ様でした` +
                `\n開始: ${renderTime(info.startTime)}` +
                `\n終了: ${renderTime(time)}` +
                `\n休憩時間:${renderRestTimes(info)}`,
            ),
          )
        },
      },
      rest: {
        start: this.__post('休憩開始了解!!'),
        stop: this.__post('休憩終了了解!!'),
      },
    }
  }
}

module.exports = {
  ts2date,
  PostWrapper,
}
