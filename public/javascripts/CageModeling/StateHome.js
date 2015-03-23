/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.CageModeling.HomeState = {
    light: null
};

REAL3D.CageModeling.HomeState.enter = function () {
    "use strict";
    console.log("enter CageModeling.HomeState");
    REAL3D.CageModeling.switchControl(REAL3D.CageModeling.HomeControl);

    //setup light
    this.setupLight();

    //update meshes
    REAL3D.CageModeling.CageData.draw();
};

REAL3D.CageModeling.HomeState.exit = function () {
    "use strict";
    console.log("exit EditHomeState");
    //clean light
    this.releaseLight();

    //clean meshes
};

REAL3D.CageModeling.HomeState.setupLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.light.add(ambientLight);
};

REAL3D.CageModeling.HomeState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};
