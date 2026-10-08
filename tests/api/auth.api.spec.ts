import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/config/env';

test.describe('auth API', () => {
  test('valid credentials return a token', async ({ api }) => {
    const token = await api.login(env.customer.email, env.customer.password);

    expect(token.split('.')).toHaveLength(3);
  });

  test('wrong password is rejected and leaks nothing useful', async ({ request }) => {
    const response = await request.post(`${env.apiURL}/users/login`, {
      data: { email: env.customer.email, password: 'definitely-not-it' },
    });

    expect(response.status()).toBe(401);
    expect(JSON.stringify(await response.json())).not.toContain(env.customer.password);
  });
});
