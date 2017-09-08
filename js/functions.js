function save_options() {
  var active = $("#active").prop("checked");
  var reactivate = $("#reactivate").val();
  var amazon = $("#amazon").prop("checked");
  var banggood = $("#banggood").prop("checked");
  if(wasActive && !active){
    var deactivation = Date.now();
  }else{
    var deactivation = lastDeactivationTime;
  }
  chrome.storage.sync.set({
    isActive: active,
    reactivationTime: reactivate,
    referralAmazon: amazon,
    referralBanggood: banggood,
    deactivationTime: deactivation
  }, function() {
    // Update status to let user know options were saved.
    Materialize.toast('Impostazioni salvate!', 2000) // 4000 is the duration of the toast
    chrome.tabs.query({currentWindow: true, active : true},
        function(tabArray){
            if(active){
                chrome.browserAction.setIcon({path: "images/iconDisabled128.png" , tabId: tabArray[0].id});
            }else{
                chrome.browserAction.setIcon({path: "images/deactivated128.png" , tabId: tabArray[0].id});
            }
    });}
)

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.sync.get({
    isActive: 1,
    reactivationTime: 30,
    referralAmazon: 1,
    referralBanggood: 1
  }, function(items) {
    $("#active").prop("checked", items.isActive);
    $("#reactivate").val(items.reactivationTime);
    $("#amazon").prop("checked", items.referralAmazon);
    $("#banggood").prop("checked", items.referralBanggood);
    wasActive = items.isActive;
    lastDeactivationTime = items.deactivationTime;
  });
}
