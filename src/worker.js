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

const last = ln => ln[ln.length - 1]

rest.pushStart = (info, time) => {
  info.restTime.push([time])
}

rest.pushStop = (info, time) => {
  last(info.restTime).push(time)
}

rest.isStarted = info =>
  info.restTime.length > 0 && last(info.restTime).length === 1

rest.isStopped = info =>
  info.restTime.length == 0 || last(info.restTime).length === 2

module.exports = { worker, rest }
