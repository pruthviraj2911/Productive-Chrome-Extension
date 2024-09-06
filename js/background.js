var storage = chrome.storage.local;
var state, links, time, totalSeconds, currentWebsite; 

setDefault();
setInterval(setTime, 1000);
setInterval(checkSite, 500);

function blockSite() 
{
    chrome.tabs.update({url: "../html/blockedSite.html"});
}

function setDefault() 
{
    console.log("Set the default");
    storage.set({"links": ['facebook.com','youtube.com','twitter.com', 'instagram.com']});//some default websites to be blocked
    storage.set({"time": 0});
    storage.set({"distractions": 0});
}

function setTime() 
{
    chrome.storage.local.get(["state","time"], function(data) {
        state = data.state;
        totalSeconds = data.time;

        if(!state) {
            totalSeconds = 0;
            return;
        }
        totalSeconds++;
        storage.set({"time" : totalSeconds});

        // Save current website's URL
        chrome.tabs.query({active:true, lastFocusedWindow: true}, tabs => {
            if (tabs.length > 0) {
                currentWebsite = tabs[0].url;
                storage.set({"currentWebsite": currentWebsite});
            }
        });
    });
}


function checkSite() {
    chrome.storage.local.get(["state","links", "distractions"], function(data) {
        state = data.state;
        links = data.links;
        distractions = data.distractions;

        if(!state) return;

        chrome.tabs.query({active:true, lastFocusedWindow: true}, tabs => {
            if (tabs.length == 0) return;
            let url = tabs[0].url;
            if (url.includes("html/blockedSite.html")) return;

            for(index=0; index< links.length; index++) {
                if (url && url.includes(links[index])) {
                    if (url.includes("settings.html?add_link=" + links[index])) return;
                    blockSite();
                    storage.set({"distractions" : (distractions + 1)});
                    return;
                }
            }
        });
    });
}
