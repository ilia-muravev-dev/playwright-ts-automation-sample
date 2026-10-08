package com.toolshop.support;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.toolshop.pages.LoginPage;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Browser lifecycle for UI tests. The customer signs in through the UI once per
 * run; every test after that starts from the saved storage state.
 */
public abstract class UiTest {

    private static final Path STORAGE_STATE = Path.of("target", "storage-state.json");

    private static Playwright playwright;
    private static Browser browser;

    protected BrowserContext context;
    protected Page page;

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        // The application is marked up with data-test, not data-testid.
        playwright.selectors().setTestIdAttribute("data-test");
        browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(Config.HEADLESS));
        if (!Files.exists(STORAGE_STATE)) {
            signInAndSaveState();
        }
    }

    @AfterAll
    static void closeBrowser() {
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }

    @BeforeEach
    void openContext() {
        context = browser.newContext(new Browser.NewContextOptions().setStorageStatePath(STORAGE_STATE));
        page = context.newPage();
    }

    @AfterEach
    void closeContext() {
        if (context != null) context.close();
    }

    private static void signInAndSaveState() {
        try (BrowserContext fresh = browser.newContext()) {
            Page signInPage = fresh.newPage();
            new LoginPage(signInPage)
                    .open()
                    .signIn(Config.CUSTOMER_EMAIL, Config.CUSTOMER_PASSWORD);
            fresh.storageState(new BrowserContext.StorageStateOptions().setPath(STORAGE_STATE));
        }
    }
}
