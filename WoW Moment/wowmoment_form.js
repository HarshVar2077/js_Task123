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
function validateMobileNumber(executionContext) {

    var formContext = executionContext.getFormContext();

    var mobileAttribute = formContext.getAttribute("har_mobilenumber");
    var mobileControl = formContext.getControl("har_mobilenumber");

    var mobileNumber = mobileAttribute.getValue();

    mobileControl.clearNotification("MOBILE_ERROR");

    if (mobileNumber == null || mobileNumber.trim() === "") {
        return;
    }

    mobileNumber = mobileNumber.trim();

    var mobilePattern = /^\+91\d{10}$/;

    if (!mobilePattern.test(mobileNumber)) {
        mobileAttribute.setValue(null);
        mobileControl.setNotification(
            "Mobile Number must start with +91 and contain exactly 10 digits.",
            "MOBILE_ERROR"
        );

    }
}
function managementApprovalOnChange(executionContext) {
    var formContext = executionContext.getFormContext();
    var statusAttribute = formContext.getAttribute("har_managementapproval");

    if (statusAttribute == null) {
        return;
    }
    var status = statusAttribute.getValue();
    var rejected = 666660002;
    var rejectionRemarks = formContext.getAttribute("har_rejectionremarks");
    if (status == rejected) {
        rejectionRemarks.setRequiredLevel("required");

}else {
        rejectionRemarks.setRequiredLevel("none");
}
}
//phase 2 validations
function populateAgentDetails(executionContext) {
    var formContext = executionContext.getFormContext();

    // Run only on Create form
    if (formContext.ui.getFormType() !== 1) {
        return;
    }

    var userId = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");

    Xrm.WebApi.retrieveRecord(
        "systemuser",
        userId,
        "?$select=fullname,internalemailaddress"
    ).then(
        function success(result) {
            formContext.getAttribute("har_agentname").setValue(result.fullname);
            formContext.getAttribute("har_agentemail").setValue(result.internalemailaddress);
        },
        function error(error) {
            console.log(error.message);
        }
    );
}
function createOrAssociateContact(executionContext) {
    var formContext = executionContext.getFormContext();

    var firstName = formContext.getAttribute("har_firstname").getValue();
    var lastName = formContext.getAttribute("har_lastname").getValue();
    var email = formContext.getAttribute("har_emailaddress").getValue();
    var mobile = formContext.getAttribute("har_mobilenumber").getValue();


    Xrm.WebApi.retrieveMultipleRecords(
        "contact",
        "?$select=contactid,fullname&$filter=emailaddress1 eq '" + email + "'"
    ).then(
        function success(result) {

            if (result.entities.length > 0) {

                var existingContact = result.entities[0];

                formContext.getAttribute("har_contact").setValue([
                    {
                        id: existingContact.contactid,
                        name: existingContact.fullname,
                        entityType: "contact"
                    }
                ]);

            } else {

                var contactData = {
                    firstname: firstName,
                    lastname: lastName,
                    emailaddress1: email,
                    mobilephone: mobile
                };

                Xrm.WebApi.createRecord("contact", contactData).then(
                    function success(createdResult) {

                        var fullName =
                            (firstName || "") +" "+(lastName || "");

                        formContext.getAttribute("har_contact").setValue([
                            {
                                id: createdResult.id,
                                name: fullName.trim(),
                                entityType: "contact"
                            }
                        ]);
                    },
                    function (error) {
                        alert(error.message);
                    }
                );
            }
        },
        function error(error) {
            alert(error.message);
        }
    );
}
function validateDuplicateWowMoment(executionContext) {
    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var email = formContext.getAttribute("har_emailaddress").getValue();
    var occasion = formContext.getAttribute("har_occasion").getValue();
    var wowMomentDate = formContext.getAttribute("har_wowmomentdate").getValue();

    if (!email || occasion === null || !wowMomentDate) {
        return;
    }

    eventArgs.preventDefault();

    var currentRecordId = formContext.data.entity.getId().replace(/[{}]/g, "");

    var dateOnly = wowMomentDate.toISOString().split("T")[0];

    var query =
        "?$select=har_wowmomentid,har_wowmomentdate" +
        "&$filter=har_emailaddress eq '" + email + "'" +
        " and har_occasion eq " + occasion;

    Xrm.WebApi.retrieveMultipleRecords("har_wowmoment", query).then(
        function success(result) {

            var duplicateFound = false;

            for (var i = 0; i < result.entities.length; i++) {

                var record = result.entities[i];

                if (
                    record.har_wowmomentid.toLowerCase() ===
                    currentRecordId.toLowerCase()
                ) {
                    continue;
                }

                if (!record.har_wowmomentdate) {
                    continue;
                }

                var existingDate =
                    new Date(record.har_wowmomentdate)
                        .toISOString()
                        .split("T")[0];

                if (existingDate === dateOnly) {
                    duplicateFound = true;
                    break;
                }
            }

            if (duplicateFound) {
                alert(
                    "A Wow Moment record already exists with the same Email Address, Occasion and Wow Moment Date."
                );
            }
            else {
                formContext.data.save();
            }
        },
        function error(error) {
            alert(error.message);
        }
    );
}