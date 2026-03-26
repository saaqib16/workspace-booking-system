package com.company.workspace.service;

import com.company.workspace.model.Room;
import com.company.workspace.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingService bookingService;

    // Add Room
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    // Get All Rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    // Get Available Rooms for Date Range
    public List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        List<Room> allRooms = roomRepository.findAll();
        return allRooms.stream()
                .filter(room -> bookingService.isRoomAvailable(room.getId(), checkIn, checkOut))
                .collect(Collectors.toList());
    }

    // Delete Room
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}