function enterInnerSpaceDesignState() {
    console.log("EnterInnerSpaceDesignState");
    window.location.href = "/innerspacedesign/edit";
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
