/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.CageModeling.CreateCageState = {
    light: null,
    refFrame: null
};

REAL3D.CageModeling.CreateCageState.enter = function () {
    "use strict";
    console.log("enter CageModeling.CreateCageState");
    REAL3D.CageModeling.switchControl(REAL3D.CageModeling.CreateCageControl);
    REAL3D.CageModeling.CreateCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.ROTATE);

    //setup light
    this.setupLight();

    this.setupRefFrame();

    //update meshes
    REAL3D.CageModeling.CageData.draw();
};

REAL3D.CageModeling.CreateCageState.exit = function () {
    "use strict";
    console.log("exit CreateCageState");
    this.releaseRefFrame();
    //clean light
    this.releaseLight();

    //clean meshes
};

REAL3D.CageModeling.CreateCageState.setupLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    //var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    //this.light.add(ambientLight);

    var hemisphereLight = new THREE.HemisphereLight(0xb2b2b2, 0x888888, 1);
    hemisphereLight.position.set(0, 0, 10000);
    this.light.add(hemisphereLight);
};

REAL3D.CageModeling.CreateCageState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};

REAL3D.CageModeling.CreateCageState.setupRefFrame = function () {
    "use strict";
    this.releaseRefFrame();
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);

    var maxDist, material, geometry, line;
    maxDist = 128;
    material = new THREE.LineBasicMaterial({color: 0xff0000});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(maxDist, 0, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    material = new THREE.LineBasicMaterial({color: 0x00ff00});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, maxDist, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    material = new THREE.LineBasicMaterial({color: 0x0000ff});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, maxDist));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);
};

REAL3D.CageModeling.CreateCageState.releaseRefFrame = function () {
    "use strict";
    if (this.refFrame !== null) {
        REAL3D.RenderManager.scene.remove(this.refFrame);
        this.refFrame = null;
    }
};
