package com.company.workspace.service;

import com.company.workspace.model.Booking;
import com.company.workspace.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public boolean isRoomAvailable(Long roomId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(roomId, startDateTime, endDateTime);
        return overlaps.isEmpty();
    }

    public Booking bookRoom(Booking booking) {
        if (booking.getStartDateTime() == null || booking.getEndDateTime() == null) {
            throw new RuntimeException("Start and end date-time are required.");
        }
        if (!booking.getStartDateTime().isBefore(booking.getEndDateTime())) {
            throw new RuntimeException("End date-time must be after start date-time.");
        }
        if (!isRoomAvailable(booking.getRoomId(), booking.getStartDateTime(), booking.getEndDateTime())) {
            throw new RuntimeException("Room is already booked for this time slot!");
        }
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}
