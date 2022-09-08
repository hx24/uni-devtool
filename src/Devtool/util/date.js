export function getTime (timestamp) {
  const fix = num => {
    return num < 10 ? '0' + num : num
  }
  const date = timestamp ? new Date(timestamp) : new Date()
  const time = `${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(
    date.getSeconds()
  )}`
  return time
}
