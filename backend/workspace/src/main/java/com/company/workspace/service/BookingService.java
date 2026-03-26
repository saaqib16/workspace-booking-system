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

    public boolean isRoomAvailable(Long roomId, LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(roomId, date, startTime, endTime);
        return overlaps.isEmpty();
    }

    public Booking bookRoom(Booking booking) {
        if (booking.getStartTime().isAfter(booking.getEndTime()) || booking.getStartTime().equals(booking.getEndTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        if (!isRoomAvailable(booking.getRoomId(), booking.getDate(), booking.getStartTime(), booking.getEndTime())) {
            throw new RuntimeException("Room is already booked for this time slot!");
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
