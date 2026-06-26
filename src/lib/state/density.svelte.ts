import { browser } from '$app/environment';

export type Density = 'comfortable' | 'compact';

const STORAGE_KEY = 'gok-density';

/**
 * Density (comfortable/compact) shared state.
 *
 * Comfortable is the default and is represented by the *absence* of the
 * `data-density` attribute, matching the token layer's switch.
 */
class DensityState {
	current = $state<Density>('comfortable');

	constructor() {
		if (!browser) return;

		const fromDom =
			document.documentElement.dataset.density === 'compact' ? 'compact' : undefined;
		const fromStorage = localStorage.getItem(STORAGE_KEY) as Density | null;
		this.current = fromDom ?? fromStorage ?? 'comfortable';

		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY || e.newValue == null) return;
			const next = e.newValue as Density;
			this.current = next;
			this.#applyToDom(next);
		});
	}

	#applyToDom(d: Density) {
		if (d === 'compact') {
			document.documentElement.dataset.density = 'compact';
		} else {
			delete document.documentElement.dataset.density;
		}
	}

	set(d: Density) {
		this.current = d;
		if (browser) {
			this.#applyToDom(d);
			localStorage.setItem(STORAGE_KEY, d);
		}
	}

	toggle() {
		this.set(this.current === 'comfortable' ? 'compact' : 'comfortable');
	}
}

export const density = new DensityState();
