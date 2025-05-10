// src/main/java/com/campuscompass/backend/controllers/AdminController.java
package com.campuscompass.backend.admin.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')") // ✅ Only ADMINs can access
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok("Welcome to the ADMIN dashboard!");
    }
}
