import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  protected readonly path = '/';
  protected readonly anchor = this.page.getByTestId('search-query');

  constructor(page: Page) {
    super(page);
  }

  get products(): Locator {
    return this.page.getByTestId('product-name');
  }

  /** The grid arrives with a request, so waiting for the form is not enough. */
  async expectLoaded(): Promise<void> {
    await this.expandFiltersIfCollapsed();
    await super.expectLoaded();
    await expect(this.products.first()).toBeVisible();
  }

  /** data-test="filters" marks both the toggle and the panel, hence the tag. */
  private async expandFiltersIfCollapsed(): Promise<void> {
    const toggle = this.page.locator('button[data-test="filters"]');
    if (!(await toggle.isVisible())) return;
    if (await this.searchInput.isVisible()) return;
    await toggle.click();
    await expect(this.searchInput).toBeVisible();
  }

  private get searchInput(): Locator {
    return this.page.getByTestId('search-query');
  }

  private get searchButton(): Locator {
    return this.page.getByTestId('search-submit');
  }

  get sortSelect(): Locator {
    return this.page.getByTestId('sort');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/products') && r.ok()),
      this.searchButton.click(),
    ]);
  }

  async openProduct(name: string): Promise<void> {
    await this.products.filter({ hasText: name }).first().click();
    await this.page.waitForURL(/\/product\//);
  }

  async names(): Promise<string[]> {
    return (await this.products.allTextContents()).map((n) => n.trim());
  }

  /** The response lands before Angular re-renders, so assert on the settled list. */
  async expectEveryProductMatches(fragment: string): Promise<void> {
    await expect
      .poll(async () => {
        const names = await this.names();
        return names.length > 0 && names.every((n) => n.toLowerCase().includes(fragment.toLowerCase()));
      }, { message: `every product name should contain "${fragment}"` })
      .toBe(true);
  }

  async expectSortedByName(): Promise<void> {
    await expect
      .poll(async () => {
        const names = await this.names();
        return names.length > 0 && JSON.stringify(names) === JSON.stringify([...names].sort((a, b) => a.localeCompare(b)));
      }, { message: 'product names should be in alphabetical order' })
      .toBe(true);
  }
}
