package com.campuscompass.backend.dashboard.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @GetMapping
    public ResponseEntity<?> getHomeData() {
        return ResponseEntity.ok("Welcome to your personalized home dashboard!");
    }
}
