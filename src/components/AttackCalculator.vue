<template>
  <div>
    <div class="flex items-center mb-3">
      <h2
        class="lg:text-3xl md:text-2xl font-display inline text-5xl font-bold uppercase"
      >
        ATTACK CALCULATOR
      </h2>
      <div
        class="boxed font-console inline-flex items-center ml-3 transition-opacity duration-150 ease-in-out"
        :class="{ 'opacity-0': !calculating }"
      >
        <Octicon :icon="Octicons.sync" className="mr-2 spin" />
        CALCULATING...
      </div>
    </div>
    <!-- Inputs -->
    <div class="mb-2">
      <div class="lg:flex-col lg:text-xl flex flex-row items-start mb-3">
        <!-- Level -->
        <label class="lg:mb-2">
          <span>PILOT LEVEL</span>
          <input
            v-model="pilotLevel"
            type="number"
            min="0"
            max="12"
            class="input text-center"
          />
          <span class="boxed boxed--bordered font-console min-lg:mr-3"
            >GRIT: <AnimatedNumber :number="calcOutput.grit" />
          </span>
        </label>
        <!-- Evasion -->
        <label class="lg:mb-2">
          <span>TARGET EVASION</span>
          <input
            v-model="targetEvasion"
            type="number"
            min="0"
            max="20"
            class="input text-center"
          />
        </label>
        <label class="lg:mb-2">
          <span>ACCURACY/DIFFICULTY</span>
          <input
            v-model="accDiff"
            type="number"
            min="-10"
            max="10"
            class="input text-center"
          />
        </label>
      </div>
    </div>
    <!-- Damage inputs -->
    <div class="mb-2">
      <div class="lg:flex-col lg:text-xl flex flex-row items-center mb-3">
        <!-- Level -->
        <label class="lg:mb-2">
          <span>DAMAGE</span>
          <input
            v-model="damageRollString"
            type="text"
            class="input"
          />
        </label>
        <span class="font-console text-red-400 transition-opacity duration-150 ease-in-out" :class="{ 'opacity-0': !damageRollError }"
          >
          invalid damage string
        </span>
      </div>
      <div class="lg:flex-col lg:text-xl flex flex-row items-center mb-3">
        <!-- Level -->
        <label class="lg:mb-2">
          <span>BONUS DAMAGE ON CRIT</span>
          <input
            v-model="damageOnCritRollString"
            type="text"
            class="input"
          />
        </label>
        <span class="font-console text-red-400 transition-opacity duration-150 ease-in-out" :class="{ 'opacity-0': !damageRollError }"
          >
          invalid damage string
        </span>
      </div>
      <div class="flex">
        <label class="lg:mb-2">
          <span>RELIABLE</span>
          <input
            v-model="reliable"
            type="number"
            min="0"
            max="99"
            class="input text-center"
          />
        </label>
        <label class="inline-flex items-center mr-3">
          <input type="checkbox" v-model="brutal" class="form-checkbox text-yellow-600">
          <span class="ml-2">Brutal</span>
        </label>
        <label class="inline-flex items-center">
          <input type="checkbox" v-model="overkill" class="form-checkbox text-yellow-600">
          <span class="ml-2">Overkill</span>
        </label>
      </div>
    </div>
    <!-- Roll -->
    <div class="mt-6 mb-3 leading-none">
      <span class="mr-2 text-2xl">ATTACK</span>
      <span class="font-console boxed inline-block text-2xl font-bold text-white select-all">{{
        calcOutput.roll
      }}</span>
    </div>
    <!-- To hit -->
    <div class="flex flex-wrap mb-2">
      <span class="resultbox text-white">
        TO HIT: <AnimatedNumber :number="calcOutput.toHit" :fixed="1" />%
      </span>
      <span class="resultbox text-red-400">
        CRIT CHANCE:
        <AnimatedNumber :number="calcOutput.critChance" :fixed="1" />%
      </span>
    </div>
    <div class="mt-3 leading-none">
      <span class="mr-2 text-2xl">DAMAGE</span>
      <span class="font-console boxed inline-block mb-4 text-2xl font-bold bg-white select-all">{{
        lastGoodDamageRollString
      }}</span>
      <span v-if="parsedDamageOnCritRoll.length" class="font-display mx-2 text-3xl">+</span>
      <span v-if="parsedDamageOnCritRoll.length" class="font-console boxed inline-block mb-4 text-2xl font-bold bg-red-400 select-all">{{
        lastGoodDamageOnCritRollString
      }}?</span>
    </div>
    <div class="flex flex-wrap">
      <span class="resultbox text-yellow-200">
        AVG: <AnimatedNumber :number="calcOutput.avgDamage" :fixed="1" />
      </span>
      <span class="resultbox text-red-500">
        MAX:
        <AnimatedNumber :number="calcOutput.maxDamage" />
      </span>
    </div>
    <ChartBlock />
  </div>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
import { Octicon, Octicons } from 'octicons-vue'
import CalcWorker from 'worker-loader!@/workers/calc.worker.js'
import parseDiceString from '@/logic/parseDiceString'
import ChartBlock from './ChartField/ChartBlock'
import AnimatedNumber from './AnimatedNumber'

import { debounce } from 'lodash'

function calculate (worker, data) {
  worker.postMessage(data)
}

const debouncedCalculate = debounce(calculate, 250)

export default {
  name: 'Calculator',
  components: { Octicon, AnimatedNumber, ChartBlock },
  data: () => ({
    Octicons,
    pilotLevel: 0,
    targetEvasion: 8,
    accDiff: 0,
    damageRollString: '1d6',
    lastGoodDamageRollString: '1d6',
    parsedDamageRoll: [],
    damageOnCritRollString: '',
    lastGoodDamageOnCritRollString: '',
    parsedDamageOnCritRoll: [],
    reliable: 0,
    brutal: false,
    overkill: false,
    damageRollError: false,
    damageOnCritRollError: false,
    worker: null,
    calculating: false,
    calcOutput: {
      toHit: 0,
      roll: '',
      grit: 0,
      critChance: 0,
      avgDamage: 0,
      maxDamage: 0
    }
  }),
  methods: {
    doCalculate () {
      this.calculating = true
      debouncedCalculate(this.worker, {
        level: this.pilotLevel,
        accdiff: this.accDiff,
        targetEvasion: this.targetEvasion,
        damageDice: this.parsedDamageRoll,
        damageOnCritDice: this.parsedDamageOnCritRoll,
        reliable: this.reliable,
        brutal: this.brutal,
        overkill: this.overkill
      })
    }
  },
  watch: {
    pilotLevel () { this.doCalculate() },
    targetEvasion () { this.doCalculate() },
    accDiff () { this.doCalculate() },
    reliable () { this.doCalculate() },
    brutal () { this.doCalculate() },
    overkill () { this.doCalculate() },
    damageRollString: {
      immediate: true,
      handler () {
        try {
          this.parsedDamageRoll = parseDiceString(this.damageRollString)
          this.damageRollError = false
          this.lastGoodDamageRollString = this.damageRollString
          this.doCalculate()
        } catch (e) {
          this.damageRollError = true
        }
      }
    },
    damageOnCritRollString: {
      handler () {
        try {
          if (this.damageOnCritRollString.trim() === '') this.parsedDamageOnCritRoll = []
          else this.parsedDamageOnCritRoll = parseDiceString(this.damageOnCritRollString)
          this.damageOnCritRollError = false
          this.lastGoodDamageOnCritRollString = this.damageOnCritRollString
          this.doCalculate()
        } catch (e) {
          this.damageOnCritRollError = true
        }
      }
    }
  },
  created () {
    this.worker = new CalcWorker()
    this.worker.onmessage = ({ data }) => {
      this.calcOutput = { ...data }
      this.calculating = false
    }
    this.doCalculate()
  }
}
</script>
