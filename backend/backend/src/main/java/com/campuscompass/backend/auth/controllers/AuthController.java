package com.campuscompass.backend.auth.controllers;

import com.campuscompass.backend.auth.dtos.AuthRequest;
import com.campuscompass.backend.auth.dtos.RegisterRequest;
import com.campuscompass.backend.auth.models.User;
import com.campuscompass.backend.auth.repositories.UserRepository;
import com.campuscompass.backend.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000") // Add CORS if calling from frontend
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("STUDENT");

        userRepo.save(user);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        // ✅ Return structured data (safe to expose)
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole()); // assuming it's a string
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

}
