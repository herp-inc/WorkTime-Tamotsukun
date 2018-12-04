const { WebClient, RTMClient } = require('@slack/client')
const { worker, rest } = require('./src/worker')
const { ts2date, PostWrapper } = require('./src/utils')

const token = process.env.SLACK_WTT_TOKEN
const rtm = new RTMClient(token)
const web = new WebClient(token)

const { warn, ok } = PostWrapper(web)

rtm.start()

rtm.on('connected', () => {
  console.log('connected to slack')
})

rtm.on('message', msg => {
  const time = ts2date(msg.ts)

  if (/:(rodo|work):\s*[を]?\s*:(kaisi|start):/.test(msg.text)) {
    if (!worker.filterK(msg.user, _ => warn.AlreadyWorking(msg.channel))) {
      console.log(`${msg.user} has started to work at ${msg.channel}`)
      worker.init(msg.user, time)
      ok.workStart(msg.channel)
    }
  } else if (/:(rodo|work):\s*[はをも]?\s*:s[hy]uryo:/.test(msg.text)) {
    if (
      !worker.filterK(msg.user, info => {
        if (!rest.isStopped(info)) {
          warn.NotStop(msg.channel)
        } else {
          ok.workStopK(msg.user, info, time, msg0 => {
            console.log(`${msg.user} has completed to work at ${msg.channel}`)
            msg0(msg.channel).then(() => worker.deinit(msg.user))
          })
        }
      })
    ) {
      warn.NoWork(msg.channel)
    }
  } else if (/:(kyuke|rest):\s*:(kaisi|start)/.test(msg.text)) {
    if (
      !worker.filterK(msg.user, info => {
        console.log(`${msg.user} began taking a break at ${msg.channel}`)
        rest.pushStart(info, time)

        ok.restStart(msg.channel)
      })
    ) {
      warn.NoWork(msg.channel)
    }
  } else if (/:(kyuke|rest):\s*:s[hy]uryo:/.test(msg.text)) {
    if (
      !worker.filterK(msg.user, info => {
        if (rest.isStarted(info)) {
          console.log(`${msg.user} finished the break at ${msg.channel}`)
          rest.pushStop(info, time)

          ok.restStop(msg.channel)
        } else {
          warn.NoRest(msg.channel)
        }
      })
    ) {
      warn.NoWork(msg.channel)
    }
  }
})
