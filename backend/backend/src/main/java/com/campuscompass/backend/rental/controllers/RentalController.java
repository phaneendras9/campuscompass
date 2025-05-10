package com.campuscompass.backend.rental.controllers;

import com.campuscompass.backend.rental.models.Rental;
import com.campuscompass.backend.rental.repositories.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "http://localhost:3000")
public class RentalController {

    @Autowired
    private RentalRepository rentalRepo;

    @Value("${upload.dir}")
    private String uploadDir;

    // ✅ 1. Get all rentals (public)
    @GetMapping
    public ResponseEntity<?> getAllRentals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Rental> rentalPage = rentalRepo.findAll(pageable);
        return ResponseEntity.ok(rentalPage);
    }


    // ✅ 2. Create rental with image upload (ADMIN only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRental(
            @RequestParam String name, // ✅ required
            @RequestParam String address,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) String cost,
            @RequestParam(required = false) String latitude,
            @RequestParam(required = false) String longitude,
            @RequestParam(required = false) String website,
            @RequestParam(required = false) MultipartFile image
    ) {
        String imageUrl = "";

        if (image != null && !image.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                File file = new File(uploadDir + "/" + fileName);
                image.transferTo(file);
                imageUrl = "/uploads/" + fileName;
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
            }
        }

        // ✅ Parse optional values
        double parsedCost = 0.0;
        if (cost != null && !cost.isEmpty()) {
            try {
                parsedCost = Double.parseDouble(cost);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid cost value.");
            }
        }

        Double parsedLatitude = null;
        if (latitude != null && !latitude.isEmpty()) {
            try {
                parsedLatitude = Double.parseDouble(latitude);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid latitude value.");
            }
        }

        Double parsedLongitude = null;
        if (longitude != null && !longitude.isEmpty()) {
            try {
                parsedLongitude = Double.parseDouble(longitude);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid longitude value.");
            }
        }

        // ✅ Create and populate rental object
        Rental rental = new Rental();
        rental.setName(name);
        rental.setAddress(address);
        rental.setType(type);
        rental.setContact(contact);
        rental.setCost(parsedCost);
        rental.setLatitude(parsedLatitude);
        rental.setLongitude(parsedLongitude);
        rental.setWebsiteUrl(website);
        rental.setImageUrl(imageUrl);

        rentalRepo.save(rental);
        return ResponseEntity.ok("Rental created successfully");
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRental(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String cost,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) String latitude,
            @RequestParam(required = false) String longitude,
            @RequestParam(required = false) String websiteUrl,
            @RequestParam(required = false) MultipartFile image
    ) {
        Rental rental = rentalRepo.findById(id).orElse(null);
        if (rental == null) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Update the image if a new one is uploaded
        String imageUrl = rental.getImageUrl(); // default to existing
        if (image != null && !image.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                File file = new File(uploadDir + "/" + fileName);
                image.transferTo(file);
                imageUrl = "/uploads/" + fileName;
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
            }
        }

        // ✅ Safe parsing of optional numeric values
        double parsedCost = 0.0;
        if (cost != null && !cost.isEmpty()) {
            try {
                parsedCost = Double.parseDouble(cost);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid cost value.");
            }
        }

        Double parsedLatitude = null;
        if (latitude != null && !latitude.isEmpty()) {
            try {
                parsedLatitude = Double.parseDouble(latitude);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid latitude value.");
            }
        }

        Double parsedLongitude = null;
        if (longitude != null && !longitude.isEmpty()) {
            try {
                parsedLongitude = Double.parseDouble(longitude);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid longitude value.");
            }
        }

        // ✅ Update rental fields
        rental.setName(name);
        rental.setAddress(address);
        rental.setType(type);
        rental.setCost(parsedCost);
        rental.setContact(contact);
        rental.setLatitude(parsedLatitude);
        rental.setLongitude(parsedLongitude);
        rental.setWebsiteUrl(websiteUrl);
        rental.setImageUrl(imageUrl);

        rentalRepo.save(rental);
        return ResponseEntity.ok("Rental updated successfully");
    }


    // ✅ 4. Delete rental (ADMIN only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRental(@PathVariable Long id) {
        rentalRepo.deleteById(id);
        return ResponseEntity.ok("Rental deleted");
    }
}
