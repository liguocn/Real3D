/*global REAL3D */
// REAL3D.HomepageState = function() {
//     "use strict";
//     REAL3D.StateBase.call(this);
//     this.stateName = "HomepageState";
// };

// REAL3D.HomepageState.prototype = Object.create(REAL3D.StateBase.prototype);

// REAL3D.HomepageState.prototype.enter = function() {
//     "use strict";
// };

// REAL3D.HomepageState.prototype.update = function() {
//     "use strict";
// };

// REAL3D.HomepageState.prototype.exit = function() {
//     "use strict";
// };


function EnterInnerSpaceDesignState() {
    console.log("EnterInnerSpaceDesignState");
    window.location.href = "/innerspacedesign";
    // $.ajax({
    //     type: "get",
    //     url: "/innerspacedesign",
    //     success: function(data) {
    //         console.log(data);
    //         location.href = "/innerspacedesign";
    //     }
    // });
}
