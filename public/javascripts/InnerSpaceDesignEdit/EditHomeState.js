/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.EditHomeState = {
    light: null
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.enter = function () {
    "use strict";
    console.log("enter EditHomeState");
    REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.OverheadView);

    //setup light
    this.setupLight();

    //update meshes
    REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.exit = function () {
    "use strict";
    console.log("exit EditHomeState");
    //clean light
    this.releaseLight();

    //clean meshes
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.setupLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.light.add(ambientLight);
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};
