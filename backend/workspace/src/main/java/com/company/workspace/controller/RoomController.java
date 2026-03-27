package com.company.workspace.controller;

import com.company.workspace.model.Room;
import com.company.workspace.service.BookingService;
import com.company.workspace.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    // Add Room
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    // Get All Rooms
    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    // Delete Room
    @DeleteMapping("/{id}")
    public String deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return "Room deleted successfully";
    }

    // Get Available Rooms for a DateTime range
    @GetMapping("/available")
    public List<Room> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime) {
        return roomService.getAvailableRooms(startDateTime, endDateTime);
    }

    // Check Room Availability
    @GetMapping("/{id}/availability")
    public Map<String, Boolean> checkRoomAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime) {
        boolean isAvailable = bookingService.isRoomAvailable(id, startDateTime, endDateTime);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", isAvailable);
        return response;
    }
}