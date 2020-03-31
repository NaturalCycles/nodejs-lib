test('should not leak', () => {
  require('.')
  require('./script')
  require('./colors')
  require('./exec')
})
