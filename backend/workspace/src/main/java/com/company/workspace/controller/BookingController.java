package com.company.workspace.controller;

import com.company.workspace.model.Booking;
import com.company.workspace.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create Booking
    @PostMapping
    public Booking bookRoom(@RequestBody Booking booking) {
        return bookingService.bookRoom(booking);
    }

    // View All Bookings
    @GetMapping
    public List<Booking> getBookings() {
        return bookingService.getAllBookings();
    }

    // Get Bookings by User
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingService.getBookingsByUser(userId);
    }

    // Cancel Booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Booking cancelled successfully.");
        return ResponseEntity.ok(response);
    }

    // Validate Booking
    @PostMapping("/validate")
    public Map<String, Boolean> validateBooking(@RequestBody Booking booking) {
        boolean isValid = false;
        try {
            if (booking.getStartDateTime() != null && booking.getEndDateTime() != null
                    && booking.getStartDateTime().isBefore(booking.getEndDateTime())) {
                isValid = bookingService.isRoomAvailable(booking.getRoomId(), booking.getStartDateTime(), booking.getEndDateTime());
            }
        } catch (Exception e) {
            isValid = false;
        }
        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);
        return response;
    }
}
