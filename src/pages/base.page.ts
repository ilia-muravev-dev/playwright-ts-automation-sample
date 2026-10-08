import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected abstract readonly path: string;

  /** Proves the page is rendered, not merely navigated to. */
  protected abstract readonly anchor: Locator;

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.anchor).toBeVisible();
  }

  get userMenu(): Locator {
    return this.page.getByTestId('nav-menu');
  }

  /** Narrow viewports collapse the navbar; specs should not care. */
  protected async expandNavbarIfCollapsed(): Promise<void> {
    const toggler = this.page.locator('.navbar-toggler');
    if (await toggler.isVisible() && !(await this.userMenu.isVisible())) {
      await toggler.click();
      await expect(this.userMenu).toBeVisible();
    }
  }

  async signOut(): Promise<void> {
    await this.userMenu.click();
    await this.page.getByTestId('nav-sign-out').click();
    await expect(this.page.getByTestId('nav-sign-in')).toBeVisible();
  }
}
