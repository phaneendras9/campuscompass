package com.campuscompass.backend.transport;

import com.campuscompass.backend.transport.models.TransportInfo;
import com.campuscompass.backend.transport.repositories.TransportInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport")
@CrossOrigin
public class TransportInfoController {

    @Autowired
    private TransportInfoRepository repo;

    // ✅ Get all transport services
    @GetMapping
    public List<TransportInfo> getAllServices() {
        return repo.findAll();
    }

    // ✅ Get by dynamic type (e.g., /api/transport/type/BUS)
    @GetMapping("/type/{type}")
    public List<TransportInfo> getByType(@PathVariable String type) {
        return repo.findByTransportType(type.toUpperCase());
    }

    // ✅ Named aliases (optional for frontend clarity)
    @GetMapping("/bus-services")
    public List<TransportInfo> getBusServices() {
        return repo.findByTransportType("BUS");
    }

    @GetMapping("/cab-services")
    public List<TransportInfo> getCabServices() {
        return repo.findByTransportType("CAB");
    }

    // ✅ Add new service
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public TransportInfo addService(@RequestBody TransportInfo service) {
        return repo.save(service);
    }

    // ✅ Update existing service
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public TransportInfo updateService(@PathVariable Long id, @RequestBody TransportInfo updated) {
        updated.setId(id);
        return repo.save(updated);
    }

    // ✅ Delete service
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteService(@PathVariable Long id) {
        repo.deleteById(id);
    }
    @GetMapping("/routes")
    public List<String> getAllRoutes() {
        return repo.findDistinctRoutes();
    }

}
