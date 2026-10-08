function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export const env = {
  baseURL: required('BASE_URL', 'https://practicesoftwaretesting.com'),
  apiURL: required('API_URL', 'https://api.practicesoftwaretesting.com'),

  customer: {
    email: required('CUSTOMER_EMAIL', 'customer@practicesoftwaretesting.com'),
    password: required('CUSTOMER_PASSWORD', 'welcome01'),
  },

  /** Written by the setup project, consumed by the UI projects. */
  storageStatePath: '.auth/customer.json',

  isCI: !!process.env.CI,
} as const;
