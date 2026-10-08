package com.toolshop.api;

import com.toolshop.support.ApiClient;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@Tag("api")
@Execution(ExecutionMode.CONCURRENT)
class ProductsApiTest {

    private final ApiClient api = new ApiClient();

    @Test
    @DisplayName("first page comes back paginated and well formed")
    void firstPageIsWellFormed() {
        var response = api.request().queryParam("page", 1).get("/products").then().statusCode(200);

        assertThat((int) response.extract().path("current_page")).isEqualTo(1);

        List<Map<String, Object>> products = response.extract().path("data");
        int perPage = response.extract().path("per_page");
        assertThat(products).isNotEmpty().hasSizeLessThanOrEqualTo(perPage);
        assertThat(products).allSatisfy(product -> {
            assertThat(product.get("id")).isInstanceOf(String.class);
            assertThat(product.get("name")).isInstanceOf(String.class);
            assertThat(((Number) product.get("price")).doubleValue()).isPositive();
        });
    }

    @Test
    @DisplayName("a product from the list can be fetched by id")
    void productCanBeFetchedById() {
        String id = api.request().queryParam("page", 1).get("/products")
                .then().statusCode(200).extract().path("data[0].id");

        api.request().get("/products/" + id)
                .then().statusCode(200)
                .body("id", org.hamcrest.Matchers.equalTo(id));
    }

    @Test
    @DisplayName("unknown id returns 404 rather than an empty 200")
    void unknownIdReturns404() {
        api.request().get("/products/00000000000000000000000000").then().statusCode(404);
    }
}
