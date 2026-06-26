import { defineConfig } from '@playwright/test';

/**
 * Consumer smoke tests — they drive the built store against the published (or
 * linked) @gokberknur/design-system. The design-system repo runs this same
 * suite as a non-blocking report before a release (see its consumer-report CI).
 */
export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://localhost:4173'
	},
	webServer: {
		command: 'npm run build && npm run preview -- --port 4173',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
