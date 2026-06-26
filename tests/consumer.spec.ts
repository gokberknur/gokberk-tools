import { test, expect } from '@playwright/test';

// A small, robust consumer suite: it proves the storefront composes the
// design-system components correctly end to end. Kept resilient (roles + text),
// since the design system may evolve between releases.

test('home renders the hero and chrome', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('hold tolerance');
	await expect(page.getByRole('link', { name: 'gökberk. tools' })).toBeVisible();
});

test('catalog filters by category', async ({ page }) => {
	await page.goto('/catalog?category=milling');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Milling');
	await expect(page.getByRole('link', { name: 'gök Mill M3' }).first()).toBeVisible();
});

test('adding a product surfaces a toast and updates the cart', async ({ page }) => {
	await page.goto('/product/gok-turn-t1');
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByText(/Added/)).toBeVisible();
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'gök Turn T1' })).toBeVisible();
});

test('account shows the orders table', async ({ page }) => {
	await page.goto('/account');
	await expect(page.getByRole('link', { name: 'GT-10428' })).toBeVisible();
});

test('order tracking renders the line-item table', async ({ page }) => {
	await page.goto('/order/GT-10428');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('GT-10428');
	await expect(page.getByText('$432.00')).toBeVisible();
});

test('support exposes the table of contents', async ({ page }) => {
	await page.goto('/support');
	await expect(page.getByRole('heading', { name: 'How can we help?' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Shipping' })).toBeVisible();
});
