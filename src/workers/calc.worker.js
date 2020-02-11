import calculate from '@/logic/calculator.js'

onmessage = function ({ data }) {
  const { level, accdiff, targetEvasion, damageDice, damageOnCritDice, reliable, brutal, overkill } = data
  console.log('worker message')
  const results = calculate(level, accdiff, targetEvasion, damageDice, reliable, brutal, overkill, damageOnCritDice)
  postMessage(results)
}
