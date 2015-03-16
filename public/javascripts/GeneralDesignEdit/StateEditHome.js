/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.GeneralDesignEdit.EditHomeState = {
    light: null
};

REAL3D.GeneralDesignEdit.EditHomeState.enter = function () {
    "use strict";
    console.log("enter EditHomeState");
    REAL3D.GeneralDesignEdit.switchControlState(REAL3D.GeneralDesignEdit.EditCurveView);

    //setup light
    this.setupLight();

    //update meshes
    //REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
};

REAL3D.GeneralDesignEdit.EditHomeState.exit = function () {
    "use strict";
    console.log("exit EditHomeState");
    //clean light
    this.releaseLight();

    //clean meshes
};

REAL3D.GeneralDesignEdit.EditHomeState.setupLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.light.add(ambientLight);
};

REAL3D.GeneralDesignEdit.EditHomeState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};
