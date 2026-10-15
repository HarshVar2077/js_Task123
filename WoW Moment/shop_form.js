function updateEventsCounter(executionContext) {
    var formContext = executionContext.getFormContext();

    // Run only for existing records
    if (formContext.ui.getFormType() !== 2) {
        return;
    }

    var shopId = formContext.data.entity.getId().replace(/[{}]/g, "");

    Xrm.WebApi.retrieveMultipleRecords(
        "har_wowmoment",
        "?$select=har_wowmomentid&$filter=_har_shops_value eq " + shopId
    ).then(
        function success(result) {

            var eventCount = result.entities.length;

            formContext.getAttribute("har_eventcounter")
                .setValue(eventCount);

            formContext.data.save();
        },
        function error(error) {
            console.log(error.message);
        }
    );
}
