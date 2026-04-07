/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        'surface-light': '#252525',
        primary: '#3b82f6',
        accent: '#8b5cf6',
        defense: '#a855f7',
        guard: '#eab308',
        passing: '#22c55e',
        submission: '#ef4444',
      },
    },
  },
  plugins: [],
};
