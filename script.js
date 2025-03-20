// Log the current mood and update the mood list
function userMood() {
    // Get the selected mood and its emoji
    let mood = document.getElementById("mood");
    let moodText = mood.value; 
    let moodEmoji = mood.options[mood.selectedIndex].text.split('-')[1].trim(); 

    // Retrieve existing moods from local storage or initialize an empty array
    let moodList = JSON.parse(localStorage.getItem("moods")) || [];
    let date = new Date().toLocaleString("en-US");

    // Add the new mood to the list
    moodList.push({ date: date, mood: `${moodText} ${moodEmoji}` }); 
    localStorage.setItem("moods", JSON.stringify(moodList));

    // Update the mood timeline and calendar view
    displayMoods(); 
    // Pass context as "change" to differentiate from toggle
    displayCalendar("update"); 
}

// Display the mood history
function displayMoods(displayString) {
    let moodList = JSON.parse(localStorage.getItem("moods")) || [];
    let moodDiv = document.getElementById("user-mood");

    // Check if moodDiv exists
    if (moodDiv){
        if (moodList.length === 0) {
            moodDiv.innerHTML = typeof displayString!= "string" ? "<p>No moods logged yet.</p>": displayString;
            return;
        }else{
            moodDiv.innerHTML = "";
            let todayDate = new Date().toLocaleString("en-US");
            
            // Display moods for today only
            moodList.forEach(mood => {
                let moodItem = document.createElement("p");
                if(mood.date.split(",")[0].trim() === todayDate.split(",")[0].trim()){
                    moodItem.textContent = `${mood.date}: ${mood.mood}`; 
                    moodDiv.appendChild(moodItem); 
                } 
            });
        }
    }else{
        console.log("Mood Div Doesnt Exists");
        return;
    } 
    

}

// Track the current month and year for the calendar display
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Flag to manage calendar visibility state, initially set to hidden (false)
let isCalendarVisible = false;

// Toggle calendar visibility
function toggleCalendar() {
    const calendarView = document.getElementById("calendar-view");
    isCalendarVisible = !isCalendarVisible;

    // Update visibility and button text
    if (isCalendarVisible) {
        calendarView.style.display = "block";
        document.querySelector("button[onclick='toggleCalendar()']").textContent = "Hide Calendar";
        displayCalendar("toggle");
    } else {
        calendarView.style.display = "none";
        document.querySelector("button[onclick='toggleCalendar()']").textContent = "View Calendar";
    }
}

// Display the Calendar
function displayCalendar(context = "update") {
    const calendarDiv = document.getElementById("calendar");
    const calendarView = document.getElementById("calendar-view");

    // Maintain visibility based on state
    if (!isCalendarVisible && context === "update") return;

    // Generate month and year label
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthLabel = `${monthNames[currentMonth]}<br>${currentYear}`;

    const header = document.createElement("h4");
    header.innerHTML = monthLabel;
    header.style.textAlign = "center";

    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.onclick = () => changeMonth(-1);

    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.onclick = () => changeMonth(1);

    // Clear previous calendar
    calendarDiv.innerHTML = ""; 
    calendarDiv.appendChild(prevButton);
    calendarDiv.appendChild(header);
    calendarDiv.appendChild(nextButton);

    // Calculate number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const moodList = JSON.parse(localStorage.getItem("moods")) || [];

    // Create calendar grid
    for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement("div");
        dayBox.classList.add("calendar-day");
        dayBox.textContent = day;

        // Find the latest mood for this day
        const moodEntry = moodList.slice().reverse().find(entry => {
            const entryDate = new Date(entry.date);
            return (
                entryDate.getDate() === day &&
                entryDate.getMonth() === currentMonth &&
                entryDate.getFullYear() === currentYear
            );
        });

        // If a mood is found, display it
        if (moodEntry) {
            const moodEmoji = moodEntry.mood.split(" ")[1];
            const moodElement = document.createElement("span");
            moodElement.textContent = moodEmoji;
            moodElement.classList.add("mood-emoji");
            dayBox.appendChild(moodElement);
        }

        calendarDiv.appendChild(dayBox);
    }
}

// Changing Months in Calendar
function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    // Pass context as "change" to differentiate from toggle
    displayCalendar("change"); 
}

// Removing last logged mood
function removeLastLog(){
    let moodList = JSON.parse(localStorage.getItem("moods")) || [];
    console.log("Before poping: ",moodList)
    moodList.pop();
    console.log("After poping: ",moodList)
    localStorage.setItem("moods", JSON.stringify(moodList));

    // Display the reset message when the mood list is empty
    displayMoods("<p>Start Logging Moods again!</p>");

    // Pass context as "change" to differentiate from toggle
    displayCalendar("update");
    
}

// Clearing complete mood data
function resetTimeline(){
    localStorage.clear();

    // Display the reset message when the mood timeline is cleared
    displayMoods("<p>Timeline Reset! Start Tracking Moods Again</p>");
    displayCalendar("update");
}

// Automatically display the mood timeline when the page is loaded
document.addEventListener("DOMContentLoaded", displayMoods);


         
         