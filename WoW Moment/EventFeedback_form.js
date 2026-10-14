function toggleFeedbackComments(executionContext) {

    var formContext = executionContext.getFormContext();

    var ratingAttribute = formContext.getAttribute("har_customerrating");

    if (ratingAttribute == null) {
        return;
    }

    var rating = ratingAttribute.getValue();

    var feedbackComments = formContext.getAttribute("har_feedbackcomments");

    // Replace with actual option values
    var oneStar = 666660000;
    var twoStar = 666660001;

    if (rating == oneStar || rating == twoStar) {

        feedbackComments.setRequiredLevel("required");

    } else {

        feedbackComments.setRequiredLevel("none");
    }
}
function toggleFollowUpRemarks(executionContext) {

    var formContext = executionContext.getFormContext();

    var followUpAttribute = formContext.getAttribute("har_followuprequired");

    if (followUpAttribute == null) {
        return;
    }

    var followUpRequired = followUpAttribute.getValue();

    var remarksAttribute = formContext.getAttribute("har_followupremarks");
    var remarksControl = formContext.getControl("har_followupremarks");

    if (followUpRequired == true) {

        remarksControl.setVisible(true);
        remarksAttribute.setRequiredLevel("required");

    } else {

        remarksAttribute.setValue(null);
        remarksAttribute.setRequiredLevel("none");
        remarksControl.setVisible(false);
    }
}