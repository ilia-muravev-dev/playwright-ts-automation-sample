package com.toolshop.pages;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.Locator;
import com.toolshop.support.Config;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public final class LoginPage {

    private final Page page;

    public LoginPage(Page page) {
        this.page = page;
    }

    public LoginPage open() {
        page.navigate(Config.BASE_URL + "/auth/login");
        assertThat(form()).isVisible();
        return this;
    }

    public void signIn(String email, String password) {
        page.getByTestId("email").fill(email);
        page.getByTestId("password").fill(password);
        page.getByTestId("login-submit").click();
        page.waitForURL("**/account");
        assertThat(page.getByTestId("nav-menu")).isVisible();
    }

    public void submit(String email, String password) {
        page.getByTestId("email").fill(email);
        page.getByTestId("password").fill(password);
        page.getByTestId("login-submit").click();
    }

    public Locator error() {
        return page.locator(".alert-danger, [data-test=\"login-error\"]");
    }

    private Locator form() {
        return page.getByTestId("login-form");
    }
}
