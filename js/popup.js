var stringOff = "Start";
var stringOn = "Stop";
var buttonState = document.getElementById("changeState");
var buttonSetting = document.getElementById("settingsButton");
var labelHour = document.getElementById("hours");
var labelMinute = document.getElementById("minutes");
var labelSeconds = document.getElementById("seconds");
var labelDistract = document.getElementById("numDistract");
var stringDistract = document.getElementById("stringDistract");
var labelCurrentWebsite = document.getElementById("currentWebsite"); // New line to get the label element for current website

var storage = chrome.storage.local;

checkDistractions();
changeTimeLabels();

buttonState.addEventListener("click", clickState);
buttonSetting.addEventListener("click", clickSetting);

setInterval(changeTimeLabels, 1000);
setInterval(checkDistractions, 500);

function clickState() {
    storage.get(["state","time"], function(x) {
        var newState;
        if(x.state == false || x.state == undefined) {
            changeTimeLabels();
            newState = true;
            resetTimeLabels();
            buttonState.innerText = stringOn;
        } else {
            newState = false;
            buttonState.innerText = stringOff;
            storage.set({"time" : 0});
            storage.set({"distractions": 0});
            checkDistractions();
        }
        storage.set({"state": newState});
    });
}

function clickSetting() {
    chrome.tabs.create({url: "../html/settings.html"});
}

function changeTimeLabels() {
    storage.get(["time", "state", "currentWebsite"], function(data) { // Updated to get currentWebsite from storage
        if(!data.state) return;
        var seconds = parseInt(data.time%60);
        var minutes = parseInt((data.time/60)%60);
        var hours = parseInt(data.time/3600);
        if(seconds<10) {
            labelSeconds.innerText = "0" + seconds;
        } else labelSeconds.innerText = seconds;
        if(minutes<10) {
            labelMinute.innerText = "0" + minutes + ":";
        } else labelMinute.innerText = minutes + ":";
        if(hours > 0) {
            labelHour.innerHTML = hours + ":";
        }

        // Display current website
        if(data.currentWebsite) {
            labelCurrentWebsite.innerText = "Current Website: " + data.currentWebsite;
        } else {
            labelCurrentWebsite.innerText = "Current Website: N/A";
        }
    });
}

function checkDistractions() {
    chrome.storage.local.get(["distractions", "state"], function(data) {
        distractions = data.distractions;
        labelDistract.innerText = distractions;        
        if (distractions == 1) stringDistract.innerText = "distraction!";
        if (distractions !=1) stringDistract.innerText = " distractions!";
    });
}

function resetTimeLabels() {
    labelSeconds.innerText = "";
    labelMinute.innerText = "";
    labelHour.innerText= "";
}
