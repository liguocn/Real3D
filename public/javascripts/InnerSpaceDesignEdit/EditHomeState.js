/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.EditHomeState = {
    lights: null
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.enter = function () {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.OverheadView);

    //setup lights
    this.setupLight();

    //update meshes
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.exit = function () {
    "use strict";
    //clean lights
    this.releaseLight();

    //clean meshes
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.setupLight = function () {
    "use strict";
    if (this.lights !== null) {
        this.releaseLight();
    }
    this.lights = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.lights);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.lights.add(ambientLight);
};

REAL3D.InnerSpaceDesignEdit.EditHomeState.releaseLight = function () {
    "use strict";
    if (this.lights !== null) {
        REAL3D.RenderManager.scene.remove(this.lights);
        this.lights = null;
    }
};
