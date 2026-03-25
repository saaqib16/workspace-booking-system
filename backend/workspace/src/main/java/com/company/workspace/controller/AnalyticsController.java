package com.company.workspace.controller;

import com.company.workspace.model.Booking;
import com.company.workspace.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public Map<String, Object> getAnalytics() {

        List<Booking> bookings = bookingService.getAllBookings();

        Map<Long, Integer> roomCount = new HashMap<>();

        // Count bookings per room
        for (Booking b : bookings) {
            roomCount.put(
                    b.getRoomId(),
                    roomCount.getOrDefault(b.getRoomId(), 0) + 1
            );
        }

        // Find most used room
        Long mostUsedRoom = null;
        int max = 0;

        for (Map.Entry<Long, Integer> entry : roomCount.entrySet()) {
            if (entry.getValue() > max) {
                max = entry.getValue();
                mostUsedRoom = entry.getKey();
            }
        }

        Map<String, Object> result = new HashMap<>();

        result.put("totalBookings", bookings.size());
        result.put("mostUsedRoom", mostUsedRoom);
        result.put("roomUsage", roomCount);

        return result;
    }
}