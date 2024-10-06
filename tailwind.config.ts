import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        red: {
          1: "#FF5956",
          2: "#EE1E38",
        },
        white: {
          1: "#FFFFFF",
          2: "rgba(255, 255, 255, 0.72)",
          3: "rgba(255, 255, 255, 0.4)",
          4: "rgba(255, 255, 255, 0.64)",
          5: "rgba(255, 255, 255, 0.80)",
        },
        black: {
          1: "#15171C",
          2: "#222429",
          3: "#101114",
          4: "#252525",
          5: "#2E3036",
          6: "#24272C",
        },
        gray: {
          1: "#71788B",
        },
      },
      backgroundImage: {
        "red-gradient": "linear-gradient(92deg, #ff5956 2.87%, #ee1e38 96.18%)",
        "nav-focus":
          "linear-gradient(270deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.00) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        moveAndGradient: {
          "0%": {
            transform: "translateX(0)",
            background: "linear-gradient(92deg, #ff5956 2.87%, #ee1e38 96.18%)",
            "-webkit-background-clip": "text",
            color: "transparent",
          },
          "50%": {
            transform: "translateX(10%)",
            background: "white",
            "-webkit-background-clip": "text",
            color: "transparent",
          },
          "100%": {
            transform: "translateX(20%)",
            background: "linear-gradient(92deg, #ff5956 2.87%, #ee1e38 96.18%)",
            "-webkit-background-clip": "text",
            color: "transparent",
          },
        },
        "color-gradient":{
          "0%": {
            background: "linear-gradient(92deg, #ff5956 2.87%, #ee1e38 96.18%)",
            "-webkit-background-clip": "text",
            color: "transparent",
          },
          "50%": {
            background: "white",
            "-webkit-background-clip": "text",
            color: "transparent",
          },
          "100%": {
            background: "linear-gradient(92deg, #ff5956 2.87%, #ee1e38 96.18%)",
            "-webkit-background-clip": "text",
            color: "transparent",
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "move-gradient": "moveAndGradient 3s linear infinite",
        "text-gradient": "color-gradient 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
