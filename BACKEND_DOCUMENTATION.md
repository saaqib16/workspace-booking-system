# Workspace Booking System - Backend Documentation

This document provides a comprehensive overview of the backend for the Workspace Booking System.

## Technology Stack
- **Framework:** Spring Boot
- **Language:** Java
- **Database:** PostgreSQL (via Spring Data JPA)
- **Validation:** Hibernate Validator (Jakarta Bean Validation)
- **CORS:** Enabled for all origins (`@CrossOrigin`)

---

## API Endpoints

### 1. Authentication (`/api/auth`)
Handles user registration and login.

| Endpoint | Method | Request Body | Response Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | `POST` | `RegisterRequest` | `AuthResponse` | Registers a new user. |
| `/login` | `POST` | `LoginRequest` | `AuthResponse` | Authenticates a user. |

**Data Structures:**
- **RegisterRequest:** `name`, `email`, `password`, `role` (optional).
- **LoginRequest:** `email`, `password`.
- **AuthResponse:** `id`, `name`, `email`, `role`.

---

### 2. Room Management (`/api/rooms`)
Handles room-related operations.

| Endpoint | Method | Request Body | Response Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | None | `List<Room>` | Retrieves all rooms. |
| `/` | `POST` | `Room` | `Room` (saved) | Adds a new room. |
| `/{id}` | `DELETE` | None | `String` | Deletes a room by ID. |
| `/available` | `GET` | Query Params: `startDateTime`, `endDateTime` | `List<Room>` | Gets available rooms for a given time range. |
| `/{id}/availability`| `GET` | Query Params: `startDateTime`, `endDateTime` | `{ "available": boolean }` | Checks if a specific room is available. |

---

### 3. Booking Management (`/api/bookings`)
Handles workspace reservations.

| Endpoint | Method | Request Body | Response Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | None | `List<Booking>` | Retrieves all bookings. |
| `/` | `POST` | `Booking` | `Booking` (saved) | Creates a new booking. |
| `/user/{userId}` | `GET` | None | `List<Booking>` | Retrieves bookings for a specific user. |
| `/{id}` | `DELETE` | None | `{ "message": "..." }` | Cancels a booking. |
| `/validate` | `POST` | `Booking` | `{ "valid": boolean }` | Checks if a booking's time slot is valid/available. |

---

### 4. Analytics (`/api/analytics`)
Provides insights into system usage.

| Endpoint | Method | Request Body | Response Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | None | `Map<String, Object>` | Returns total bookings, most used room, and usage count per room. |

---

## Data Models

### User
Represents a system user.
- `id` (Long, Primary Key)
- `name` (String, Not Blank)
- `email` (String, Unique, Email format)
- `password` (String, Not Blank, JSON Ignored)
- `role` (String)

### Room
Represents a workspace or meeting room.
- `id` (Long, Primary Key)
- `roomName` (String, Not Null)
- `capacity` (Integer, Not Null)
- `location` (String)

### Booking
Represents a reservation for a room.
- `id` (Long, Primary Key)
- `userId` (Long)
- `roomId` (Long, Not Null)
- `startDateTime` (LocalDateTime, Not Null)
- `endDateTime` (LocalDateTime, Not Null)

---

## Technical Details

### Time Format
Date and time are handled using `LocalDateTime`. When sending requests, use the ISO 8601 format:
`YYYY-MM-DDTHH:mm:ss` (e.g., `2026-03-30T10:00:00`)

### Base URL
The backend APIs are prefixed with `/api`.
Default local development URL: `http://localhost:8080/api`
