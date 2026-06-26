/**
 * The storefront's fixtures — a fictional gök house brand of precision cutting
 * tools. No real-world competitor names: every product, grade, and code is
 * invented for the demo. One source of truth for all routes.
 */

export type StockStatus = 'in-stock' | 'low' | 'made-to-order' | 'out';

export type CategoryId = 'turning' | 'milling' | 'drilling' | 'threading' | 'grooving';

export interface SpecRow {
	label: string;
	value: string;
}

export interface Product {
	/** URL slug + stable id. */
	id: string;
	/** Mono eyebrow line, e.g. "gök Turn". */
	line: string;
	/** Display name, e.g. "gök Turn T1". */
	name: string;
	/** Invented grade code, e.g. "GK4325". */
	grade: string;
	category: CategoryId;
	subcategory: string;
	/** Price in USD. */
	price: number;
	/** Optional unit suffix shown after the price, e.g. "/ insert". */
	unit?: string;
	stock: StockStatus;
	/** Material families this tool is matched to (used as filter facets + tags). */
	materials: string[];
	/** One-line summary. */
	summary: string;
	/** Longer overview paragraph. */
	description: string;
	specs: SpecRow[];
	compatibility: string[];
	/** Related product ids ("pairs well with"). */
	related: string[];
	/** Whether to feature on the home page. */
	featured?: boolean;
}

export interface Category {
	id: CategoryId;
	name: string;
	tagline: string;
	subcategories: string[];
}

export const MATERIALS = [
	'Steel',
	'Stainless',
	'Cast iron',
	'Aluminium',
	'Titanium',
	'Superalloy'
] as const;

export const CATEGORIES: Category[] = [
	{
		id: 'turning',
		name: 'Turning',
		tagline: 'Inserts and holders for the lathe.',
		subcategories: ['Inserts', 'Holders']
	},
	{
		id: 'milling',
		name: 'Milling',
		tagline: 'End mills and shoulder cutters.',
		subcategories: ['End mills', 'Face mills']
	},
	{
		id: 'drilling',
		name: 'Drilling',
		tagline: 'Solid-carbide and indexable drills.',
		subcategories: ['Solid carbide', 'Indexable']
	},
	{
		id: 'threading',
		name: 'Threading',
		tagline: 'Taps and thread mills that hold pitch.',
		subcategories: ['Thread mills', 'Taps']
	},
	{
		id: 'grooving',
		name: 'Grooving',
		tagline: 'Parting and grooving systems.',
		subcategories: ['Parting', 'Grooving']
	}
];

export const STOCK_LABEL: Record<StockStatus, string> = {
	'in-stock': 'In stock',
	low: 'Low stock',
	'made-to-order': 'Made to order',
	out: 'Out of stock'
};

/** Maps a stock status to a gok-badge variant. */
export const STOCK_VARIANT: Record<StockStatus, 'success' | 'warning' | 'neutral' | 'error'> = {
	'in-stock': 'success',
	low: 'warning',
	'made-to-order': 'neutral',
	out: 'error'
};

export const PRODUCTS: Product[] = [
	{
		id: 'gok-turn-t1',
		line: 'gök Turn',
		name: 'gök Turn T1',
		grade: 'GK4325',
		category: 'turning',
		subcategory: 'Inserts',
		price: 18.4,
		unit: '/ insert',
		stock: 'in-stock',
		materials: ['Steel', 'Stainless'],
		summary: 'General-turning insert with a tough CVD coating.',
		description:
			'A first-choice insert for medium roughing to finishing in steel and stainless. The GK4325 grade pairs a tough substrate with a CVD coating that holds an edge through interrupted cuts and long production runs.',
		specs: [
			{ label: 'Insert shape', value: 'CNMG 120408' },
			{ label: 'Grade', value: 'GK4325' },
			{ label: 'Coating', value: 'CVD Ti(C,N)+Al₂O₃' },
			{ label: 'Corner radius', value: '0.8 mm' },
			{ label: 'Chipbreaker', value: 'PM medium' }
		],
		compatibility: ['gök Hold H1', 'ISO CNMG holders'],
		related: ['gok-hold-h1', 'gok-turn-t3', 'gok-groove-g4'],
		featured: true
	},
	{
		id: 'gok-turn-t3',
		line: 'gök Turn',
		name: 'gök Turn T3',
		grade: 'GK1115',
		category: 'turning',
		subcategory: 'Inserts',
		price: 21.9,
		unit: '/ insert',
		stock: 'in-stock',
		materials: ['Stainless', 'Titanium', 'Superalloy'],
		summary: 'Sharp PVD insert for stainless and superalloys.',
		description:
			'A sharp, PVD-coated grade for finishing stainless, titanium, and heat-resistant superalloys where a keen edge keeps cutting forces and heat down.',
		specs: [
			{ label: 'Insert shape', value: 'DCMT 11T304' },
			{ label: 'Grade', value: 'GK1115' },
			{ label: 'Coating', value: 'PVD TiAlN' },
			{ label: 'Corner radius', value: '0.4 mm' },
			{ label: 'Chipbreaker', value: 'SF finishing' }
		],
		compatibility: ['gök Hold H1', 'ISO DCMT holders'],
		related: ['gok-turn-t1', 'gok-hold-h1', 'gok-thread-th2']
	},
	{
		id: 'gok-hold-h1',
		line: 'gök Hold',
		name: 'gök Hold H1',
		grade: 'QC-25',
		category: 'turning',
		subcategory: 'Holders',
		price: 248,
		stock: 'in-stock',
		materials: ['Steel', 'Stainless', 'Cast iron'],
		summary: 'Quick-change turning holder with coolant through.',
		description:
			'A rigid quick-change holder with through-coolant to the cutting edge. Repeatable to ±0.01 mm on tool change, so you swap inserts without re-setting the offset.',
		specs: [
			{ label: 'Shank', value: '25 × 25 mm' },
			{ label: 'Interface', value: 'QC-25 quick change' },
			{ label: 'Coolant', value: 'Through-tool, 70 bar' },
			{ label: 'Repeatability', value: '±0.01 mm' }
		],
		compatibility: ['gök Turn T1', 'gök Turn T3'],
		related: ['gok-turn-t1', 'gok-turn-t3', 'gok-groove-g4'],
		featured: true
	},
	{
		id: 'gok-mill-m3',
		line: 'gök Mill',
		name: 'gök Mill M3',
		grade: 'GK2040',
		category: 'milling',
		subcategory: 'End mills',
		price: 96.5,
		stock: 'in-stock',
		materials: ['Steel', 'Stainless', 'Cast iron'],
		summary: 'Four-flute solid-carbide end mill for shoulders.',
		description:
			'A versatile four-flute solid-carbide end mill for square shoulders and slotting in steel and stainless. A polished flute face clears chips cleanly at high feed.',
		specs: [
			{ label: 'Diameter', value: '10 mm' },
			{ label: 'Flutes', value: '4' },
			{ label: 'Grade', value: 'GK2040' },
			{ label: 'Coating', value: 'PVD AlTiN' },
			{ label: 'Helix', value: '38°' }
		],
		compatibility: ['ER collet chucks', 'Shrink-fit holders'],
		related: ['gok-mill-m5', 'gok-drill-d8', 'gok-mill-face-f2'],
		featured: true
	},
	{
		id: 'gok-mill-m5',
		line: 'gök Mill',
		name: 'gök Mill M5',
		grade: 'GK2515',
		category: 'milling',
		subcategory: 'End mills',
		price: 132,
		stock: 'low',
		materials: ['Aluminium'],
		summary: 'Three-flute high-feed cutter tuned for aluminium.',
		description:
			'A three-flute geometry with a bright, uncoated edge and wide gullet for high-feed machining in aluminium, where chip evacuation sets the limit.',
		specs: [
			{ label: 'Diameter', value: '12 mm' },
			{ label: 'Flutes', value: '3' },
			{ label: 'Grade', value: 'GK2515' },
			{ label: 'Coating', value: 'Uncoated, polished' },
			{ label: 'Helix', value: '45°' }
		],
		compatibility: ['ER collet chucks', 'Hydraulic holders'],
		related: ['gok-mill-m3', 'gok-mill-face-f2', 'gok-drill-d6']
	},
	{
		id: 'gok-mill-face-f2',
		line: 'gök Face',
		name: 'gök Face F2',
		grade: 'GK4330',
		category: 'milling',
		subcategory: 'Face mills',
		price: 410,
		stock: 'made-to-order',
		materials: ['Steel', 'Cast iron'],
		summary: 'Indexable face mill, 50 mm, five pockets.',
		description:
			'A 50 mm indexable face mill running five double-sided inserts for productive facing of steel and cast iron. Built to be re-tipped, not retired.',
		specs: [
			{ label: 'Cutting diameter', value: '50 mm' },
			{ label: 'Pockets', value: '5' },
			{ label: 'Insert', value: 'SDMT 1205' },
			{ label: 'Approach angle', value: '45°' }
		],
		compatibility: ['Arbor 22 mm'],
		related: ['gok-mill-m3', 'gok-mill-m5']
	},
	{
		id: 'gok-drill-d8',
		line: 'gök Drill',
		name: 'gök Drill D8',
		grade: 'GK3010',
		category: 'drilling',
		subcategory: 'Solid carbide',
		price: 74.2,
		stock: 'in-stock',
		materials: ['Steel', 'Stainless', 'Cast iron'],
		summary: 'Solid-carbide drill, 5×D, through-coolant.',
		description:
			'A solid-carbide drill with through-coolant and a self-centring point for straight, accurate holes to 5× diameter in steel and stainless.',
		specs: [
			{ label: 'Diameter', value: '8 mm' },
			{ label: 'Depth', value: '5 × D' },
			{ label: 'Grade', value: 'GK3010' },
			{ label: 'Coating', value: 'PVD TiAlN' },
			{ label: 'Point angle', value: '140°' }
		],
		compatibility: ['ER collet chucks', 'Hydraulic holders'],
		related: ['gok-drill-d6', 'gok-mill-m3', 'gok-thread-th2'],
		featured: true
	},
	{
		id: 'gok-drill-d6',
		line: 'gök Drill',
		name: 'gök Drill D6',
		grade: 'GK3010',
		category: 'drilling',
		subcategory: 'Solid carbide',
		price: 61.8,
		stock: 'in-stock',
		materials: ['Aluminium', 'Steel'],
		summary: 'Solid-carbide drill, 3×D, general purpose.',
		description:
			'A general-purpose 3× diameter solid-carbide drill for shallow holes across a range of materials — a dependable shop staple.',
		specs: [
			{ label: 'Diameter', value: '6 mm' },
			{ label: 'Depth', value: '3 × D' },
			{ label: 'Grade', value: 'GK3010' },
			{ label: 'Coating', value: 'PVD TiAlN' },
			{ label: 'Point angle', value: '140°' }
		],
		compatibility: ['ER collet chucks'],
		related: ['gok-drill-d8', 'gok-mill-m5']
	},
	{
		id: 'gok-thread-th2',
		line: 'gök Thread',
		name: 'gök Thread TH2',
		grade: 'GK1620',
		category: 'threading',
		subcategory: 'Thread mills',
		price: 158,
		stock: 'in-stock',
		materials: ['Steel', 'Stainless', 'Titanium'],
		summary: 'Solid-carbide thread mill, full-profile.',
		description:
			'A full-profile solid-carbide thread mill that cuts a range of pitches from one tool — one tool, many threads, with no risk of a broken tap in the part.',
		specs: [
			{ label: 'Thread range', value: 'M6–M12' },
			{ label: 'Grade', value: 'GK1620' },
			{ label: 'Coating', value: 'PVD TiCN' },
			{ label: 'Flutes', value: '3' }
		],
		compatibility: ['ER collet chucks', 'Hydraulic holders'],
		related: ['gok-drill-d8', 'gok-turn-t3']
	},
	{
		id: 'gok-groove-g4',
		line: 'gök Groove',
		name: 'gök Groove G4',
		grade: 'GK4215',
		category: 'grooving',
		subcategory: 'Parting',
		price: 27.5,
		unit: '/ insert',
		stock: 'in-stock',
		materials: ['Steel', 'Stainless'],
		summary: 'Parting insert, 3 mm, reinforced edge.',
		description:
			'A 3 mm parting-off insert with a reinforced edge and a chipbreaker that curls and clears the chip down the groove, even deep in the cut.',
		specs: [
			{ label: 'Width', value: '3 mm' },
			{ label: 'Grade', value: 'GK4215' },
			{ label: 'Coating', value: 'CVD' },
			{ label: 'Max depth', value: '21 mm' }
		],
		compatibility: ['gök Groove blade GB-3'],
		related: ['gok-turn-t1', 'gok-hold-h1']
	},
	{
		id: 'gok-groove-gb3',
		line: 'gök Groove',
		name: 'gök Groove GB-3',
		grade: 'QC-25',
		category: 'grooving',
		subcategory: 'Grooving',
		price: 196,
		stock: 'low',
		materials: ['Steel', 'Stainless', 'Cast iron'],
		summary: 'Parting blade with high-pressure coolant.',
		description:
			'A rigid parting blade with high-pressure coolant aimed at the edge — it keeps the cut cool and the chip moving on deep parting work.',
		specs: [
			{ label: 'Blade height', value: '26 mm' },
			{ label: 'Insert seat', value: '3 mm' },
			{ label: 'Coolant', value: 'High-pressure, 2 ports' }
		],
		compatibility: ['gök Groove G4'],
		related: ['gok-groove-g4', 'gok-hold-h1']
	},
	{
		id: 'gok-turn-t5',
		line: 'gök Turn',
		name: 'gök Turn T5',
		grade: 'GK3220',
		category: 'turning',
		subcategory: 'Inserts',
		price: 24.6,
		unit: '/ insert',
		stock: 'made-to-order',
		materials: ['Cast iron'],
		summary: 'Ceramic-friendly insert for grey cast iron.',
		description:
			'A hard, wear-resistant grade for high-speed turning of grey cast iron, where abrasion — not toughness — is the limit.',
		specs: [
			{ label: 'Insert shape', value: 'SNMG 120408' },
			{ label: 'Grade', value: 'GK3220' },
			{ label: 'Coating', value: 'CVD Al₂O₃' },
			{ label: 'Corner radius', value: '0.8 mm' }
		],
		compatibility: ['gök Hold H1'],
		related: ['gok-turn-t1', 'gok-hold-h1']
	}
];

export type OrderStatus = 'placed' | 'in-production' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLine {
	productId: string;
	name: string;
	qty: number;
	price: number;
}

export interface Order {
	id: string;
	date: string;
	status: OrderStatus;
	lines: OrderLine[];
	total: number;
	tracking?: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
	placed: 'Placed',
	'in-production': 'In production',
	shipped: 'Shipped',
	delivered: 'Delivered',
	cancelled: 'Cancelled'
};

export const ORDER_STATUS_VARIANT: Record<
	OrderStatus,
	'info' | 'warning' | 'success' | 'neutral' | 'error'
> = {
	placed: 'info',
	'in-production': 'warning',
	shipped: 'info',
	delivered: 'success',
	cancelled: 'error'
};

/** The ordered steps of fulfilment, for the tracking view. */
export const ORDER_STEPS: { id: OrderStatus; label: string }[] = [
	{ id: 'placed', label: 'Placed' },
	{ id: 'in-production', label: 'Made' },
	{ id: 'shipped', label: 'Shipped' },
	{ id: 'delivered', label: 'Delivered' }
];

export const ORDERS: Order[] = [
	{
		id: 'GT-10428',
		date: '2026-06-18',
		status: 'shipped',
		tracking: 'Out for delivery — arriving Friday',
		lines: [
			{ productId: 'gok-turn-t1', name: 'gök Turn T1', qty: 10, price: 18.4 },
			{ productId: 'gok-hold-h1', name: 'gök Hold H1', qty: 1, price: 248 }
		],
		total: 432
	},
	{
		id: 'GT-10391',
		date: '2026-06-09',
		status: 'delivered',
		lines: [{ productId: 'gok-mill-m3', name: 'gök Mill M3', qty: 2, price: 96.5 }],
		total: 193
	},
	{
		id: 'GT-10355',
		date: '2026-05-27',
		status: 'in-production',
		tracking: 'In production — ships in 3 days',
		lines: [{ productId: 'gok-mill-face-f2', name: 'gök Face F2', qty: 1, price: 410 }],
		total: 410
	},
	{
		id: 'GT-10288',
		date: '2026-05-12',
		status: 'delivered',
		lines: [
			{ productId: 'gok-drill-d8', name: 'gök Drill D8', qty: 3, price: 74.2 },
			{ productId: 'gok-thread-th2', name: 'gök Thread TH2', qty: 1, price: 158 }
		],
		total: 381
	},
	{
		id: 'GT-10204',
		date: '2026-04-30',
		status: 'cancelled',
		lines: [{ productId: 'gok-groove-gb3', name: 'gök Groove GB-3', qty: 1, price: 196 }],
		total: 196
	}
];

export interface FaqGroup {
	heading: string;
	id: string;
	items: { q: string; a: string }[];
}

export const FAQ: FaqGroup[] = [
	{
		heading: 'Shipping',
		id: 'shipping',
		items: [
			{
				q: 'When does my order ship?',
				a: 'In-stock items ship the same day if you order before 3 pm. Made-to-order tools list a lead time on the product page.'
			},
			{
				q: 'Do you ship internationally?',
				a: 'Yes — to most of Europe within two business days, and worldwide within a week. Duties are calculated at checkout.'
			}
		]
	},
	{
		heading: 'Returns',
		id: 'returns',
		items: [
			{
				q: 'Can I return a tool?',
				a: 'Unused tools in their original packaging can be returned within 30 days. Made-to-order items are non-returnable.'
			},
			{
				q: 'What if an edge fails early?',
				a: 'If a tool fails inside its expected life, send us the part and the cutting data. We replace it and look at what happened.'
			}
		]
	},
	{
		heading: 'Tooling',
		id: 'tooling',
		items: [
			{
				q: 'How do I choose a grade?',
				a: 'Start with the material family on each product. If you are between grades, talk to an engineer — we read your setup and recommend one.'
			},
			{
				q: 'Do you offer contract pricing?',
				a: 'Yes. Volume and framework agreements unlock contract pricing; enter your contract code in the cart to see it applied.'
			}
		]
	},
	{
		heading: 'Account',
		id: 'account',
		items: [
			{
				q: 'Where are my orders?',
				a: 'Your orders, addresses, and preferences live under Account. Each order links to a live tracking view.'
			},
			{
				q: 'Can I save tools for later?',
				a: 'Save any tool to your wishlist from its page, then move it to the cart when you are ready to order.'
			}
		]
	}
];

export interface JournalSection {
	heading: string;
	id: string;
	body: string[];
}

export interface JournalPost {
	id: string;
	eyebrow: string;
	title: string;
	date: string;
	readingTime: string;
	excerpt: string;
	sections: JournalSection[];
}

export const JOURNAL: JournalPost[] = [
	{
		id: 'reading-tool-wear',
		eyebrow: 'Field notes',
		title: 'Reading tool wear before it reads you',
		date: '2026-06-20',
		readingTime: '6 min read',
		excerpt:
			'Flank wear, crater wear, built-up edge — the marks a tool leaves tell you what to change before a part goes out of tolerance.',
		sections: [
			{
				heading: 'Why wear is a signal, not a verdict',
				id: 'why-wear',
				body: [
					'A cutting edge does not fail all at once. It tells you it is going, in marks you can read under a loupe, long before the part it makes drifts out of tolerance.',
					'The habit worth building is simple: pull the insert at a fixed interval, look at the edge, and decide — keep cutting, index, or change. The tool tells you which.'
				]
			},
			{
				heading: 'Flank wear',
				id: 'flank-wear',
				body: [
					'Flank wear is the even, grey band that grows along the cutting edge. A little is healthy — it means the edge is doing work. Past about 0.3 mm it starts to push, and surface finish and dimensional accuracy follow it down.',
					'If flank wear is the only thing you see, you are usually running too slow or too long. Lift the speed or shorten the interval.'
				]
			},
			{
				heading: 'Crater wear',
				id: 'crater-wear',
				body: [
					'Crater wear is a polished hollow on the rake face, worn by the chip flowing over it. Left alone, the crater meets the flank and the edge collapses.',
					'A tougher coating or a touch less speed usually buys back the edge.'
				]
			},
			{
				heading: 'Built-up edge',
				id: 'built-up-edge',
				body: [
					'Built-up edge is material welding to the tool, then tearing away with a piece of the edge. It loves low speeds and sticky materials like soft stainless and aluminium.',
					'The fix is counter-intuitive: go faster, not slower, and get sharp. A keen, polished edge gives the chip nothing to cling to.'
				]
			}
		]
	},
	{
		id: 'coolant-that-earns-its-pressure',
		eyebrow: 'Shop practice',
		title: 'Coolant that earns its pressure',
		date: '2026-06-04',
		readingTime: '5 min read',
		excerpt:
			'Through-tool coolant is not about flood. Aimed at the edge, at the right pressure, it changes how a tool wears.',
		sections: [
			{
				heading: 'Where the heat actually is',
				id: 'where-heat',
				body: [
					'Most of the heat in a cut is carried away in the chip — if the chip leaves. The trouble starts when it does not: it recuts, packs the flute, and bakes the edge.',
					'Coolant aimed at the shear zone does two jobs at once: it lifts heat and it moves the chip.'
				]
			},
			{
				heading: 'Pressure over volume',
				id: 'pressure',
				body: [
					'A flood of low-pressure coolant washes the outside of the cut and never reaches the edge. A focused jet at 50–70 bar gets under the chip and breaks it.',
					'On deep holes and parting, pressure is the difference between a clear groove and a packed one.'
				]
			}
		]
	}
];

/** Flat tax + shipping model for the demo cart. */
export const TAX_RATE = 0.0;
export const SHIPPING = 0;

export const currency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

export function formatPrice(value: number): string {
	return currency.format(value);
}

export function getProduct(id: string): Product | undefined {
	return PRODUCTS.find((p) => p.id === id);
}

export function productsInCategory(category: CategoryId): Product[] {
	return PRODUCTS.filter((p) => p.category === category);
}

export function featuredProducts(): Product[] {
	return PRODUCTS.filter((p) => p.featured);
}

export function getOrder(id: string): Order | undefined {
	return ORDERS.find((o) => o.id === id);
}

export function getPost(id: string): JournalPost | undefined {
	return JOURNAL.find((p) => p.id === id);
}
