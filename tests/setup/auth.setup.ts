import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { env } from '../../src/config/env';

/** The only place that signs in through the UI. */
setup('authenticate as customer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.loginAndWaitForAccount(env.customer.email, env.customer.password);

  await expect(page.getByTestId('nav-menu')).toBeVisible();
  await page.context().storageState({ path: env.storageStatePath });
});
