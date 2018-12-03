let dict = {}

let worker = {}

worker.filterK = (id, k) => {
  if (dict[id] !== undefined) {
    k(dict[id])
    return true
  } else {
    return false
  }
}

worker.init = (id, time) => (dict[id] = { startTime: time, restTime: [] })
worker.deinit = id => delete dict[id]

let rest = {}

rest.pushStart = (info, time) => {
  info.restTime[info.restTime.length] = [time]
}

rest.pushStop = (info, time) => {
  info.restTime[info.restTime.length - 1].push(time)
}

const last = ln => ln[ln.length - 1]

rest.isStarted = info =>
  info.restTime.length > 0 && last(info.restTime).length === 1

rest.isStopped = info =>
  info.restTime.length == 0 || last(info.restTime).length === 2

module.exports = { worker, rest }
