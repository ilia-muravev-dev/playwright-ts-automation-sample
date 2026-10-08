import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  protected readonly path = '/checkout';
  protected readonly anchor = this.page.getByTestId('proceed-1');

  constructor(page: Page) {
    super(page);
  }

  get rows(): Locator {
    return this.page.locator('tbody tr');
  }

  title(index = 0): Locator {
    return this.page.getByTestId('product-title').nth(index);
  }

  quantity(index = 0): Locator {
    return this.page.getByTestId('product-quantity').nth(index);
  }

  linePrice(index = 0): Locator {
    return this.page.getByTestId('line-price').nth(index);
  }

  get total(): Locator {
    return this.page.getByTestId('cart-total');
  }

  async expectSingleLine(name: string, quantity: number): Promise<void> {
    await expect(this.rows).toHaveCount(1);
    await expect(this.title()).toContainText(name);
    await expect(this.quantity()).toHaveValue(String(quantity));
  }
}
