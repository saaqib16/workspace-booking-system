package com.company.workspace.controller;

import com.company.workspace.model.Booking;
import com.company.workspace.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Book Room
    @PostMapping
    public Booking bookRoom(@RequestBody Booking booking) {
        return bookingService.bookRoom(booking);
    }

    // View All Bookings
    @GetMapping
    public List<Booking> getBookings() {
        return bookingService.getAllBookings();
    }
}
