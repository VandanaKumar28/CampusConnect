package com.campusconnect.controller;

import com.campusconnect.dto.BookingDtos.*;
import com.campusconnect.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request,
                                                    Authentication auth) {
        return ResponseEntity.ok(bookingService.createBooking(auth.getName(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingResponse>> myBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getMyBookings(auth.getName()));
    }

    // Admin-only: queue of bookings awaiting approval
    @GetMapping("/pending")
    public ResponseEntity<List<BookingResponse>> pending() {
        return ResponseEntity.ok(bookingService.getPendingBookings());
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication auth) {
        bookingService.cancelBooking(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // Admin-only: approve/reject a pending booking
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long id,
                                                          @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request.status()));
    }
}
