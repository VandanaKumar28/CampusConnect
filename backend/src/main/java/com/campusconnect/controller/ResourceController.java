package com.campusconnect.controller;

import com.campusconnect.entity.Resource;
import com.campusconnect.repository.ResourceRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceRepository resourceRepository;

    @GetMapping
    public ResponseEntity<List<Resource>> listActive() {
        return ResponseEntity.ok(resourceRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> get(@PathVariable Long id) {
        return resourceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin-only (enforced by SecurityConfig via /api/admin/** normally;
    // here we additionally guard create/update/delete at the method level
    // for defence in depth)
    @PostMapping
    public ResponseEntity<Resource> create(@Valid @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceRepository.save(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> update(@PathVariable Long id, @Valid @RequestBody Resource updated) {
        return resourceRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setCategory(updated.getCategory());
            existing.setLocation(updated.getLocation());
            existing.setCapacity(updated.getCapacity());
            existing.setRequiresApproval(updated.isRequiresApproval());
            existing.setActive(updated.isActive());
            return ResponseEntity.ok(resourceRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        return resourceRepository.findById(id).map(existing -> {
            existing.setActive(false);
            resourceRepository.save(existing);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
