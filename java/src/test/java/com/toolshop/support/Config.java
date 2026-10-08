package com.toolshop.support;

/** Single place that reads the environment, with defaults for a fresh clone. */
public final class Config {

    public static final String BASE_URL = env("BASE_URL", "https://practicesoftwaretesting.com");
    public static final String API_URL = env("API_URL", "https://api.practicesoftwaretesting.com");
    public static final String CUSTOMER_EMAIL = env("CUSTOMER_EMAIL", "customer@practicesoftwaretesting.com");
    public static final String CUSTOMER_PASSWORD = env("CUSTOMER_PASSWORD", "welcome01");
    public static final boolean HEADLESS = Boolean.parseBoolean(env("HEADLESS", "true"));

    private Config() {
    }

    private static String env(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }
}
