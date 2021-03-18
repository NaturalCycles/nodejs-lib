import { XmlSplitPattern, _xmlSplit } from './xmlsplit'

test('xmlsplit basic test', async () => {
  const xml = '<a><b c="x">X</b><b c="y">Y</b><b c="yy">YY</b></a>'
  const splitPatterns: XmlSplitPattern[] = [
    { key: 'x', regex: /x/ },
    { key: 'y', regex: /y/ },
  ]
  const res = await _xmlSplit(xml, '//b', splitPatterns)
  expect(res.length).toEqual(2)
  expect(res).toMatchSnapshot()
})

test('xmlsplit inverse test', async () => {
  const xml = '<a><b c="x">X</b></a>'
  const splitPatterns: XmlSplitPattern[] = [{ key: 'x', regex: /x/, inverse: true }]
  const res = await _xmlSplit(xml, '//b', splitPatterns)
  expect(res.length).toEqual(0)
})

test('xmlsplit test in different attributes', async () => {
  // Make sure x is found in second attribute d
  const xml = '<a><b c="x">X</b><b c="y" d="x">X</b><b x="y"></b></a>'
  const splitPatterns: XmlSplitPattern[] = [{ key: 'x', regex: /x/ }]
  const res = await _xmlSplit(xml, '//b', splitPatterns)

  expect(res.length).toEqual(1)
  expect(res[0]!.xml.includes('d=')).toBe(true)
  expect(res[0]!.xml.includes('x=')).toBe(false) // Make sure x="y" is not picked up
})
