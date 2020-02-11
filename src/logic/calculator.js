
function roll (sides) {
  return Math.floor(Math.random() * sides) + 1
}

function rollMultiple (sides, times) {
  const results = []
  for (let i = 0; i < times; i++) {
    results.push(roll(sides))
  }
  return results
}

function attackRoll (grit, accdiff) {
  const baseResult = roll(20)
  let result = baseResult + grit

  if (accdiff !== 0) {
    const accdiffAbs = Math.abs(accdiff)
    const accdiffSign = Math.sign(accdiff)
    const accdiffResult = Math.max(...rollMultiple(6, accdiffAbs))
    result += accdiffSign * accdiffResult
  }

  return {
    result,
    nat20: baseResult === 20
  }
}

function rollOverkill (sides, times) {
  const results = []
  for (let i = 0; i < times; i++) {
    let result = roll(sides)
    while (result === 1) {
      result = roll(sides)
    }
    results.push(result)
  }
  return results
}

function damageRoll (dice, crit = false, overkill = false, brutalTriggered = false) {
  const rollFunction = overkill ? rollOverkill : rollMultiple

  return dice.map(die => {
    if (die.flat) {
      // just return the number if it's a flat
      return die.flat
    }
    if (brutalTriggered) {
      // if brutal
      return die.times * die.sides
    }
    if (crit) {
      // roll 2x as many dice (n*2)
      const allResults = rollFunction(die.sides, die.times * 2)
      // get the top n dice
      const topResults = allResults.sort((a, b) => b - a).slice(0, die.times)
      // return their sum
      return topResults.reduce((a, b) => a + b, 0)
    }
    return rollFunction(die.sides, die.times).reduce((a, b) => a + b, 0)
  }).reduce((a, b) => a + b, 0)
}

const SAMPLE_SIZE = 1000000

export default function calculate (
  level, accdiff, targetEvasion, damageDice, reliable = 0, brutal = false, overkill = false, damageDiceOnCrit = []
) {
  const grit = Math.ceil(level / 2)

  const attempts = SAMPLE_SIZE
  let hits = 0
  let crits = 0
  let brutals = 0

  let maxDamage = 0
  let avgDamageAcc = 0

  for (let i = 0; i < SAMPLE_SIZE; i++) {
    const { result: toHitResult, nat20 } = attackRoll(grit, accdiff)
    const hit = toHitResult >= targetEvasion
    const crit = hit && toHitResult >= 20

    const brutalTriggered = crit && nat20 && brutal

    if (hit) hits++
    if (crit) crits++
    if (brutalTriggered) brutals++

    const damageDiceToRoll = crit ? damageDice.concat(damageDiceOnCrit) : damageDice

    // if we missed, deal 0 damage pre-reliable
    const preReliableDamage = hit ? damageRoll(damageDiceToRoll, crit, overkill, brutalTriggered) : 0
    // bump ump final damage to reliable
    const damage = Math.max(reliable, preReliableDamage)

    if (damage > maxDamage) maxDamage = damage
    avgDamageAcc += damage
  }
  const avgDamage = avgDamageAcc / SAMPLE_SIZE

  const gritString = grit !== 0 ? `+${grit}` : ''

  const accdiffStringSign = accdiff > 0 ? '+' : (accdiff < 0 ? '-' : '')
  const accdiffString = accdiff !== 0 ? `${accdiffStringSign}${Math.abs(accdiff)}d6k1` : ''

  const roll = `1d20${gritString}${accdiffString}`

  const toHit = parseFloat(((hits / attempts) * 100).toFixed(2))
  const critChance = parseFloat(((crits / attempts) * 100).toFixed(2))
  const brutalChance = parseFloat(((brutals / attempts) * 100).toFixed(20))

  return {
    roll,
    grit,
    toHit,
    critChance,
    brutalChance,
    maxDamage,
    avgDamage
  }
}
