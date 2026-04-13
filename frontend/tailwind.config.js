/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '475px', // 모바일 가로 (iPhone Plus, Galaxy S 계열)
      },
    },
  },
  plugins: [],
}
