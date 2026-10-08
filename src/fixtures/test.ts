import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { CatalogPage } from '../pages/catalog.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { ApiClient } from '../api/api-client';

type Fixtures = {
  loginPage: LoginPage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  api: ApiClient;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect };
