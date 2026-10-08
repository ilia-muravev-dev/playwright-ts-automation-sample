import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/config/env';

test.describe('products API', () => {
  test('first page comes back paginated and well formed', async ({ api }) => {
    const page = await api.products({ page: 1 });

    expect(page.current_page).toBe(1);
    expect(page.data.length).toBeGreaterThan(0);
    expect(page.data.length).toBeLessThanOrEqual(page.per_page);

    for (const product of page.data) {
      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
      });
      expect(product.price).toBeGreaterThan(0);
      expect(product.category.name).toBeTruthy();
    }
  });

  test('a product from the list can be fetched by id', async ({ api }) => {
    const { data } = await api.products({ page: 1 });
    const expected = data[0];

    const actual = await api.product(expected.id);

    expect(actual.id).toBe(expected.id);
    expect(actual.name).toBe(expected.name);
    expect(actual.price).toBeCloseTo(expected.price, 2);
  });

  test('unknown id returns 404 rather than an empty 200', async ({ request }) => {
    const response = await request.get(`${env.apiURL}/products/00000000000000000000000000`);

    expect(response.status()).toBe(404);
  });
});
