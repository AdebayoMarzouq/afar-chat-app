/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: {
            primary: 'var(--color-light-bg-primary)',
            secondary: 'var(--color-light-bg-secondary)',
          },
          main: {
            primary: 'var(--color-light-main-primary)',
            secondary: 'var(--color-light-main-secondary)',
          },
          text: {
            primary: 'var(--color-light-text-primary)',
            secondary: 'var(--color-light-text-secondary)',
          },
          bubblebg: 'var(--color-light-bubble-bg)',
          bubbletext: 'var(--color-light-bubble-text)',
        },
        dark: {
          bg: {
            primary: 'var(--color-dark-bg-primary)',
            secondary: 'var(--color-dark-bg-secondary)',
          },
          main: {
            primary: 'var(--color-dark-main-primary)',
            secondary: 'var(--color-dark-main-secondary)',
          },
          text: {
            primary: 'var(--color-dark-text-primary)',
            secondary: 'var(--color-dark-text-secondary)',
          },
          bubblebg: 'var(--color-dark-bubble-bg)',
          bubbletext: 'var(--color-dark-bubble-text)',
        },
      },
    },
  },
  plugins: [],
}
