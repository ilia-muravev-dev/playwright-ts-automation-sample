import { test, expect } from '../../src/fixtures/test';

test.describe('catalog', () => {
  test('search narrows the list to matching products', async ({ catalogPage }) => {
    await catalogPage.open();
    const before = await catalogPage.products.count();

    await catalogPage.search('pliers');

    await catalogPage.expectEveryProductMatches('pliers');
    expect(await catalogPage.products.count()).toBeLessThan(before);
  });

  test('sorting by name puts the list in alphabetical order', async ({ catalogPage, page }) => {
    await catalogPage.open();

    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/products') && r.ok()),
      catalogPage.sortSelect.selectOption('name,asc'),
    ]);

    await catalogPage.expectSortedByName();
  });
});
