module.exports = {
  extractTemplateProps: (data = '') => {
    let match = data.match(/<jungledrum>([\s\S]+)<\/jungledrum>/)
    if (match) {
      let raw = match[1]
      try { return JSON.parse(raw) } catch (e) { return {} }
    }
    return {}
  }
}
