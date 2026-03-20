/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#c0c0c0',
          400: '#a0a0a0',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#202020',
          900: '#101010',
          950: '#0a0a0a',
        },
        accent: {
          primary: '#10b981', // emerald
          error: '#ef4444',
          warn: '#f59e0b',
          info: '#3b82f6',
          success: '#10b981',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
