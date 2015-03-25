function enterInnerSpaceDesignState() {
    "use strict";
    console.log("EnterInnerSpaceDesignState");
    window.location.href = "/innerspacedesign";
}

function enterGeneralDesign() {
    "use strict";
    window.location.href = "/generaldesign";
}

function enterInspector() {
    "use strict";
    window.location.href = "/inspector";

function enterCageModeling() {
    "use strict";
    var subForm, item1, item2, designName;
    designName = 'CageTest';
    subForm = $('<form action="/cagemodeling" method="get"></form>');
    item1 = $('<input type="text" id="designName" name="designName">');
    if (designName !== null) {
        item1.val(designName);
    }
    item2 = $('<button type="submit">j</button>');
    item1.appendTo(subForm);
    item2.appendTo(subForm);
    console.log("subForm: ", subForm);
    console.log("designName: ", designName);
    subForm.submit();
}

function logOut() {
    "use strict";
    console.log("log out");
    $.ajax({
        type: "post",
        url: "/dologout",
        success: function(data) {
            console.log(data);
            location.href = "/";
        }
    });
}
