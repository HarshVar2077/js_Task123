function validateEmail(executionContext) {
 
    var formContext = executionContext.getFormContext();
 
    var email = formContext
        .getAttribute("har_emailaddress")
        .getValue();
 
    formContext.ui.clearFormNotification("EMAIL_ERROR");
 
    if (email != null) {
 
        email = email.toLowerCase();
 
        if (email.endsWith("@nsquarexperts.com")) {
 
            formContext.ui.setFormNotification(
                "Email address from @nsquarexperts.com is not allowed.",
                "ERROR",
                "EMAIL_ERROR"
            );
 
            formContext
                .getAttribute("har_emailaddress")
                .setValue(null);
        }
    }
}
var formContext;
var selectedOccasion;

function occasionOnChange(executionContext) {

    formContext = executionContext.getFormContext();

    formContext.getAttribute("har_shops").setValue(null);

    filterShopsByOccasion(executionContext);
}

function filterShopsByOccasion(executionContext) {

    formContext = executionContext.getFormContext();
    console.log("filterShopsByOccasion fired");

    selectedOccasion = formContext
        .getAttribute("har_occasion")
        .getValue();

    var shopControl = formContext.getControl("har_shops");
    console.log(shopControl);
    console.log(shopControl.getControlType());

    shopControl.removePreSearch(applyShopFilter);

     console.log("PreSearch added");

    if (selectedOccasion == null) {

        formContext.getAttribute("har_shops").setValue(null);
        shopControl.setDisabled(true);

        return;
    }

    shopControl.setDisabled(false);
    shopControl.addPreSearch(applyShopFilter);
}

function applyShopFilter() {
        debugger;
    console.log("applyShopFilter fired");


    var filter =
        "<filter type='and'>" +
        "<condition attribute='har_eventsorganizedhere' " +
        "operator='eq' " +
        "value='" + selectedOccasion + "' />" +
        "</filter>";

    formContext
        .getControl("har_shops")
        .addCustomFilter(filter, "har_shop");
}
function toggleSpouseName(executionContext) {

    var formContext = executionContext.getFormContext();

    var occasion = formContext.getAttribute("har_occasion").getValue();

    var spouseField = formContext.getControl("har_spousename");
    var spouseAttribute = formContext.getAttribute("har_spousename");

    // Replace with the actual Wedding Shoot option value
    var weddingShootValue = 666660002;

    if (occasion == weddingShootValue) {

        spouseField.setVisible(true);
        spouseAttribute.setRequiredLevel("required");
    }
    else {

        spouseAttribute.setValue(null);
        spouseAttribute.setRequiredLevel("none");
        spouseField.setVisible(false);
    }
}