import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/config/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('login', () => {
  test('valid credentials take the customer to the account page', { tag: '@mobile' }, async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.loginAndWaitForAccount(env.customer.email, env.customer.password);

    await expect(page).toHaveURL(/\/account$/);
  });

  const invalid = [
    { title: 'wrong password', email: env.customer.email, password: 'definitely-not-it' },
    { title: 'unknown email', email: 'no-such-user@example.com', password: env.customer.password },
  ];

  for (const data of invalid) {
    test(`${data.title} keeps the user on the login page`, async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(data.email, data.password);

      await expect(loginPage.error).toBeVisible();
      await expect(page).toHaveURL(/\/auth\/login$/);
    });
  }
});
