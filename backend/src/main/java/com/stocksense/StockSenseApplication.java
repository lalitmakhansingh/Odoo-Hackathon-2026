package com.stocksense;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
        "com.stocksense",
        "com.stocksense_backend"
})
@EnableJpaRepositories(basePackages = {
        "com.stocksense",
        "com.stocksense_backend"
})
@EntityScan(basePackages = {
        "com.stocksense",
        "com.stocksense_backend"
})
public class StockSenseApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockSenseApplication.class, args);
    }
}