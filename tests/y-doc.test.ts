import { mergeUpdates, mergeUpdatesToLimit } from 'libs/shared/y-doc'

describe('#mergeUpdatesToLimit', () => {
  it('should merge updates to limit', () => {
    expect(mergeUpdatesToLimit(new Array(10).fill('AAA='), 5)).toHaveLength(5)
  })

  it(' should return the same array if there is no need to merge', () => {
    expect(mergeUpdatesToLimit(new Array(5).fill('AAA='), 10)).toHaveLength(5)
  })

  it('should returns an array of strings', () => {
    expect(mergeUpdatesToLimit(new Array(10).fill('AAA='), 5)).toEqual(
      new Array(5).fill('AAA=')
    )
  })
})

describe('#mergeUpdates', () => {
  it('should merge updates', () => {
    expect(mergeUpdates(new Array(10).fill('AAA='))).toEqual('AAA=')
  })
})
