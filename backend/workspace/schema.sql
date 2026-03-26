-- Create User table
CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

-- Create Room table
CREATE TABLE room (
    id BIGSERIAL PRIMARY KEY,
    room_name VARCHAR(255),
    capacity INT,
    location VARCHAR(255)
);

-- Create Booking table
CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    room_id BIGINT,
    date DATE,
    start_time TIME,
    end_time TIME,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE
);
