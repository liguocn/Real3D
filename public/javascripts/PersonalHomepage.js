function enterInnerSpaceDesignState() {
    console.log("EnterInnerSpaceDesignState");
    window.location.href = "/innerspacedesign";
}

function logOut() {
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
