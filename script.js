// FleetPro - simple browser-based demo
// Data is saved in this browser using localStorage.

var users = JSON.parse(localStorage.getItem("fleetUsers")) || [
    { name: "Administrator", email: "admin@fleetpro.com", password: "admin123", role: "Admin" }
];

var vehicles = JSON.parse(localStorage.getItem("fleetVehicles")) || [];
var drivers = JSON.parse(localStorage.getItem("fleetDrivers")) || [];
var bookings = JSON.parse(localStorage.getItem("fleetBookings")) || [];
var currentUser = null;

// Save all records in this browser.
function saveData() {
    localStorage.setItem("fleetUsers", JSON.stringify(users));
    localStorage.setItem("fleetVehicles", JSON.stringify(vehicles));
    localStorage.setItem("fleetDrivers", JSON.stringify(drivers));
    localStorage.setItem("fleetBookings", JSON.stringify(bookings));
}

// Show a short confirmation message.
function showMessage(text) {
    var box = document.getElementById("message");
    box.textContent = text;
    box.style.display = "block";
    setTimeout(function () {
        box.style.display = "none";
    }, 2500);
}

// Check if the signed-in user can make changes.
function canManage() {
    return currentUser && (currentUser.role === "Admin" || currentUser.role === "Manager");
}

// Login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;
    var foundUser = users.find(function (user) {
        return user.email.toLowerCase() === email && user.password === password;
    });

    if (!foundUser) {
        showMessage("Incorrect email or password.");
        return;
    }

    currentUser = foundUser;
    openApp();
});

// Registration
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("registerName").value.trim();
    var email = document.getElementById("registerEmail").value.trim().toLowerCase();
    var password = document.getElementById("registerPassword").value;
    var role = document.getElementById("registerRole").value;

    if (users.some(function (user) { return user.email.toLowerCase() === email; })) {
        showMessage("An account with this email already exists.");
        return;
    }

    users.push({ name: name, email: email, password: password, role: role });
    saveData();
    document.getElementById("registerForm").reset();
    showMessage("Account created. You can now log in.");
});

// Show the main website after login.
function openApp() {
    document.getElementById("authSection").hidden = true;
    document.getElementById("appSection").hidden = false;
    document.getElementById("userArea").innerHTML =
        "<strong>" + currentUser.name + "</strong> (" + currentUser.role + ") " +
        '<button id="logoutButton" type="button">Logout</button>';

    document.getElementById("logoutButton").addEventListener("click", logout);

    // Drivers can view records and update booking status, but cannot add or delete records.
    document.querySelectorAll(".entry-form").forEach(function (form) {
        form.hidden = !canManage();
    });

    renderAll();
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById("authSection").hidden = false;
    document.getElementById("appSection").hidden = true;
    document.getElementById("userArea").textContent = "";
}

// Add a vehicle
document.getElementById("vehicleForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!canManage()) return;

    vehicles.push({
        id: Date.now(),
        name: document.getElementById("vehicleName").value.trim(),
        number: document.getElementById("vehicleNumber").value.trim().toUpperCase(),
        status: document.getElementById("vehicleStatus").value
    });

    saveData();
    this.reset();
    renderAll();
    showMessage("Vehicle added successfully.");
});

// Add a driver
document.getElementById("driverForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!canManage()) return;

    drivers.push({
        id: Date.now(),
        name: document.getElementById("driverName").value.trim(),
        phone: document.getElementById("driverPhone").value.trim(),
        status: document.getElementById("driverStatus").value
    });

    saveData();
    this.reset();
    renderAll();
    showMessage("Driver added successfully.");
});

// Add a booking
document.getElementById("bookingForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!canManage()) return;

    bookings.push({
        id: Date.now(),
        pickup: document.getElementById("pickup").value.trim(),
        destination: document.getElementById("destination").value.trim(),
        date: document.getElementById("travelDate").value,
        status: document.getElementById("bookingStatus").value
    });

    saveData();
    this.reset();
    renderAll();
    showMessage("Booking created successfully.");
});

// Display all records.
function renderAll() {
    renderVehicles();
    renderDrivers();
    renderBookings();
    renderDashboard();
    renderReport();
}

// Display vehicle records with search.
function renderVehicles() {
    var list = document.getElementById("vehicleList");
    var search = document.getElementById("vehicleSearch").value.toLowerCase();
    list.innerHTML = "";

    vehicles.filter(function (vehicle) {
        return vehicle.name.toLowerCase().includes(search) ||
            vehicle.number.toLowerCase().includes(search);
    }).forEach(function (vehicle) {
        var item = document.createElement("li");
        item.innerHTML = "<span><strong>" + safeText(vehicle.name) + "</strong> - " +
            safeText(vehicle.number) + " | " + safeText(vehicle.status) + "</span>";

        var actions = document.createElement("div");
        actions.className = "record-actions";

        if (canManage()) {
            addActionButton(actions, "Edit", function () { editVehicle(vehicle.id); });
            addActionButton(actions, "Delete", function () { deleteVehicle(vehicle.id); }, true);
        }

        item.appendChild(actions);
        list.appendChild(item);
    });
}

// Display driver records with search.
function renderDrivers() {
    var list = document.getElementById("driverList");
    var search = document.getElementById("driverSearch").value.toLowerCase();
    list.innerHTML = "";

    drivers.filter(function (driver) {
        return driver.name.toLowerCase().includes(search) ||
            driver.phone.toLowerCase().includes(search);
    }).forEach(function (driver) {
        var item = document.createElement("li");
        item.innerHTML = "<span><strong>" + safeText(driver.name) + "</strong> - " +
            safeText(driver.phone) + " | " + safeText(driver.status) + "</span>";

        var actions = document.createElement("div");
        actions.className = "record-actions";

        if (canManage()) {
            addActionButton(actions, "Edit", function () { editDriver(driver.id); });
            addActionButton(actions, "Delete", function () { deleteDriver(driver.id); }, true);
        }

        item.appendChild(actions);
        list.appendChild(item);
    });
}

// Display bookings with search and status filter.
function renderBookings() {
    var list = document.getElementById("bookingList");
    var search = document.getElementById("bookingSearch").value.toLowerCase();
    var filter = document.getElementById("bookingFilter").value;
    list.innerHTML = "";

    bookings.filter(function (booking) {
        var matchesText = (booking.pickup + " " + booking.destination).toLowerCase().includes(search);
        var matchesStatus = filter === "All" || booking.status === filter;
        return matchesText && matchesStatus;
    }).forEach(function (booking) {
        var item = document.createElement("li");
        var details = document.createElement("span");
        details.innerHTML = "<strong>" + safeText(booking.pickup) + " to " +
            safeText(booking.destination) + "</strong> | " +
            safeText(booking.date) + " | " + safeText(booking.status);

        var actions = document.createElement("div");
        actions.className = "record-actions";

        addActionButton(actions, "Update Status", function () {
            updateBookingStatus(booking.id);
        });

        if (canManage()) {
            addActionButton(actions, "Edit", function () { editBooking(booking.id); });
            addActionButton(actions, "Delete", function () { deleteBooking(booking.id); }, true);
        }

        item.appendChild(details);
        item.appendChild(actions);
        list.appendChild(item);
    });
}

// Create action buttons in one place to avoid repeating code.
function addActionButton(parent, label, action, isDelete) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    if (isDelete) button.className = "delete-button";
    button.addEventListener("click", action);
    parent.appendChild(button);
}

// Basic text safety for values shown on the page.
function safeText(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        return {
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#39;"
        }[character];
    });
}

// Edit and delete vehicle records.
function editVehicle(id) {
    var vehicle = vehicles.find(function (item) { return item.id === id; });
    var name = prompt("Enter vehicle name:", vehicle.name);
    if (name === null) return;
    var number = prompt("Enter registration number:", vehicle.number);
    if (number === null) return;
    vehicle.name = name.trim();
    vehicle.number = number.trim().toUpperCase();
    saveData();
    renderAll();
    showMessage("Vehicle updated.");
}

function deleteVehicle(id) {
    if (!confirm("Delete this vehicle record?")) return;
    vehicles = vehicles.filter(function (item) { return item.id !== id; });
    saveData();
    renderAll();
    showMessage("Vehicle deleted.");
}

// Edit and delete driver records.
function editDriver(id) {
    var driver = drivers.find(function (item) { return item.id === id; });
    var name = prompt("Enter driver name:", driver.name);
    if (name === null) return;
    var phone = prompt("Enter phone number:", driver.phone);
    if (phone === null) return;
    driver.name = name.trim();
    driver.phone = phone.trim();
    saveData();
    renderAll();
    showMessage("Driver updated.");
}

function deleteDriver(id) {
    if (!confirm("Delete this driver record?")) return;
    drivers = drivers.filter(function (item) { return item.id !== id; });
    saveData();
    renderAll();
    showMessage("Driver deleted.");
}

// Edit, delete, and update booking records.
function editBooking(id) {
    var booking = bookings.find(function (item) { return item.id === id; });
    var pickup = prompt("Pickup location:", booking.pickup);
    if (pickup === null) return;
    var destination = prompt("Destination:", booking.destination);
    if (destination === null) return;
    booking.pickup = pickup.trim();
    booking.destination = destination.trim();
    saveData();
    renderAll();
    showMessage("Booking updated.");
}

function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;
    bookings = bookings.filter(function (item) { return item.id !== id; });
    saveData();
    renderAll();
    showMessage("Booking deleted.");
}

function updateBookingStatus(id) {
    var booking = bookings.find(function (item) { return item.id === id; });
    var newStatus = prompt("Enter status: Pending, Approved, Completed, or Cancelled", booking.status);
    if (newStatus === null) return;

    var allowed = ["Pending", "Approved", "Completed", "Cancelled"];
    if (!allowed.includes(newStatus)) {
        showMessage("Please enter a valid status.");
        return;
    }

    booking.status = newStatus;
    saveData();
    renderAll();
    showMessage("Booking status updated.");
}

// Update dashboard numbers.
function renderDashboard() {
    document.getElementById("vehicleCount").textContent = vehicles.length;
    document.getElementById("driverCount").textContent = drivers.length;
    document.getElementById("bookingCount").textContent = bookings.length;
    document.getElementById("pendingCount").textContent = bookings.filter(function (booking) {
        return booking.status === "Pending";
    }).length;
}

// Basic report from the saved records.
function renderReport() {
    var completed = bookings.filter(function (booking) {
        return booking.status === "Completed";
    }).length;
    var available = vehicles.filter(function (vehicle) {
        return vehicle.status === "Available";
    }).length;

    document.getElementById("reportText").textContent =
        "There are " + vehicles.length + " vehicles, " + available +
        " available vehicles, " + drivers.length + " drivers, " +
        bookings.length + " bookings, and " + completed + " completed bookings.";
}

// Search boxes and filters refresh the visible records.
document.getElementById("vehicleSearch").addEventListener("input", renderVehicles);
document.getElementById("driverSearch").addEventListener("input", renderDrivers);
document.getElementById("bookingSearch").addEventListener("input", renderBookings);
document.getElementById("bookingFilter").addEventListener("change", renderBookings);
document.getElementById("reportButton").addEventListener("click", function () {
    renderReport();
    showMessage("Report refreshed.");
});

// Start with saved data.
saveData();
