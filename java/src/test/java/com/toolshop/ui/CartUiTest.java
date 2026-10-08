package com.toolshop.ui;

import com.toolshop.pages.CartPage;
import com.toolshop.pages.ProductPage;
import com.toolshop.support.ApiClient;
import com.toolshop.support.UiTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

@Tag("ui")
class CartUiTest extends UiTest {

    private final ApiClient api = new ApiClient();

    @Test
    @DisplayName("adding a product with quantity shows the right line in the cart")
    void addingProductShowsCartLine() {
        ApiClient.Product product = api.anyPurchasableProduct();
        int quantity = 3;

        ProductPage productPage = new ProductPage(page).open(product.id());
        assertThat(productPage.name()).containsText(product.name());
        productPage.setQuantity(quantity).addToCartExpectingBadge(quantity);

        CartPage cart = new CartPage(page).open();
        cart.expectSingleLine(product.name(), quantity);
        String expectedLine = product.price()
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(2, RoundingMode.HALF_UP)
                .toPlainString();
        assertThat(cart.linePrice()).containsText(expectedLine);
    }
}
