chrome.webRequest.onBeforeRequest.addListener(
   function(details) {
     var url = details.url;
     var splitted = url.split("/");
     var urlNuovo = url;
     switch(splitted[2])  {
       case "www.amazon.it":
       if(url.indexOf("&tag=overVolt-21")<0){
          urlNuovo = url + "&tag=overVolt-21";
       }
      break;
       case "www.banggood.com":
       if(url.indexOf(".html?p=63091629786202015112")<0){
         var index = url.indexOf(".html");
         urlNuovo = url.slice(0, index) +  ".html?p=63091629786202015112";
         console.log(urlNuovo);
       }
         break;

     }
     return {redirectUrl: urlNuovo};
   },
   {urls: ["*://www.amazon.it/*/product/*", "*://www.banggood.com/*.html*"]},
   ["blocking"]
 );
