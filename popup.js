function tabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

function checkReferral(url, callback, errorCallback) {
  var splitted = url.split("/");
  switch(splitted[2])  {
    case "www.amazon.it":
      if((url.indexOf("&tag=overVolt-21")>0)||(url.indexOf("?tag=overVolt-21")>0)){
        callback("Amazon");
      } else{
        errorCallback("Amazon");
      }
      break;
    case "www.banggood.com":
      if(url.indexOf(".html?p=63091629786202015112")>0){
        callback("Bangood");
      } else{
        errorCallback("Banggood");
      }
      break;
    default:
      errorCallback('Non stai usando il referral di OverVolt per questo sito :-(   \nControlla che sia un sito supportato, altrimenti contatta lo sviluppatore.');

  }

}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  tabUrl(function(url) {
    renderStatus('Controllo se stai usando il referral di Overvolt per questo sito... ');

    checkReferral(url,
    function(nome) {
      renderStatus('Ottimo! Stai usando il referral di OverVolt per ' + nome + '! :-)');
    }, function(nome) {
      renderStatus(nome + " è supportato, ma non stai usando il referral su questa pagina.");
    });
  });
});
