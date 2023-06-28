test('should not leak', () => {
  require('.')
  require('./script')
  require('./colors')
})

export {}
