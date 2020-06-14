module.exports = {
  ifSelected: (value1, value2) => {
    return (String(value1) === String(value2)) ? 'selected' : ''
  }
}
