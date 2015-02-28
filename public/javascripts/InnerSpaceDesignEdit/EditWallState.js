/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.EditWallState = {

};

REAL3D.InnerSpaceDesignEdit.EditWallState.enter = function () {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.EditWallView);

    //setup lights

    //update meshes
};

REAL3D.InnerSpaceDesignEdit.EditWallState.exit = function () {
    "use strict";
    //clean lights

    //clean meshes
};

REAL3D.InnerSpaceDesignEdit.EditWallState.update = function (timestamp) {
    "use strict";
};
