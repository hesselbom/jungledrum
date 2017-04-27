export function objSwitch (value, obj) {
  return obj[value] || obj['default']
}

export function setJsonPath (obj, path, value) {
  let o = {...obj}
  let current = o
  let parts = path.split(',')

  parts.forEach((part, i) => {
    if (i === parts.length - 1) {
      current[part] = value
      return
    }

    if (typeof current[part] === 'string') current[part] = JSON.parse(current[part])
    if (!current[part]) current[part] = {}
    current = current[part]
  })

  return o
}
