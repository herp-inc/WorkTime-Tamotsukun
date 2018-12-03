const zpd = d => d.toString().padStart(2, '0')
const renderTime = date => `${zpd(date.getHours())}:${zpd(date.getMinutes())}`

const ts2date = ts => new Date(parseInt(ts) * 10 ** 3)

const PostWrapper = (web, worker) => {
  const renderRestTimes = id => {
    let ret = ' 休憩してない'

    worker.filterK(id, info => {
      if (info.restTime.length > 0) {
        ret =
          '\n' +
          info.restTime
            .map(times => `- ${renderTime(times[0])} ~ ${renderTime(times[1])}`)
            .join('\n')
      }
    })

    return ret
  }

  const usersP = web.users.list()

  const post = text => channel =>
    web.chat.postMessage({
      channel: channel,
      text,
    })

  return {
    warn: {
      AlreadyWorking: post('労働はすでに始まっている'),
      NoWork: post('労働開始してへんで'),
      NoRest: post('休憩開始してへんで'),
      NotStop: post('休憩まだ続いてるで'),
    },
    ok: {
      workStart: post('労働開始了解!!'),
      restStart: post('休憩開始了解!!'),
      restStop: post('休憩終了了解!!'),
      workStopK: (id, info, time) => k =>
        Promise.race([
          usersP,
          new Promise(resolve =>
            setTimeout(
              () => resolve({ members: [{ id, name: `(${id})` }] }),
              5 * 10 ** 3,
            ),
          ),
        ]).then(res => {
          const users = res.members
          const name = users.find(user => user.id === id).name
          return k(
            post(
              `${name}さん 労働お疲れ様でした` +
                `\n開始: ${renderTime(info.startTime)}` +
                `\n終了: ${renderTime(time)}` +
                `\n休憩時間:${renderRestTimes(id)}`,
            ),
          )
        }),
    },
  }
}

module.exports = {
  ts2date,
  PostWrapper,
}
