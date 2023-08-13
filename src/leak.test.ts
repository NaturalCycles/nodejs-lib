test('should not leak', () => {
  require('.')
  require('./script/runScript')
  require('./colors/colors')
})

export {}
