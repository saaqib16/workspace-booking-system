package com.company.workspace.repository;

import com.company.workspace.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.roomId = :roomId AND b.startDateTime < :endDateTime AND b.endDateTime > :startDateTime")
    List<Booking> findOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );

    List<Booking> findByUserId(Long userId);
}