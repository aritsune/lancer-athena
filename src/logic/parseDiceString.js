
export default function parseDiceString (str) {
  const splitString = str.split('+')

  const diceRegex = /^([1-9]+)?d(\d+)$/i
  const flatRegex = /^\d+$/

  return splitString.map(item => {
    const flatMatch = item.match(flatRegex)
    const diceMatch = item.match(diceRegex)

    if (flatMatch) return { flat: parseFloat(flatMatch[0]) }
    else if (diceMatch) return { times: parseFloat(diceMatch[1]) ?? 1, sides: parseFloat(diceMatch[2]) }
    else {
      throw new Error('invalid die string')
    }
  })
}
