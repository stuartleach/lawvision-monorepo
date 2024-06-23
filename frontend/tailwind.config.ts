import type { Config } from 'tailwindcss';
import 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', 'sans-serif']
			}
		}
	}

} as Config;
