export function objSwitch (value, obj) {
  return obj[value] || obj['default']
}
