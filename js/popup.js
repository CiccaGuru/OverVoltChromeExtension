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
      deactivatedCallback("Amazon");
      break;
    case "www.gearbest.com":
      if((url.indexOf("&lkid=12357131")>0)||(url.indexOf("?lkid=12357131")>0)){
        callback("Gearbest");
      } else{
        supportedErrorCallback("Gearbest");
    }
      break;
    case "www.banggood.com":
      if(url.indexOf("p=63091629786202015112")>0){
        callback("Bangood");
      } else{
        supportedErrorCallback("Banggood");
      }
      break;
    default:
      unsupportedErrorCallback();

  }
}else{
    switch(splitted[2])  {
      case "www.gearbest.it":
        deactivatedCallback("Gearbest");
        break;
    case "www.banggood.com":
        deactivatedCallback("Banggood");
        break;
    case "www.amazon.it":
        deactivatedCallback("Amazon");
        break;
    default:
        deactivatedCallback("Other");
        break;
    }
}
});
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  tabUrl(function(url) {
    renderStatus('Controllo se stai usando il referral di overvolt per questo sito... ');

    checkReferral(url,
    function(nome) {
      renderStatus('Ottimo! Stai supportando overVolt con questo acquisto su ' + nome + '! :-)');
      $("#image img").attr('src', 'images/success.png');
    }, function(nome) {
        renderStatus(nome + " è supportato da questa estensione, ma questa pagina no.");
      $("#image img").attr('src', 'images/fail.png');
  }, function(){
      renderStatus('Pare che questo sito non sia supportato.')
      $("#image img").attr('src', 'images/iconDisabled.png');
  }, function(nome){
        if(nome=="Amazon"){
            renderStatus('Purtroppo abbiamo avuto problemi con Amazon e quindi l\'estensione è attualmente disabilitata su questo sito. :-(')
        }else{
            renderStatus('L\'estensione è disabilitata e non stai supportando overVolt con questo acquisto su ' + nome +':-(')
        }
      $("#image img").attr('src', 'images/deactivated.png');
    });
  });
});

var wasActive, lastDeactivationTime;

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

    $(document).ready(function() {
      $('select').material_select();
    });
