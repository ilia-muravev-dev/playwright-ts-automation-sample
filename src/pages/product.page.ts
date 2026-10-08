import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  protected readonly path = '/product';
  protected readonly anchor = this.page.getByTestId('add-to-cart');

  constructor(page: Page) {
    super(page);
  }

  get name(): Locator {
    return this.page.getByTestId('product-name');
  }

  get unitPrice(): Locator {
    return this.page.getByTestId('unit-price');
  }

  private get quantity(): Locator {
    return this.page.getByTestId('quantity');
  }

  private get increaseQuantity(): Locator {
    return this.page.getByTestId('increase-quantity');
  }

  private get addToCart(): Locator {
    return this.page.getByTestId('add-to-cart');
  }

  get cartBadge(): Locator {
    return this.page.getByTestId('cart-quantity');
  }

  async setQuantity(value: number): Promise<void> {
    await this.quantity.fill(String(value));
  }

  async increaseQuantityBy(times: number): Promise<void> {
    for (let i = 0; i < times; i++) await this.increaseQuantity.click();
  }

  async addToCartAndExpectBadge(expected: number): Promise<void> {
    await this.addToCart.click();
    await expect(this.cartBadge).toHaveText(String(expected));
  }
}
