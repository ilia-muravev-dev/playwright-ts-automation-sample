package com.toolshop.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.toolshop.support.Config;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public final class ProductPage {

    private final Page page;

    public ProductPage(Page page) {
        this.page = page;
    }

    public ProductPage open(String productId) {
        page.navigate(Config.BASE_URL + "/product/" + productId);
        assertThat(addToCart()).isVisible();
        return this;
    }

    public Locator name() {
        return page.getByTestId("product-name");
    }

    public ProductPage setQuantity(int quantity) {
        page.getByTestId("quantity").fill(String.valueOf(quantity));
        return this;
    }

    /** The header badge updates after the server answers, so assert on it. */
    public void addToCartExpectingBadge(int expected) {
        addToCart().click();
        assertThat(page.getByTestId("cart-quantity")).hasText(String.valueOf(expected));
    }

    private Locator addToCart() {
        return page.getByTestId("add-to-cart");
    }
}
