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
          separator: 'var(--color-light-separator)',
          fillOne: 'var(--color-light-fillOne)',
          main: {
            primary: 'var(--color-light-main-primary)',
            secondary: 'var(--color-light-main-secondary)',
          },
          text: {
            primary: 'var(--color-light-text-primary)',
            secondary: 'var(--color-light-text-secondary)',
          },
          bubbleOne: {
            bg: 'var(--color-light-bubbleOne-bg)',
            text: 'var(--color-light-bubbleOne-text)',
            replied: 'var(--color-light-bubbleOne-replied)',
          },
          bubbleTwo: {
            bg: 'var(--color-light-bubbleTwo-bg)',
            text: 'var(--color-light-bubbleTwo-text)',
            replied: 'var(--color-light-bubbleTwo-replied)',
          },
        },
        dark: {
          bg: {
            primary: 'var(--color-dark-bg-primary)',
            secondary: 'var(--color-dark-bg-secondary)',
          },
          separator: 'var(--color-dark-separator)',
          fillOne: 'var(--color-dark-fillOne)',
          main: {
            primary: 'var(--color-dark-main-primary)',
            secondary: 'var(--color-dark-main-secondary)',
          },
          text: {
            primary: 'var(--color-dark-text-primary)',
            secondary: 'var(--color-dark-text-secondary)',
          },
          bubbleOne: {
            bg: 'var(--color-dark-bubbleOne-bg)',
            text: 'var(--color-dark-bubbleOne-text)',
            replied: 'var(--color-dark-bubbleOne-replied)',
          },
          bubbleTwo: {
            bg: 'var(--color-dark-bubbleTwo-bg)',
            text: 'var(--color-dark-bubbleTwo-text)',
            replied: 'var(--color-dark-bubbleTwo-replied)',
          },
        },
      },
    },
  },
  plugins: [],
}
