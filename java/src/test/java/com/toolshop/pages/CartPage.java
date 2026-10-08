package com.toolshop.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.toolshop.support.Config;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public final class CartPage {

    private final Page page;

    public CartPage(Page page) {
        this.page = page;
    }

    public CartPage open() {
        page.navigate(Config.BASE_URL + "/checkout");
        assertThat(page.getByTestId("proceed-1")).isVisible();
        return this;
    }

    public void expectSingleLine(String productName, int quantity) {
        assertThat(page.locator("tbody tr")).hasCount(1);
        assertThat(page.getByTestId("product-title").first()).containsText(productName);
        assertThat(page.getByTestId("product-quantity").first()).hasValue(String.valueOf(quantity));
    }

    public Locator linePrice() {
        return page.getByTestId("line-price").first();
    }
}
