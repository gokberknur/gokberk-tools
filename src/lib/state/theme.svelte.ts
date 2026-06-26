import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'gok-theme';

/**
 * Theme (light/dark) shared state.
 *
 * The class-instance-as-singleton pattern is the documented Svelte 5 way to
 * share reactive state across components from a `.svelte.ts` module.
 */
class ThemeState {
	current = $state<Theme>('light');

	constructor() {
		if (!browser) return;

		// The theme is applied pre-paint in app.html, so the dataset is the
		// authoritative source; fall back to localStorage, then 'light'.
		const fromDom = document.documentElement.dataset.theme as Theme | undefined;
		const fromStorage = localStorage.getItem(STORAGE_KEY) as Theme | null;
		this.current = fromDom ?? fromStorage ?? 'light';

		// Keep tabs in sync: a write in another tab fires `storage` here.
		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY || e.newValue == null) return;
			const next = e.newValue as Theme;
			this.current = next;
			document.documentElement.dataset.theme = next;
		});
	}

	set(t: Theme) {
		this.current = t;
		if (browser) {
			document.documentElement.dataset.theme = t;
			localStorage.setItem(STORAGE_KEY, t);
		}
	}

	toggle() {
		this.set(this.current === 'light' ? 'dark' : 'light');
	}
}

export const theme = new ThemeState();
