package com.crm.points.config;

import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            if (response.status() == 404) {
                return new RuntimeException(
                    "Ressource introuvable dans le service distant: " + methodKey);
            }
            if (response.status() == 503) {
                return new RuntimeException(
                    "Service distant indisponible: " + methodKey);
            }
            return new RuntimeException(
                "Erreur du service distant [" + response.status() + "]: " + methodKey);
        };
    }
}
