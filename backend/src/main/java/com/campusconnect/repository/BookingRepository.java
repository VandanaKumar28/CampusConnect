package com.campusconnect.repository;

import com.campusconnect.entity.Booking;
import com.campusconnect.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByBookedById(Long userId);

    List<Booking> findByResourceIdAndStatus(Long resourceId, BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);

    /**
     * Core conflict-detection query. Two time ranges [s1,e1) and [s2,e2)
     * overlap iff s1 < e2 AND s2 < e1. We only check against bookings that
     * are still "live" (PENDING or APPROVED) — cancelled/rejected slots
     * are free to reuse.
     */
    @Query("""
           SELECT b FROM Booking b
           WHERE b.resource.id = :resourceId
             AND b.status IN (com.campusconnect.entity.BookingStatus.PENDING,
                               com.campusconnect.entity.BookingStatus.APPROVED)
             AND b.startTime < :endTime
             AND b.endTime > :startTime
           """)
    List<Booking> findOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("""
           SELECT b.resource.id, COUNT(b) FROM Booking b
           WHERE b.status = com.campusconnect.entity.BookingStatus.APPROVED
           GROUP BY b.resource.id
           ORDER BY COUNT(b) DESC
           """)
    List<Object[]> findResourceUtilizationCounts();
}
