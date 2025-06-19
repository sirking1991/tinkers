/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa'
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399'
        },
        dark: {
          DEFAULT: '#1f2937',
          darker: '#111827',
          lighter: '#374151'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
