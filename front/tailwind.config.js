/**@type {import('tailwindcss').Config} */
export default {
  content: [
   // "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#ffd700',
        'dark-gold': '#b8860b'
      },
      spacing: {
        'screen/2': '50vh'
      },
      borderWidth: {
        '3': '3px'
      },
      fontFamily: {
        body: ['Ruslan Display']
      }
    },
    
  },
  plugins: [],
}


