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