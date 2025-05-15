import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        background: "#F5F5F7", // Light background
        text: "#1D1D1F", // Dark text for light mode
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1D1D1F',
            h1: {
              color: '#1D1D1F',
            },
            h2: {
              color: '#1D1D1F',
            },
            h3: {
              color: '#1D1D1F',
            },
            h4: {
              color: '#1D1D1F',
            },
            strong: {
              color: '#1D1D1F',
            },
            a: {
              color: '#0066CC',
              '&:hover': {
                color: '#004499',
              },
            },
          },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;