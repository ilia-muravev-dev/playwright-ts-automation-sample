import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly path = '/auth/login';
  protected readonly anchor = this.page.getByTestId('login-form');

  constructor(page: Page) {
    super(page);
  }

  private get email(): Locator {
    return this.page.getByTestId('email');
  }

  private get password(): Locator {
    return this.page.getByTestId('password');
  }

  private get submit(): Locator {
    return this.page.getByTestId('login-submit');
  }

  get error(): Locator {
    return this.page.locator('.alert-danger, [data-test="login-error"]');
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async loginAndWaitForAccount(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.page.waitForURL('**/account');
    await this.expandNavbarIfCollapsed();
    await expect(this.userMenu).toBeVisible();
  }
}
