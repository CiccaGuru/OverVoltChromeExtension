var isActive, reactivationTime, referralAmazon, referralBanggood;
function putReferral(details) {
    var reactivated = 0;
    var url = details.url;
    var newUrl = details.url;
    var splitted = url.split("/");
    counter = 0;
    if((splitted[2] == "www.amazon.it")&&(referralAmazon)){
                len = url.length;
                tagIndex = url.indexOf("tag=");
                while(tagIndex > 0){
                    if(url.indexOf("tag=chromevideonauting-21")>0){
                        var urlRedirect = chrome.extension.getURL('error.html');
                        chrome.tabs.update(details.tabId, {url: urlRedirect});
                    }
                    nextParameterIndex = url.slice(tagIndex).indexOf("&");
                    if((nextParameterIndex+tagIndex+1>=len)||(nextParameterIndex <0)){
                        url = url.slice(0, tagIndex-1);
                    }
                    else {
                        url = url.slice(0, tagIndex-1) + url.slice(nextParameterIndex + tagIndex);
                    }
                    len = url.length;
                    tagIndex =url.indexOf("tag=");
                    counter++;
                }
                var separator = url.indexOf("?")>0 ? "&" : "?";
                newUrl = url + separator + "tag=overVolt-21";
        }
        else if((splitted[2] == "www.banggood.com")&&(referralBanggood)){

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
                counter++;
            }
            var separator = url.indexOf("?")>0 ? "&" : "?";
            newUrl = url + separator + "p=63091629786202015112";
        }
        }
    return {redirectUrl: newUrl};
}

function toogleListener(value) {
    if(value){
        chrome.webRequest.onBeforeRequest.addListener(putReferral,
            {urls: ["*://www.amazon.it/*", "*://www.banggood.com/*.html*"]},
            ["blocking"]);
    }
    else {
        chrome.webRequest.onBeforeRequest.removeListener(putReferral);
    }
}

function updateSettings(){
    chrome.storage.sync.get(function(settings) {
        isActive = settings.isActive;
        referralAmazon = settings.referralAmazon;
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
        if(splitted[2] == "www.amazon.it"){
            supported = true;
            active = (isActive && referralAmazon);
            success = ((url.indexOf("&tag=overVolt-21")>0)||(url.indexOf("?tag=overVolt-21")>0));
        }
        else if(splitted[2] == "www.banggood.com"){
            supported = true;
            active = (isActive && referralBanggood);
            success = url.indexOf(".html?p=63091629786202015112")>0;
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
          referralAmazon: 1,
          referralBanggood: 1,
          deactivationTime: -1
      });
    }
});

chrome.tabs.onUpdated.addListener(updateIcon);
chrome.tabs.onActivated.addListener(updateIconOnSelection);
updateSettings();
