test('should not leak', () => {
  require('.')
  require('./colors')
  require('./exec')
})
