/*jslint plusplus: true */

var REAL3D = {};

REAL3D.isZero = function (v) {
    return (v === 0);
};

// REAL3D.StateBase = function() {
//     "use strict";
//     this.name = "StateBase";
// };

// REAL3D.StateBase.prototype = {
//     enter : function() {
//         "use strict";
//         console.log("Enter StateBase");
//     },

//     update : function() {
//         "use strict";
//     },

//     exit : function() {
//         "use strict";
//         console.log("Exit StateBase");
//     }
// };

// /*global console */
// REAL3D.StateManager = {
//     init : function() {
//         "use strict";
//         var initState = new REAL3D.StateBase();
//         this.enterState(initState);
//     },

//     update : function() {
//         "use strict";
//         this.currentState.update();
//     },

//     enterState : function(state) {
//         "use strict";
//         if (state === undefined || state === null) {
//             console.log("State is invalid");
//             return false;
//         }
//         if (this.currentState !== null) {
//             this.currentState.exit();
//         }
//         this.stateSet[state.stateName] = state;
//         this.currentState = state;
//         this.currentState.enter();
//     },

//     switchCurrentState : function(stateName) {
//         "use strict";
//         if (this.stateSet[stateName] === undefined) {
//             return false;
//         }
//         if (this.currentState !== null) {
//             if (this.currentState.stateName === stateName) {
//                 console.log("Switch to the same state: ", stateName);
//                 return true;
//             }
//             this.currentState.exit();
//         }
//         this.currentState = this.stateSet[stateName];
//         this.currentState.enter();
//         return true;
//     },

//     getState : function(stateName) {
//         "use strict";
//         return this.stateSet[stateName];
//     },

//     currentState : null,
//     stateSet : []
// };

/*global requestAnimationFrame */
/*properties Framework, init, run */
// REAL3D.Framework = {
//     init : function() {
//         "use strict";
//         REAL3D.StateManager.init();
//     },

//     run : function() {
//         "use strict";
//         REAL3D.StateManager.update();
//         var that = this;
//         requestAnimationFrame(function() {that.run(); });
//     }
// };
