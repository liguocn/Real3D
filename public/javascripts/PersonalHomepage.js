function enterInnerSpaceDesignState() {
    "use strict";
    console.log("EnterInnerSpaceDesignState");
    window.location.href = "/innerspacedesign";
}

function enterGeneralDesign() {
    "use strict";
    window.location.href = "/generaldesign";
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
