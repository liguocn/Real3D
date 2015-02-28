/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.EditHomeState = {

};

REAL3D.InnerSpaceDesignEdit.EditHomeState.enter = function () {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.OverheadView);

    //setup lights

    //update meshes
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.exit = function () {
    "use strict";
    //clean lights

    //clean meshes
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.update = function (timestamp) {
    "use strict";
};
