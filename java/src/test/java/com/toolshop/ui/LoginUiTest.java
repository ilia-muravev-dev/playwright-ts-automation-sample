package com.toolshop.ui;

import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.toolshop.pages.LoginPage;
import com.toolshop.support.Config;
import com.toolshop.support.UiTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

@Tag("ui")
class LoginUiTest extends UiTest {

    @Test
    @DisplayName("valid credentials take the customer to the account page")
    void validCredentialsReachAccount() {
        withGuestPage(guest -> {
            new LoginPage(guest).open().signIn(Config.CUSTOMER_EMAIL, Config.CUSTOMER_PASSWORD);
            assertThat(guest).hasURL(java.util.regex.Pattern.compile("/account$"));
        });
    }

    @ParameterizedTest(name = "{0} keeps the user on the login page")
    @CsvSource({
            "wrong password, customer@practicesoftwaretesting.com, definitely-not-it",
            "unknown email, no-such-user@example.com, welcome01"
    })
    void invalidCredentialsStayOnLogin(String label, String email, String password) {
        withGuestPage(guest -> {
            LoginPage loginPage = new LoginPage(guest).open();
            loginPage.submit(email, password);
            assertThat(loginPage.error()).isVisible();
            assertThat(guest).hasURL(java.util.regex.Pattern.compile("/auth/login$"));
        });
    }

    /** These tests are about signing in, so they must not inherit the session. */
    private void withGuestPage(java.util.function.Consumer<Page> body) {
        try (BrowserContext guest = page.context().browser().newContext()) {
            body.accept(guest.newPage());
        }
    }
}
