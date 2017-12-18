var isActive, reactivationTime, referralGearbest, referralBanggood;
function putReferral(details) {

    var reactivated = 0;
    var url = details.url;
    var newUrl = details.url;
    var splitted = url.split("/");
    console.log("CISO");
    if(details.type == "main_frame")
    {
        if((splitted[2] == "www.gearbest.com")&&(referralGearbest)){
            len = url.length;
            htmlIndex = url.indexOf(".html");
            tagIndex = url.indexOf("lkid=");
            if(htmlIndex > 0){
            while(tagIndex > 0){
                nextParameterIndex = url.slice(tagIndex).indexOf("&");
                if((nextParameterIndex+tagIndex+1>=len)||(nextParameterIndex <0)){
                    url = url.slice(0, tagIndex-1);
                }
                else {
                    url = url.slice(0, tagIndex-1) + url.slice(nextParameterIndex + tagIndex);
                }
                len = url.length;
                tagIndex =url.indexOf("lkid=");
            }
            var separator = url.indexOf("?")>0 ? "&" : "?";
            newUrl = url + separator + "lkid=12357131";
        }
        }
        else if((splitted[2].indexOf("banggood") > 0)&&(referralBanggood)){

            len = url.length;
            htmlIndex = url.indexOf(".html");
            tagIndex = url.indexOf("p=");
            if(htmlIndex > 0){
            while(tagIndex > 0){
                nextParameterIndex = url.slice(tagIndex).indexOf("&");
                if((nextParameterIndex+tagIndex+1>=len)||(nextParameterIndex <0)){
                    url = url.slice(0, tagIndex-1);
                }
                else {
                    url = url.slice(0, tagIndex-1) + url.slice(nextParameterIndex + tagIndex);
                }
                len = url.length;
                tagIndex =url.indexOf("p=");
            }
            var separator = url.indexOf("?")>0 ? "&" : "?";
            newUrl = url + separator + "p=63091629786202015112";
        }
        }
    }
    return {redirectUrl: newUrl};
}

function toogleListener(value) {
    if(value){
        chrome.webRequest.onBeforeRequest.addListener(putReferral,
            {urls: [
                "*://www.gearbest.com/*/pp_*.html*",
                "*://www.banggood.com/*-p-*.html*",
                "*://www.deals.banggood.com/deals/*",
                "*://deals.banggood.com/*deals/*",
                "*://www.gearbest.com/*promotion*'"]
            },
            ["blocking"]);
    }
    else {
        chrome.webRequest.onBeforeRequest.removeListener(putReferral);
    }
}

function updateSettings(){
    chrome.storage.sync.get(function(settings) {
        isActive = settings.isActive;
        referralGearbest = settings.referralGearbest;
        referralBanggood = settings.referralBanggood;
        if((!isActive)&&(Date.now >= settings.deactivationTime + 60*settings.reactivationTime)){
            isActive = true;
            chrome.storage.sync.set({
                isActive: 1,
            }, function() {
                Materialize.toast('Impostazioni salvate!', 2000);
            });
        }
        toogleListener(isActive);
    });
}

function updateIcon(tabId, changeInfo, tab){
    updateSettings();
    var url = tab.url;
    var splitted = url.split("/");
    var success = false;
    var active = isActive;
    var supported = false;
    var iconPath = "images/iconDisabledd128.png";
    chrome.storage.sync.get(function(settings) {
        if(splitted[2] == "www.gearbest.com"){
            supported = true;
            active = (isActive && referralGearbest);
            success = url.indexOf("lkid=12357131")>0;
        }
        else if(splitted[2].indexOf("banggood")>0){
            supported = true;
            active = (isActive && referralBanggood);
            success = url.indexOf("p=63091629786202015112")>0;
        }
    iconPath =  active ?
    (supported ?
        (success ? "images/success.png" :  "images/fail.png")
        : "images/iconDisabled128.png")
        : "images/deactivated128.png";
        chrome.browserAction.setIcon({path: iconPath , tabId: tabId});
    });
}

function updateIconOnSelection(info){
    chrome.tabs.get(info.tabId, function(tab){
        updateIcon(info.tabId, 0, tab);
    });
}

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "sync"){
        updateSettings();
    }
});

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.sync.set({
          isActive: 1,
          reactivationTime: 30,
          referralGearbest: 1,
          referralBanggood: 1,
          deactivationTime: -1
      });
    }
});

chrome.tabs.onUpdated.addListener(updateIcon);
chrome.tabs.onActivated.addListener(updateIconOnSelection);
updateSettings();
