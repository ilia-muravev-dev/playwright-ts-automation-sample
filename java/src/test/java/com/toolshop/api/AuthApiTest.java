package com.toolshop.api;

import com.toolshop.support.ApiClient;
import com.toolshop.support.Config;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@Tag("api")
@Execution(ExecutionMode.CONCURRENT)
class AuthApiTest {

    private final ApiClient api = new ApiClient();

    @Test
    @DisplayName("valid credentials return a token")
    void validCredentialsReturnToken() {
        String token = api.login(Config.CUSTOMER_EMAIL, Config.CUSTOMER_PASSWORD);

        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("wrong password is rejected and leaks nothing useful")
    void wrongPasswordIsRejected() {
        String body = api.request()
                .body(Map.of("email", Config.CUSTOMER_EMAIL, "password", "definitely-not-it"))
                .post("/users/login")
                .then().statusCode(401)
                .extract().asString();

        assertThat(body).doesNotContain(Config.CUSTOMER_PASSWORD);
    }
}
