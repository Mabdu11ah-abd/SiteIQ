	// tailwind.config.ts
	import type { Config } from "tailwindcss";

	export default {
	// Content paths for file scanning
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	
	// Dark mode configuration
	darkMode: "class",
	
	// In Tailwind v4, most theme configuration is moved to CSS
	// Only essential build-time configuration remains here
	theme: {
		// Container configuration can still be done here
		container: {
		center: true,
		padding: '2rem',
		screens: {
			'2xl': '1400px'
		}
		},
	},
	
	// Plugins
	plugins: [
		// Note: tailwindcss-animate may need updating for v4 compatibility
		// Check if there's a v4-compatible version
	],
	} satisfies Config;