package com.campusconnect.service;

import com.campusconnect.dto.BookingDtos.*;
import com.campusconnect.entity.Booking;
import com.campusconnect.entity.BookingStatus;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BookingConflictException;
import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.ResourceRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    /**
     * Creates a booking after verifying no PENDING/APPROVED booking overlaps
     * the requested window. Wrapped in a transaction so the "check then
     * insert" sequence is atomic under the DB's transaction isolation level.
     * Combined with @Version optimistic locking on Booking/Resource, this
     * protects against two users racing for the same slot.
     */
    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException("endTime must be after startTime");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = resourceRepository.findById(request.resourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                resource.getId(), request.startTime(), request.endTime());

        if (!overlaps.isEmpty()) {
            throw new BookingConflictException(
                    "This resource is already booked for an overlapping time slot.");
        }

        BookingStatus initialStatus = resource.isRequiresApproval()
                ? BookingStatus.PENDING
                : BookingStatus.APPROVED;

        Booking booking = Booking.builder()
                .resource(resource)
                .bookedBy(user)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .purpose(request.purpose())
                .status(initialStatus)
                .build();

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional
    public BookingResponse updateStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Re-check for conflicts only when approving, in case another
        // overlapping booking was approved in the meantime.
        if (newStatus == BookingStatus.APPROVED) {
            List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                    booking.getResource().getId(), booking.getStartTime(), booking.getEndTime());
            overlaps.removeIf(b -> b.getId().equals(booking.getId()));
            if (!overlaps.isEmpty()) {
                throw new BookingConflictException(
                        "Cannot approve: an overlapping booking already exists.");
            }
        }

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getBookedBy().getEmail().equals(userEmail)) {
            throw new SecurityException("Cannot cancel another user's booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        // Cancelling frees the slot automatically: findOverlappingBookings
        // only matches PENDING/APPROVED, so the next user can book it.
    }

    public List<BookingResponse> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByBookedById(user.getId())
                .stream().map(this::toResponse).toList();
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getResource().getId(),
                b.getResource().getName(),
                b.getBookedBy().getFullName(),
                b.getStartTime(),
                b.getEndTime(),
                b.getStatus(),
                b.getPurpose()
        );
    }
}
