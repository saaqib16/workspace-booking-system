package com.company.workspace.service;

import com.company.workspace.model.Booking;
import com.company.workspace.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(roomId, checkIn, checkOut);
        return overlaps.isEmpty();
    }

    public Booking bookRoom(Booking booking) {
        if (booking.getCheckIn().isAfter(booking.getCheckOut()) || booking.getCheckIn().isEqual(booking.getCheckOut())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        if (!isRoomAvailable(booking.getRoomId(), booking.getCheckIn(), booking.getCheckOut())) {
            throw new RuntimeException("Room is already booked for these dates!");
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
