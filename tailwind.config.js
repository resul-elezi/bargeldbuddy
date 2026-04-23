/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'app-bg': '#F9F7F2',
        }
      },
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: [
        {
          buddyTheme: {
            "primary": "#570df8",
            "secondary": "#f000b8",
            "accent": "#37cdbe",
            "neutral": "#3d4451",
            "base-100": "#F9F7F2", 
          },
        },
      ],
    },
  }