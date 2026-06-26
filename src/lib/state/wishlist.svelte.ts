import { browser } from '$app/environment';

const STORAGE_KEY = 'gok-wishlist';

/**
 * Wishlist shared state — a set of product ids, persisted to localStorage and
 * synced across tabs.
 */
class WishlistState {
	ids = $state<string[]>([]);

	constructor() {
		if (!browser) return;

		this.ids = this.#read();

		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY) return;
			this.ids = this.#read();
		});
	}

	get count(): number {
		return this.ids.length;
	}

	has(id: string): boolean {
		return this.ids.includes(id);
	}

	add(id: string) {
		if (!this.ids.includes(id)) {
			this.ids.push(id);
			this.#persist();
		}
	}

	remove(id: string) {
		this.ids = this.ids.filter((existing) => existing !== id);
		this.#persist();
	}

	toggle(id: string) {
		if (this.has(id)) {
			this.remove(id);
		} else {
			this.add(id);
		}
	}

	#read(): string[] {
		if (!browser) return [];
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as string[]) : [];
		} catch {
			return [];
		}
	}

	#persist() {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ids));
	}
}

export const wishlist = new WishlistState();
