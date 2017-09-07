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

function checkReferral(url, callback, supportedErrorCallback, unsupportedErrorCallback, deactivatedCallback) {
  var splitted = url.split("/");
  chrome.storage.sync.get(function(settings) {

    if(settings.isActive){
  switch(splitted[2])  {
    case "www.amazon.it":
      if((url.indexOf("&tag=overVolt-21")>0)||(url.indexOf("?tag=overVolt-21")>0)){
        callback("Amazon");
      } else{
        supportedErrorCallback("Amazon");
      }
      break;
    case "www.banggood.com":
      if(url.indexOf(".html?p=63091629786202015112")>0){
        callback("Bangood");
      } else{
        supportedErrorCallback("Banggood");
      }
      break;
    default:
      unsupportedErrorCallback();

  }
}else{
  deactivatedCallback();
}
});
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
      $("#image img").attr('src', 'images/success.png');
    }, function(nome) {
      renderStatus(nome + " è supportato, ma non stai usando il referral su questa pagina.");
      $("#image img").attr('src', 'images/fail.png');
    }, function(){
      renderStatus('Questo sito non è supportato. Se pensi sia un errore, contatta lo sviluppatore.')
      $("#image img").attr('src', 'images/iconDisabled.png');
    }, function(){
      renderStatus('L\'estensione è disabilitata. Riattivala nelle impostazioni.')
      $("#image img").attr('src', 'images/deactivated.png');
    });
  });
});

$('#openOptionsContainer').click(function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
