package com.skillbridge.career;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.skillbridge"})
@EnableJpaRepositories(basePackages = {"com.skillbridge.common.repository"})
@EntityScan(basePackages = {"com.skillbridge.common.model"})
public class CareerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareerServiceApplication.class, args);
    }
}
