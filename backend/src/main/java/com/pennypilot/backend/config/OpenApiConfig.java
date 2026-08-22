package com.pennypilot.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI pennyPilotOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PennyPilot API")
                        .description("PennyPilot V1 - Core Expense Tracker API Documentation")
                        .version("v1.0"));
    }
}
