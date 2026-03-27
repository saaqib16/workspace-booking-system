package com.company.workspace.service;

import com.company.workspace.model.Room;
import com.company.workspace.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    // Get Available Rooms for a DateTime range
    public List<Room> getAvailableRooms(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Room> allRooms = roomRepository.findAll();
        return allRooms.stream()
                .filter(room -> bookingService.isRoomAvailable(room.getId(), startDateTime, endDateTime))
                .collect(Collectors.toList());
    }

    // Delete Room
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}