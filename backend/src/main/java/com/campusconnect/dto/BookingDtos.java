package com.campusconnect.dto;

import com.campusconnect.entity.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class BookingDtos {

    public record CreateBookingRequest(
            @NotNull Long resourceId,
            @NotNull @Future LocalDateTime startTime,
            @NotNull @Future LocalDateTime endTime,
            String purpose
    ) {}

    public record BookingResponse(
            Long id,
            Long resourceId,
            String resourceName,
            String bookedByName,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BookingStatus status,
            String purpose
    ) {}

    public record UpdateStatusRequest(
            @NotNull BookingStatus status
    ) {}
}
