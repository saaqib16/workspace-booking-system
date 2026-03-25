package com.company.workspace.service;

import com.company.workspace.model.Booking;
import com.company.workspace.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking bookRoom(Booking booking) {
        if (booking.getStartTime().isAfter(booking.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        List<Booking> existingBookings =
                bookingRepository.findByRoomIdAndDate(
                        booking.getRoomId(),
                        booking.getDate()
                );

        // 🔥 Conflict Check
        for (Booking b : existingBookings) {

            boolean overlap =
                    booking.getStartTime().isBefore(b.getEndTime()) &&
                            booking.getEndTime().isAfter(b.getStartTime());

            if (overlap) {
                throw new RuntimeException("Room already booked for this time slot!");
            }
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
