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
