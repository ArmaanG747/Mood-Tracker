function userMood() {
    let mood = document.getElementById("mood");
    let moodText = mood.value; 
    let moodEmoji = mood.options[mood.selectedIndex].text.split('-')[1].trim(); 

    let moodList = JSON.parse(localStorage.getItem("moods")) || [];

    let date = new Date().toLocaleString("en-US");

    moodList.push({ date: date, mood: `${moodText} ${moodEmoji}` }); 

    localStorage.setItem("moods", JSON.stringify(moodList));

    displayMoods(); 
}


function displayMoods(displayString) {
    let moodList = JSON.parse(localStorage.getItem("moods")) || [];
    let moodDiv = document.getElementById("user-mood");

    if (moodDiv){
        if (moodList.length === 0) {
            moodDiv.innerHTML = typeof displayString!= "string" ? "<p>No moods logged yet.</p>": displayString;
            return;
        }else{
            moodDiv.innerHTML = "";
            moodList.forEach(mood => {
                let moodItem = document.createElement("p");
                moodItem.textContent = `${mood.date}: ${mood.mood}`; 
                moodDiv.appendChild(moodItem); 
            });
        }
    }else{
        console.log("Mood Div Doesnt Exists");
        return;
    } 
    

}

function removeLastLog(){
    let moodList = JSON.parse(localStorage.getItem("moods")) || [];
    console.log("Before poping: ",moodList)
    moodList.pop();
    console.log("After poping: ",moodList)
    localStorage.setItem("moods", JSON.stringify(moodList));

    displayMoods("<p>Start Logging Moods again!</p>");
    
}


function resetTimeline(){
    localStorage.clear();
    displayMoods("<p>Timeline Reset! Start Tracking Moods Again</p>");
}


document.addEventListener("DOMContentLoaded", displayMoods);
