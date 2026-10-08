# UI and API test automation: TypeScript and Java

A working test suite against a public demo shop, written the way I would set it up on a real project, in two stacks side by side:

- **TypeScript** with Playwright Test
- **Java** with JUnit 5, REST Assured and Playwright for Java

The target is [practicesoftwaretesting.com](https://practicesoftwaretesting.com), an Angular SPA with a documented REST API, so both suites cover the browser and the API of the same system. Twenty-four tests in total, green on every push and on a nightly schedule.

## Running it

TypeScript:

```bash
npm ci
npx playwright install chromium
npm test              # everything
npm run test:ui       # browser tests only
npm run test:api      # API tests only, no browser needed
npm run report        # open the HTML report
```

Java:

```bash
cd java
./mvnw test                   # everything
./mvnw test -Dgroups=api      # API tests only
./mvnw test -Dgroups=ui       # browser tests only
```

Both read the same environment variables, with defaults that let a fresh clone run immediately. See [.env.example](.env.example).

## What it demonstrates

**Login happens once, not in every test.** In TypeScript a `setup` project signs in through the UI and saves the session with `storageState`; the UI projects depend on it and start already authenticated. In Java the same idea lives in a base class: the first UI class to run signs in and writes the storage state, every context after that is created from the file. Tests that are actually about login opt out explicitly and open a clean context.

**Test data comes from the API, not from clicking around.** The cart test asks the API for a purchasable product and navigates straight to it, so it does not depend on what happens to be first in the catalogue today, and a failure points at the cart rather than at the fixture.

**Page objects expose intent, not elements.** Locators stay private; the public surface is `signIn()`, `search()`, `addToCartExpectingBadge()`. Shared behaviour sits in a base: opening, an anchor per page that proves the page really rendered, and expanding the collapsed navbar on narrow viewports so the same specs run on both form factors.

**Waiting is explicit and never a sleep.** The application answers before Angular re-renders, so list assertions use `expect.poll` and settle on the rendered state. There is no `waitForTimeout` anywhere in the repository.

**Selectors are stable by construction.** The application is marked up with `data-test`, so both stacks set the test id attribute accordingly and everything goes through `getByTestId`. No CSS paths that break on a restyle.

**Money is not compared as a float.** `14.15 * 3` is `42.449999999999996` in both languages, so the expected line total is computed in cents in TypeScript and with `BigDecimal` in Java. A test that passes only because the API happened to return a round price is a test that will fail next week.

## Layout

```
src/                     TypeScript
  config/env.ts          environment variables in one place
  pages/                 page objects, BasePage holds the shared behaviour
  api/api-client.ts      typed wrapper over Playwright's request context
  fixtures/test.ts       extended test: pages and the API client arrive ready
tests/
  setup/                 UI login, saves storage state
  ui/ api/               browser and API specs

java/
  pom.xml                JUnit 5, REST Assured, AssertJ, Playwright for Java
  src/test/java/com/toolshop/
    support/             Config, ApiClient, UiTest base class
    pages/               page objects
    api/ ui/             tests tagged @api and @ui
```

## Projects and tags

| Stack | Scope | How it is selected |
|---|---|---|
| TypeScript | `setup`, `ui`, `ui-mobile`, `api` | Playwright projects, `--project=` |
| Java | API, UI | JUnit tags, `-Dgroups=api` or `-Dgroups=ui` |

The TypeScript mobile project deliberately runs a subset, tagged `@mobile`. Below the desktop breakpoint this demo application does not render the product grid at all, which is the application's own behaviour rather than a test problem, so the mobile run covers login and the cart while the full catalogue suite stays on desktop. Scoping is by tag rather than by file, so moving a test between the two is a one-word change.

Playwright objects are not thread safe, so the Java UI tests run on a single thread while the API classes opt into concurrency with `@Execution(CONCURRENT)`.

## CI

[GitHub Actions](.github/workflows/e2e.yml) runs both stacks as separate jobs on every push and pull request, plus nightly to catch breakage coming from the application rather than from this repository. Browsers and Maven dependencies are cached, JUnit XML is published into the run summary so a failure is readable without downloading anything, and reports are kept as artifacts for fourteen days.

One thing worth calling out, because it is the kind of problem that shows up on real projects. The demo site sits behind Cloudflare, and from GitHub-hosted runners it sometimes answers with a bot-verification page instead of the application. The API host is not affected. Rather than leaving a red tick that means nothing or hiding it behind `continue-on-error`, each job probes the UI host first and skips the browser tests with a note in the run summary when the challenge is served. API tests always run. Against a self-hosted environment, which is how this would work on a real product, the condition never triggers and everything runs.

Traces, video and screenshots are produced on failure and on the first retry only. Retries are enabled in CI and off locally, so a flake on a shared runner does not fail the pipeline while a genuine local failure stays visible.

## Notes on the target application

It is a public demo, so it is occasionally slow and its data changes. That is the point of the nightly run and of taking test data from the API instead of hard-coding product names. The credentials in `.env.example` are the published demo credentials and are not secret.
