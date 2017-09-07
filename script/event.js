chrome.webRequest.onBeforeRequest.addListener(
   function(details) {
     var url = details.url;
     var splitted = url.split("/");
     var urlNuovo = url;
     counter = 0;
     switch(splitted[2])  {
       case "www.amazon.it":
       len = urlNuovo.length;
       tagIndex = urlNuovo.indexOf("tag=");
       while(tagIndex > 0){
         nextParameterIndex = urlNuovo.slice(tagIndex).indexOf("&");
         if((nextParameterIndex+tagIndex+1>=len)||(nextParameterIndex <0)){
           urlNuovo = urlNuovo.slice(0, tagIndex-1);
         } else {
            urlNuovo = urlNuovo.slice(0, tagIndex-1) + urlNuovo.slice(nextParameterIndex + tagIndex);
         }
         len = urlNuovo.length;
         tagIndex =urlNuovo.indexOf("tag=");
       }

       var separator = urlNuovo.indexOf("?")>0 ? "&" : "?";
       urlNuovo += separator + "tag=overVolt-21";

      break;
       case "www.banggood.com":
       if(url.indexOf(".html?p=63091629786202015112")<0){
         var index = url.indexOf(".html");
         if(index > 0){
         urlNuovo = url.slice(0, index) +  ".html?p=63091629786202015112";
       }
       }
         break;

     }
     return {redirectUrl: urlNuovo};
   },
   {urls: ["*://www.amazon.it/*", "*://www.banggood.com/*.html*"]},
   ["blocking"]
 );


 function checkUrl(tabId, changeInfo, tab) {
 var url = tab.url;
 var splitted = url.split("/");
 var success = false;
 var active = false;
 switch(splitted[2])  {
   case "www.amazon.it":
    active = true;
    if((url.indexOf("&tag=overVolt-21")>0)||(url.indexOf("?tag=overVolt-21")>0)){
      success = true;
    }
    break;
   case "www.banggood.com":
    active = true;
    if(url.indexOf(".html?p=63091629786202015112")>0){
     success = true;
    }
    break;
}
if(active){

  if(success){
    chrome.browserAction.setIcon({path: "images/success.png", tabId: tabId});
  } else {
    chrome.browserAction.setIcon({path: "images/fail.png", tabId: tabId});
  }
}
else{
  chrome.browserAction.setIcon({path: "images/iconDisabled.png", tabId: tabId});
}
}


chrome.tabs.onUpdated.addListener(checkUrl);
