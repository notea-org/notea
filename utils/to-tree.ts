export const toTree = (data: Record<string, any>[]) => {
  const idMapping = data.reduce((acc, el, i) => {
    acc[el.id] = i
    return acc
  }, {})
  let root

  data.forEach((el) => {
    // Handle the root element
    if (el.pid === null) {
      root = el
      return
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = data[idMapping[el.pid]]
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el]
  })

  return root
}
