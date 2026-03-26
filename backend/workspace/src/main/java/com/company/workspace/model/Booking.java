package com.company.workspace.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private java.time.LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private java.time.LocalTime endTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public java.time.LocalTime getStartTime() { return startTime; }
    public void setStartTime(java.time.LocalTime startTime) { this.startTime = startTime; }

    public java.time.LocalTime getEndTime() { return endTime; }
    public void setEndTime(java.time.LocalTime endTime) { this.endTime = endTime; }
}
