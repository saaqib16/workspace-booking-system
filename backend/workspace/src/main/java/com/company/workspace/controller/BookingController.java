package com.company.workspace.controller;

import com.company.workspace.model.Booking;
import com.company.workspace.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // 3. Create Booking
    @PostMapping
    public Booking bookRoom(@RequestBody Booking booking) {
        return bookingService.bookRoom(booking);
    }

    // View All Bookings
    @GetMapping
    public List<Booking> getBookings() {
        return bookingService.getAllBookings();
    }

    // 4. Validate Booking
    @PostMapping("/validate")
    public Map<String, Boolean> validateBooking(@RequestBody Booking booking) {
        boolean isValid = false;
        try {
            if (booking.getCheckIn() != null && booking.getCheckOut() != null 
                && booking.getCheckIn().isBefore(booking.getCheckOut())) {
                isValid = bookingService.isRoomAvailable(booking.getRoomId(), booking.getCheckIn(), booking.getCheckOut());
            }
        } catch (Exception e) {
            isValid = false;
        }
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);
        return response;
    }
}
