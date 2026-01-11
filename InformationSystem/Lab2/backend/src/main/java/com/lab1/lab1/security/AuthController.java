package com.lab1.lab1.security;

import com.lab1.lab1.security.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final CustomUserDetailsService uds;
    private final JwtService jwt;
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AuthController(AuthenticationManager authManager, CustomUserDetailsService uds,
                          JwtService jwt, UserRepository users, PasswordEncoder encoder) {
        this.authManager = authManager;
        this.uds = uds;
        this.jwt = jwt;
        this.users = users;
        this.encoder = encoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));

        UserDetails ud = uds.loadUserByUsername(req.username());
        AppUser u = users.findByUsername(req.username()).orElseThrow();

        String token = jwt.generateToken(ud, Map.of("role", u.getRole().name()));
        return ResponseEntity.ok(new LoginResponse(token, u.getUsername(), u.getRole().name()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String username = auth.getName();
        AppUser u = users.findByUsername(username).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "username", u.getUsername(),
                "role", u.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (users.existsByUsername(req.username())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        AppUser u = new AppUser();
        u.setUsername(req.username());
        u.setPassword(encoder.encode(req.password()));
        u.setRole(req.role());
        users.save(u);
        return ResponseEntity.ok(Map.of("status", "created"));
    }
}
