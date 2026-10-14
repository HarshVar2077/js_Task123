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
function lockFieldsAfterSubmission(executionContext) {
    var formContext = executionContext.getFormContext();
    var statusAttribute = formContext.getAttribute("har_managementapproval");

    if (statusAttribute == null) {
        return;
    }

    var status = statusAttribute.getValue();

    var initiated = 666660000;
    var approved = 666660001;
    var rejected = 666660002;

    if (
        status == initiated ||
        status == approved ||
        status == rejected
    ) {

        formContext.getControl("har_title").setDisabled(true);
        formContext.getControl("har_firstname").setDisabled(true);
        formContext.getControl("har_lastname").setDisabled(true);
        formContext.getControl("har_emailaddress").setDisabled(true);
        formContext.getControl("har_mobilenumber").setDisabled(true);
        formContext.getControl("har_wowmomentdate").setDisabled(true);
        formContext.getControl("har_occasion").setDisabled(true);
        formContext.getControl("har_shops").setDisabled(true);
    }
}
function validateWowMomentDate(executionContext) {

    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var wowMomentDate = formContext
        .getAttribute("har_wowmomentdate")
        .getValue();
    if (wowMomentDate == null) {
        return;
    }

    var today = new Date();

    var minDate = new Date(today);
    minDate.setDate(today.getDate() - 2);

    var maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 180);

    formContext.ui.clearFormNotification("DATE_ERROR");

    if (wowMomentDate < minDate || wowMomentDate > maxDate) {

        formContext.ui.setFormNotification(
            "Wow Moment Date must be within 2 days before today and 180 days after today.",
            "ERROR",
            "DATE_ERROR"
        );

        eventArgs.preventDefault();
    }
}
function validateName(executionContext) {

    var formContext = executionContext.getFormContext();

    var fieldName = executionContext.getEventSource().getName();

    var attribute = formContext.getAttribute(fieldName);
    var control = formContext.getControl(fieldName);

    var value = attribute.getValue();

    control.clearNotification("NAME_ERROR");

    if (value == null || value.trim() === "") {
        return;
    }

    value = value.trim();

    var namePattern = /^[A-Za-z-]+$/;

    if (value.length < 2) {

        control.setNotification(
            "Name must contain at least 2 characters.",
            "NAME_ERROR"
        );

        attribute.setValue(null);
        return;
    }

    if (!namePattern.test(value)) {

        control.setNotification(
            "Only alphabetic characters and hyphens are allowed.",
            "NAME_ERROR"
        );

        attribute.setValue(null);
    }
}