const API_BASE = "/api";

// Load rooms
async function loadRooms() {

    const response = await fetch(`${API_BASE}/rooms`);
    const rooms = await response.json();

    const roomList = document.getElementById("roomList");
    roomList.innerHTML = "";

    rooms.forEach(room => {

        const li = document.createElement("li");
        li.className = "list-group-item";

        li.innerText = `ID: ${room.id} | ${room.roomName} (${room.capacity}) - ${room.location}`;

        roomList.appendChild(li);
    });
}

// Handle booking
document.getElementById("bookingForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const booking = {
        userId: document.getElementById("userId").value,
        roomId: document.getElementById("roomId").value,
        date: document.getElementById("date").value,
        startTime: document.getElementById("startTime").value + ":00",
        endTime: document.getElementById("endTime").value + ":00"
    };

    try {
        const response = await fetch(`${API_BASE}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.message || JSON.stringify(err));
            return;
        }

        alert("Booking Successful ✅");

    } catch (err) {
        alert("Error connecting to server ❌");
    }
});

// Load rooms on page load
loadRooms();
