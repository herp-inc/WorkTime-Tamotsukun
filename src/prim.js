exports.zpd = d => d.toString().padStart(2, '0')

const today = () => {
  const date = new Date()
  return `${date.getFullYear()}-${zpd(date.getMonth() + 1)}-${zpd(
    date.getDate(),
  )}`
}

exports.today = today

