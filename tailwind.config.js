module.exports = {
  theme: {
    fontFamily: {
      display: ['Helvetica', 'sans-serif'],
      body: ['Fira Sans', 'sans-serif'],
      console: ['Consolas', 'monospace']
    },
    screens: {
      sm: { max: '639px' },
      md: { max: '767px' },
      lg: { max: '1023px' },
      xl: { max: '1279px' },
      'min-sm': { min: '639px' },
      'min-md': { min: '767px' },
      'min-lg': { min: '1023px' },
      'min-xl': { min: '1279px' }
    },
    extend: {
      colors: {
        primary: '#61614e'
      },
      fontSize: {
        '7xl': '7.5rem'
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/custom-forms')
  ]
}
