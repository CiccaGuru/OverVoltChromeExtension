

function save_options() {
    var active = $("#active").prop("checked");
    var reactivate = $("#reactivate").val();
    var amazon = $("#amazon").prop("checked");
    var banggood = $("#banggood").prop("checked");
    var wasActive, lastDeactivationTime;
    chrome.storage.sync.get(function(items) {
        wasActive = items.isActive;
        lastDeactivationTime = item.deactivationTime;
    });

    var deactivation = (wasActive && !active) ? Date.now() : lastDeactivationTime;

    chrome.storage.sync.set({
        isActive: active,
        reactivationTime: reactivate,
        referralAmazon: amazon,
        referralBanggood: banggood,
        deactivationTime: deactivation
    },
    function() {
        Materialize.toast('Impostazioni salvate!', 2000);
        chrome.tabs.query({currentWindow: true, active : true},
            function(tabArray){
                updateIcon(tabArray[0].id, 0, tabArray[0]);
            });
    });
}

function restore_options() {
    chrome.storage.sync.get(function(items) {
            $("#active").prop("checked", items.isActive);
            $("#reactivate").val(items.reactivationTime);
            $("#amazon").prop("checked", items.referralAmazon);
            $("#banggood").prop("checked", items.referralBanggood);
    });
}
