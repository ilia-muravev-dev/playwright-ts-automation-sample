import { test, expect } from '../../src/fixtures/test';

test.describe('cart', () => {
  /** The product comes from the API so the test does not depend on catalogue order. */
  test('adding a product with quantity shows the right line in the cart', { tag: '@mobile' }, async ({
    api,
    page,
    productPage,
    cartPage,
  }) => {
    const product = await api.anyProduct();
    const quantity = 3;

    await page.goto(`/product/${product.id}`);
    await productPage.expectLoaded();
    await expect(productPage.name).toContainText(product.name);

    await productPage.setQuantity(quantity);
    await productPage.addToCartAndExpectBadge(quantity);

    await cartPage.open();
    await cartPage.expectSingleLine(product.name, quantity);
    // In cents, otherwise 14.15 * 3 renders as 42.449999999999996.
    const expectedLine = ((Math.round(product.price * 100) * quantity) / 100).toFixed(2);
    await expect(cartPage.linePrice()).toContainText(expectedLine);
  });

  test('increase button raises the quantity before adding', async ({ api, page, productPage }) => {
    const product = await api.anyProduct();

    await page.goto(`/product/${product.id}`);
    await productPage.expectLoaded();
    await productPage.increaseQuantityBy(2);
    await productPage.addToCartAndExpectBadge(3);
  });
});
