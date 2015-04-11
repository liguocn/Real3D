/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.CageModeling.EditCageState = {
    light: null,
    refFrame: null
};

REAL3D.CageModeling.EditCageState.enter = function () {
    "use strict";
    console.log("enter CageModeling.EditCageState");
    REAL3D.CageModeling.switchControl(REAL3D.CageModeling.EditCageControl);
    REAL3D.CageModeling.EditCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.ROTATE);
    REAL3D.CageModeling.EditCageControl.switchEditMode(REAL3D.CageModeling.EditMode.EDIT);
    REAL3D.CageModeling.CageData.pickCageMesh(false);

    //setup light
    this.setupLight();

    this.setupRefFrame();

    //update meshes
    REAL3D.CageModeling.CageData.draw();
};

REAL3D.CageModeling.EditCageState.exit = function () {
    "use strict";
    console.log("exit EditCageState");
    this.releaseRefFrame();
    //clean light
    this.releaseLight();

    //clean meshes
};

REAL3D.CageModeling.EditCageState.setupLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    // var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    // this.light.add(ambientLight);

    var hemisphereLight, pointLight1, pointLight2;
    hemisphereLight = new THREE.HemisphereLight(0xb2b2b2, 0x888888, 1);
    hemisphereLight.position.set(0, 0, 10000);
    this.light.add(hemisphereLight);
    pointLight1 = new THREE.PointLight(0xb2b2b2, 2, 2000);
    pointLight1.position.set(1000, 1000, 1000);
    this.light.add(pointLight1);
    pointLight2 = new THREE.PointLight(0xb2b2b2, 2, 2000);
    pointLight2.position.set(-1000, -1000, -1000);
    this.light.add(pointLight2);
};

REAL3D.CageModeling.EditCageState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};

REAL3D.CageModeling.EditCageState.setupRefFrame = function () {
    "use strict";
    this.releaseRefFrame();
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);

    var spaceDist, maxDist, lineCount, lid, material, geometry, line, coord;
    spaceDist = 100;
    maxDist = 1000;
    lineCount = maxDist / spaceDist;

    material = new THREE.LineBasicMaterial({color: 0xee2b8b});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-maxDist, 0, 0), new THREE.Vector3(maxDist, 0, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    material = new THREE.LineBasicMaterial({color: 0x2b8bee});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, -maxDist), new THREE.Vector3(0, 0, maxDist));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    material = new THREE.LineBasicMaterial({color: 0x6bae2b});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, -maxDist, 0), new THREE.Vector3(0, maxDist, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    material = new THREE.LineBasicMaterial({color: 0xbbbbbb});
    for (lid = 1; lid <= lineCount; lid++) {
        coord = lid * spaceDist;
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, 0, coord), new THREE.Vector3(maxDist, 0, coord));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, 0, -coord), new THREE.Vector3(maxDist, 0, -coord));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, 0, -maxDist), new THREE.Vector3(coord, 0, maxDist));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, 0, -maxDist), new THREE.Vector3(-coord, 0, maxDist));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
    }
};

REAL3D.CageModeling.EditCageState.releaseRefFrame = function () {
    "use strict";
    if (this.refFrame !== null) {
        REAL3D.RenderManager.scene.remove(this.refFrame);
        this.refFrame = null;
    }
};

REAL3D.CageModeling.EditCageState.switchEditMode = function (editMode) {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchEditMode(editMode);
    REAL3D.CageModeling.CageData.generateOperation(false);
};

REAL3D.CageModeling.EditCageState.changeSmoothValue = function (smoothValue) {
    "use strict";
    // if (REAL3D.CageModeling.EditCageControl.editMode === REAL3D.CageModeling.EditMode.EDIT) {
    //     REAL3D.CageModeling.CageData.changeSmoothValue(smoothValue);
    // }
    REAL3D.CageModeling.CageData.changeSmoothValue(smoothValue);
};
