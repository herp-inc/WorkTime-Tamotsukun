const zpd = d => d.toString().padStart(2, '0')
const renderTime = date => `${zpd(date.getHours())}:${zpd(date.getMinutes())}`

const ts2date = ts => new Date(parseInt(ts) * 10 ** 3)

const PostWrapper = web => {
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

  const post = text => channel =>
    web.chat.postMessage({
      channel: channel,
      text,
    })

  return {
    warn: {
      work: {
        alreadyStart: post('労働はすでに始まっている'),
        notStart: post('労働開始してへんで'),
      },
      rest: {
        alreadyStart: post('休憩中やで'),
        notStart: post('休憩開始してへんで'),
        notStop: post('休憩まだ続いてるで'),
      },
    },
    ok: {
      work: {
        start: post('労働開始了解!!'),
        stopK: (id, info, time, k) => {
          return k(
            post(
              `<@${id}>さん 労働お疲れ様でした` +
                `\n開始: ${renderTime(info.startTime)}` +
                `\n終了: ${renderTime(time)}` +
                `\n休憩時間:${renderRestTimes(info)}`,
            ),
          )
        },
      },
      rest: {
        start: post('休憩開始了解!!'),
        stop: post('休憩終了了解!!'),
      },
    },
  }
}

module.exports = {
  ts2date,
  PostWrapper,
}
