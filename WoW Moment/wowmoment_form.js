var WowMoment = WowMoment || {};

WowMoment.validateEmailDomain = function (executionContext) {
    var formContext = executionContext.getFormContext();

    var emailAttr = formContext.getAttribute("har_emailaddress");
    if (!emailAttr) return;

    var email = emailAttr.getValue();

    if (!email) {
        formContext.getControl("har_emailaddress")
            .clearNotification("EMAIL_DOMAIN");
        return;
    }

    if (email.toLowerCase().endsWith("@nsquarexperts.com")) {

        formContext.getControl("har_emailaddress")
            .setNotification(
                "Email address from @nsquarexperts.com domain is not allowed.",
                "EMAIL_DOMAIN"
            );

        emailAttr.setValue(null);
    }
    else {
        formContext.getControl("har_emailaddress")
            .clearNotification("EMAIL_DOMAIN");
    }
};