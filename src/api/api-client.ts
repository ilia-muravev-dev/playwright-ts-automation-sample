import { APIRequestContext, expect } from '@playwright/test';
import { env } from '../config/env';

export type Product = {
  id: string;
  name: string;
  price: number;
  is_rental: boolean;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
};

export type Paginated<T> = {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
};

/** Keeps status checks and JSON casts out of the tests. */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(email: string, password: string): Promise<string> {
    const response = await this.request.post(`${env.apiURL}/users/login`, {
      data: { email, password },
    });
    expect(response.ok(), `login failed: ${response.status()}`).toBeTruthy();
    const body = (await response.json()) as { access_token: string };
    return body.access_token;
  }

  async products(params: Record<string, string | number> = {}): Promise<Paginated<Product>> {
    const response = await this.request.get(`${env.apiURL}/products`, { params });
    expect(response.ok(), `products failed: ${response.status()}`).toBeTruthy();
    return (await response.json()) as Paginated<Product>;
  }

  async product(id: string): Promise<Product> {
    const response = await this.request.get(`${env.apiURL}/products/${id}`);
    expect(response.ok(), `product failed: ${response.status()}`).toBeTruthy();
    return (await response.json()) as Product;
  }

  async anyProduct(): Promise<Product> {
    const page = await this.products({ page: 1 });
    const product = page.data.find((p) => !p.is_rental);
    if (!product) throw new Error('no purchasable product returned by the API');
    return product;
  }
}
