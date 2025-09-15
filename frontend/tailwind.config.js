/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tiktok-pink': '#ff0050',
        'tiktok-black': '#000000',
        'linkedin-blue': '#0077b5',
        'dark-bg': '#21212E',
        'card-bg': '#2A2A3A',
        'accent-red': '#FF3B5C',
        'accent-pink': '#FF6B8A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'border-light': '#3A3A4A',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s infinite',
        'confetti': 'confetti 0.5s ease-out',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
