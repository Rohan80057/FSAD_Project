package com.apex.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for non-browser APIs or handle it properly
                .authorizeHttpRequests(auth -> auth
                        // .requestMatchers("/api/public/**", "/error").permitAll() // Public endpoints
                        .anyRequest().permitAll() // TEMPORARY: Allow all requests for testing
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {
                })); // Enable JWT validation

        return http.build();
    }
}
