package com.lab1.lab1.security;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (users.count() == 0) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                users.save(admin);

                AppUser user = new AppUser();
                user.setUsername("user");
                user.setPassword(encoder.encode("user"));
                user.setRole(Role.USER);
                users.save(user);
            }
        };
    }
}
