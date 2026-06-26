import { browser } from '$app/environment';
import { getProduct } from '$lib/data';

const STORAGE_KEY = 'gok-cart';

export interface CartItem {
	productId: string;
	qty: number;
}

/**
 * Shopping-cart shared state, persisted to localStorage and synced across tabs.
 */
class CartState {
	items = $state<CartItem[]>([]);

	constructor() {
		if (!browser) return;

		this.items = this.#read();

		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY) return;
			this.items = this.#read();
		});
	}

	get count(): number {
		return this.items.reduce((sum, item) => sum + item.qty, 0);
	}

	get subtotal(): number {
		return this.items.reduce(
			(sum, item) => sum + item.qty * (getProduct(item.productId)?.price ?? 0),
			0
		);
	}

	add(productId: string, qty = 1) {
		const existing = this.items.find((item) => item.productId === productId);
		if (existing) {
			existing.qty += qty;
		} else {
			this.items.push({ productId, qty });
		}
		this.#persist();
	}

	setQty(productId: string, qty: number) {
		if (qty <= 0) {
			this.remove(productId);
			return;
		}
		const existing = this.items.find((item) => item.productId === productId);
		if (existing) {
			existing.qty = qty;
		} else {
			this.items.push({ productId, qty });
		}
		this.#persist();
	}

	remove(productId: string) {
		this.items = this.items.filter((item) => item.productId !== productId);
		this.#persist();
	}

	clear() {
		this.items = [];
		this.#persist();
	}

	#read(): CartItem[] {
		if (!browser) return [];
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as CartItem[]) : [];
		} catch {
			return [];
		}
	}

	#persist() {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
	}
}

export const cart = new CartState();
