package com.campusconnect.controller;

import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    // Resource utilization: how many approved bookings per resource.
    // Backs the "most-used resources" chart on the admin dashboard.
    @GetMapping("/utilization")
    public List<Map<String, Object>> utilization() {
        return bookingRepository.findResourceUtilizationCounts().stream()
                .map(row -> {
                    Long resourceId = (Long) row[0];
                    Long count = (Long) row[1];
                    String name = resourceRepository.findById(resourceId)
                            .map(r -> r.getName()).orElse("Unknown");
                    return Map.<String, Object>of(
                            "resourceId", resourceId,
                            "resourceName", name,
                            "approvedBookings", count
                    );
                })
                .toList();
    }
}
