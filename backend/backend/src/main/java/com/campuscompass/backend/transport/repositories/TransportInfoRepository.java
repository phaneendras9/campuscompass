// File: TransportInfoRepository.java
package com.campuscompass.backend.transport.repositories;

import com.campuscompass.backend.transport.models.TransportInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransportInfoRepository extends JpaRepository<TransportInfo, Long> {


    List<TransportInfo> findByTransportType(String transportType);

    // 🆕 Add this for /routes API
    @Query("SELECT DISTINCT t.routeDetails FROM TransportInfo t")
    List<String> findDistinctRoutes();
}
