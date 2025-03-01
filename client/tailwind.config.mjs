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
  		darkMode: 'class',
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			cream: {
  				'50': '#FEF9F1',
  				'100': '#FCE7C8',
  				'200': '#F9D8A4',
  				'300': '#F6C87F',
  				'400': '#F3B85B',
  				'500': '#F0A836',
  				'600': '#D8882A',
  				'700': '#B6691F',
  				'800': '#944B15',
  				'900': '#723C0A',
  				'950': '#502D06',
  				DEFAULT: '#FCE7C8'
  			},
  			tan: {
  				'50': '#F5F7F2',
  				'100': '#E0E7D8',
  				'200': '#C8D5BB',
  				'300': '#B1C29E',
  				'400': '#99AF81',
  				'500': '#819B64',
  				'600': '#677D50',
  				'700': '#4D5E3C',
  				'800': '#343F28',
  				'900': '#1A1F14',
  				'950': '#0D0F0A',
  				DEFAULT: '#B1C29E'
  			},
  			golden: {
  				'50': '#FEFCF2',
  				'100': '#FADA7A',
  				'200': '#F9CE55',
  				'300': '#F7C230',
  				'400': '#F0B108',
  				'500': '#C89306',
  				'600': '#A07505',
  				'700': '#785604',
  				'800': '#503802',
  				'900': '#281C01',
  				'950': '#140E00',
  				DEFAULT: '#FADA7A'
  			},
  			orange: {
  				'50': '#FCF0E3',
  				'100': '#F8E1C7',
  				'200': '#F5C28B',
  				'300': '#F0A04B',
  				'400': '#EC8C29',
  				'500': '#D87714',
  				'600': '#B26210',
  				'700': '#8C4D0D',
  				'800': '#66380A',
  				'900': '#402306',
  				'950': '#1A0E03',
  				DEFAULT: '#F0A04B'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
