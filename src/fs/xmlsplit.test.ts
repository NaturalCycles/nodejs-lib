import { XmlSplitPattern, _xmlSplit } from './xmlsplit'

test('xmlsplit', async () => {
  const xml = '<a><b c="x">X</b><b c="y">Y</b><b c="yy">YY</b></a>'
  const splitPatterns: XmlSplitPattern[] = [
    { key: 'x', regex: /x/ },
    { key: 'y', regex: /y/ },
  ]
  const res = await _xmlSplit(xml, '//b', splitPatterns)
  expect(res.length).toEqual(2)
  expect(res).toMatchSnapshot()
})
