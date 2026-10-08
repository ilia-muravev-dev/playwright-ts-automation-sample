package com.toolshop.support;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;

import java.math.BigDecimal;
import java.util.Map;

import static io.restassured.RestAssured.given;

/** Request specification and the few calls the tests need. */
public final class ApiClient {

    private final RequestSpecification spec = new RequestSpecBuilder()
            .setBaseUri(Config.API_URL)
            .setAccept(ContentType.JSON)
            .setContentType(ContentType.JSON)
            .build();

    public RequestSpecification request() {
        return given().spec(spec);
    }

    public String login(String email, String password) {
        return request()
                .body(Map.of("email", email, "password", password))
                .post("/users/login")
                .then()
                .statusCode(200)
                .extract()
                .path("access_token");
    }

    /** A product the UI test can open without guessing what the catalogue shows. */
    public Product anyPurchasableProduct() {
        var response = request().queryParam("page", 1).get("/products").then().statusCode(200);
        int index = response.extract().path("data.findAll { it.is_rental == false }.size()");
        if (index == 0) {
            throw new IllegalStateException("the API returned no purchasable products");
        }
        String base = "data.findAll { it.is_rental == false }[0]";
        return new Product(
                response.extract().path(base + ".id"),
                response.extract().path(base + ".name"),
                // Via the string form: the JSON number must not pick up float noise.
                new BigDecimal(String.valueOf((Object) response.extract().path(base + ".price"))));
    }

    public record Product(String id, String name, BigDecimal price) {
    }
}
