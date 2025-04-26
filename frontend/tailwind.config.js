/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient-slow': 'gradient 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      transitionDuration: {
        '1500': '1500ms',
        '1800': '1800ms',
      },
      transitionDelay: {
        '300': '300ms',
        '600': '600ms',
        '1200': '1200ms',
      },
      colors: {
        // New modern color palette
        PrimaryColor: "#f0f7ff",    // Light background - soft blue tint
        SecondaryColor: "#94a3b8",  // Medium tone for secondary elements
        DarkColor: "#4f46e5",       // Indigo as primary accent color
        ExtraDarkColor: "#3730a3",  // Deep indigo for emphasis 
        accent: {
          1: "#ec4899",             // Pink accent for highlights
          2: "#14b8a6",             // Teal accent for secondary highlights
          3: "#f97316",             // Orange accent for calls to action
        },
        surface: {
          light: "#ffffff",
          mild: "#f8fafc",
          medium: "#f1f5f9",
          dark: "#0f172a",
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px 2px rgba(79, 70, 229, 0.3)',
        'glow-blue': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [],
}