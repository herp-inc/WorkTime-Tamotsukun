const { today } = require('../../prim')

const kt = require('axios').create({
  baseURL: 'https://api.kingtime.jp/v1.0/',
  'Content-Type': 'application/json; charset=utf-8',
})

const handle_error = err => ({
  ok: false,
  status: err.response.status,
  message: err.message,
})

exports.token = {
  authorized: async token =>
    await kt
      .get(`/tokens/${token}/available`)
      .then(res => {
        if (res.data.available) {
          kt.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        return res.data.available
      })
      .catch(handle_error),
}

exports.time = {
  record: async (employeeKey, data) =>
    await kt
      .post(`/daily-workings/timerecord/${employeeKey}`, data)
      .then(() => ({ ok: true }))
      .catch(handle_error),

  get: async (division, date = today()) =>
    await kt
      .post(`/daily-workings/timerecord/${date}?division=${division}`)
      .then(res => ({ ok: true, data: res.data }))
      .catch(handle_error),
}
