// const { func } = require("prop-types");

document.getElementById("medication-form").addEventListener("submit", function (event) {
    event.preventDefault();

    var medicationName = document.getElementById("medication-name-input").value;
    var dosage = document.getElementById("dosage-input").value;
    var schedule = document.getElementById("schedule-input").value;

    var medication = {
        medicationName: medicationName,
        dosage: dosage,
        schedule: schedule
    };

    var medicationList = document.getElementById("medication-list");
    var listItem = document.createElement("li");
    listItem.textContent = "Medication: " + medication.medicationName + " | Dosage: " + medication.dosage + " | Schedule: " + medication.schedule;

    // Create a delete button for the medication reminder
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";
    listItem.appendChild(deleteButton);

    // Add an event listener to the delete button
    deleteButton.addEventListener("click", function () {
        deleteMedicationReminder(medication, listItem);
    });

    medicationList.appendChild(listItem);

    // Save medication to the web storage
    saveMedicationReminder(medication);

    // Clear the input fields after adding medication
    document.getElementById("medication-name-input").value = "";
    document.getElementById("dosage-input").value = "";
    document.getElementById("schedule-input").value = "";

    // Schedule the medication reminder notification
    scheduleMedicationReminder(medication, listItem);
});

// Load saved medication reminders on page load
window.addEventListener("load", function () {
    loadMedicationReminders();
});

function saveMedicationReminder(medication) {
    var medicationReminders = JSON.parse(localStorage.getItem("medicationReminders")) || [];

    medicationReminders.push(medication);

    localStorage.setItem("medicationReminders", JSON.stringify(medicationReminders));
}

function loadMedicationReminders() {
    var medicationReminders = JSON.parse(localStorage.getItem("medicationReminders")) || [];

    var medicationList = document.getElementById("medication-list");

    medicationReminders.forEach(function (medication) {
        var listItem = document.createElement("li");
        listItem.textContent = "Medication: " + medication.medicationName + " | Dosage: " + medication.dosage + " | Schedule: " + medication.schedule;

        // Create a delete button for the medication reminder
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteButton";
        listItem.appendChild(deleteButton);

        // Add an event listener to the delete button
        deleteButton.addEventListener("click", function () {
            deleteMedicationReminder(medication, listItem);
        });


        // Schedule the medication reminder notification
        medicationList.appendChild(listItem);

        scheduleMedicationReminder(medication);

    });
}

function deleteMedicationReminder(medication, listItem) {
    // Remove the medication reminder from the UI
    listItem.remove();

    // Remove the medication reminder from the web storage
    var medicationReminders = JSON.parse(localStorage.getItem("medicationReminders")) || [];
    var updatedReminders = medicationReminders.filter(function (reminder) {
        return reminder.medicationName !== medication.medicationName;
    });
    localStorage.setItem("medicationReminders", JSON.stringify(updatedReminders));

    // Perform additional actions as needed, such as canceling scheduled notifications or deleting from the database
    console.log("Medication reminder deleted:", medication);
}


function scheduleMedicationReminder(medication, listItem) {
    var scheduleTime = parseScheduleTime(medication.schedule);
    var currentTime = new Date();

    // Calculate the time difference in milliseconds between the current time and the scheduled time
    var timeDifference = scheduleTime.getTime() - currentTime.getTime();


    // Schedule the notification if the scheduled time is in the future
    if (timeDifference > 0) {
        setTimeout(function () {
            showNotification("Medication Reminder", "It's time to take your medication: " + medication.medicationName);
            // alert("Please check the notification its time for your medication");
        }, timeDifference);
    }
    else {
        alert("You can't set reminder for passed out time");
        deleteMedicationReminder(medication, listItem);
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

