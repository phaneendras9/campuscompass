package com.campuscompass.backend.rental.repositories;

import com.campuscompass.backend.rental.models.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepository extends JpaRepository<Rental, Long> {
}
