/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      darkMode: "class",
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // New colors with derivatives
        burgundy: {
          50: "#F9F0F2",
          100: "#F3E0E5",
          200: "#E7C1CA",
          300: "#DBA2AF",
          400: "#CF8394",
          500: "#561C24", // Base color (dark burgundy)
          600: "#45171D",
          700: "#341216",
          800: "#230C0F",
          900: "#110607",
          950: "#090304",
          DEFAULT: "#561C24",
        },
        blue: {
          50: "#E6E9F2",
          100: "#CCD3E5",
          200: "#99A7CB",
          300: "#667BB1",
          400: "#334F97",
          500: "#002366", // Base color (deep navy blue)
          600: "#001C52",
          700: "#00153D",
          800: "#000E29",
          900: "#000714",
          950: "#00040A",
          DEFAULT: "#002366",
        },
        beige: {
          50: "#F9F7F5",
          100: "#F3EFEB",
          200: "#E7DFD7",
          300: "#DBCFC3",
          400: "#CFBFAF",
          500: "#C7B7A3", // Base color (beige)
          600: "#9F9282",
          700: "#776E62",
          800: "#504941",
          900: "#282521",
          950: "#141210",
          DEFAULT: "#C7B7A3",
        },
        cream: {
          50: "#FCFAF8",
          100: "#F9F5F1",
          200: "#F3EBE3",
          300: "#EDE1D5",
          400: "#E7D7C7",
          500: "#E8D8C4", // Base color (cream)
          600: "#BAAD9D",
          700: "#8B8276",
          800: "#5D564E",
          900: "#2E2B27",
          950: "#171513",
          DEFAULT: "#E8D8C4",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
