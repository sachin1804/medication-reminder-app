document.getElementById("medication-form").addEventListener("submit", function (event) {
    event.preventDefault();

    var doctorName = document.getElementById("doctor-name-input").value;
    var appointment = document.getElementById("appointment-input").value;
    var schedule = document.getElementById("schedule-input").value;

    var appointmentScheduled = {
        doctorName: doctorName,
        appointment: appointment,
        schedule: schedule
    };

    var appointmentList = document.getElementById("appointment-list");
    var listItem = document.createElement("li");
    listItem.textContent = "Appointment: " + appointmentScheduled.doctorName + " | Appointment: " + appointmentScheduled.appointment + " | Schedule: " + appointmentScheduled.schedule;

    // Create a delete button for the medication reminder
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";
    listItem.appendChild(deleteButton);

    // Add an event listener to the delete button
    deleteButton.addEventListener("click", function () {
        deleteAppointmentReminder(medication, listItem);
    });

    appointmentList.appendChild(listItem);

    // Save medication to the web storage
    saveAppointmentReminder(appointmentScheduled);

    // Clear the input fields after adding medication
    document.getElementById("doctor-name-input").value = "";
    document.getElementById("appointment-input").value = "";
    document.getElementById("schedule-input").value = "";

    // Schedule the medication reminder notification
    scheduleAppointmentReminder(appointmentScheduled, listItem);
});

// Load saved medication reminders on page load
window.addEventListener("load", function () {
    loadAppointmentReminders();
});

function saveAppointmentReminder(appointmentScheduled) {
    var appointmentReminders = JSON.parse(localStorage.getItem("appointmentReminders")) || [];

    appointmentReminders.push(appointmentScheduled);

    localStorage.setItem("appointmentReminders", JSON.stringify(appointmentReminders));
}

function loadAppointmentReminders() {
    var appointmentReminders = JSON.parse(localStorage.getItem("appointmentReminders")) || [];

    var appointmentList = document.getElementById("appointment-list");

    appointmentReminders.forEach(function (appointmentScheduled) {
        var listItem = document.createElement("li");
        listItem.textContent = "Appointment: " + appointmentScheduled.doctorName + " | Appointment: " + appointmentScheduled.appointment + " | Schedule: " + appointmentScheduled.schedule;

        // Create a delete button for the medication reminder
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteButton";
        listItem.appendChild(deleteButton);

        // Add an event listener to the delete button
        deleteButton.addEventListener("click", function () {
            deleteAppointmentReminder(appointmentScheduled, listItem);
        });


        // Schedule the medication reminder notification
        appointmentList.appendChild(listItem);
        scheduleAppointmentReminder(appointmentScheduled, listItem);

    });
}

function deleteAppointmentReminder(appointmentScheduled, listItem) {
    // Remove the medication reminder from the UI
    listItem.remove();

    // Remove the medication reminder from the web storage
    var appointmentReminders = JSON.parse(localStorage.getItem("appointmentReminders")) || [];
    var updatedReminders = appointmentReminders.filter(function (reminder) {
        return reminder.doctorName !== appointmentScheduled.doctorName;
    });
    localStorage.setItem("appointmentReminders", JSON.stringify(updatedReminders));

    // Perform additional actions as needed, such as canceling scheduled notifications or deleting from the database
    console.log("Appointment reminder deleted:", appointmentScheduled);
}


function scheduleAppointmentReminder(appointmentScheduled, listItem) {
    var scheduleTime = parseScheduleTime(appointmentScheduled.schedule);
    var currentTime = new Date();

    // Calculate the time difference in milliseconds between the current time and the scheduled time
    var timeDifference = scheduleTime.getTime() - currentTime.getTime();


    // Schedule the notification if the scheduled time is in the future
    if (timeDifference > 0) {
        setTimeout(function () {
            showNotification("Appointment Reminder", "Its time for your appointment with Dr. " + appointmentScheduled.doctorName);
            // alert("Please check the notification its time for your medication");
        }, timeDifference);
    }
    else {
        alert("You can't set reminder for passed out time");
        deleteAppointmentReminder(appointmentScheduled, listItem);
    }
}

function parseScheduleTime(schedule) {
    var parts = schedule.split(":");
    var hours = parseInt(parts[0]);
    var minutes = parseInt(parts[1]);

    var scheduleTime = new Date();
    scheduleTime.setHours(hours);
    scheduleTime.setMinutes(minutes);
    scheduleTime.setSeconds(0);
    scheduleTime.setMilliseconds(0);

    return scheduleTime;
}

function showNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        var options = {
            body: message,
            icon: "notification-icon.png" // Replace with your notification icon URL
        };

        new Notification(title, options);
    } else if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                showNotification(title, message);
            }
        });
    }
}

window.addEventListener("load", function () {
    if ("Notification" in window) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }
});

let show = false;
document.getElementById("click-me").addEventListener("click", function () {
    show = !show;

    if (show) {
        document.getElementById("menu").style.display = "flex";
    }
    else {
        document.getElementById("menu").style.display = "none";
    }
})