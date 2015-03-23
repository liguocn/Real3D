/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.CageModeling.HomeState = {
    light: null,
    refFrame: null
};

REAL3D.CageModeling.HomeState.enter = function () {
    "use strict";
    console.log("enter CageModeling.HomeState");
    REAL3D.CageModeling.switchControl(REAL3D.CageModeling.HomeControl);
    REAL3D.CageModeling.HomeControl.switchTransformMode(REAL3D.CageModeling.TransformMode.TRANSLATE);

    //setup light
    this.setupLight();

    this.setupRefFrame();

    //update meshes
    REAL3D.CageModeling.CageData.draw();
};

REAL3D.CageModeling.HomeState.exit = function () {
    "use strict";
    console.log("exit EditHomeState");
    this.releaseRefFrame();
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

REAL3D.CageModeling.HomeState.setupRefFrame = function () {
    "use strict";
    this.releaseRefFrame();
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);

    var spaceDist, maxDist, lineCount, lid, material, geometry, line, coord, subLineCount;
    spaceDist = 250;
    maxDist = 1000;
    lineCount = maxDist / spaceDist;

    material = new THREE.LineBasicMaterial({color: 0x999999});

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-maxDist, 0, 0), new THREE.Vector3(maxDist, 0, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, -maxDist, 0), new THREE.Vector3(0, maxDist, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, -maxDist), new THREE.Vector3(0, 0, maxDist));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-maxDist, 0, 0), new THREE.Vector3(maxDist, 0, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, -maxDist, 0), new THREE.Vector3(0, maxDist, 0));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, -maxDist), new THREE.Vector3(0, 0, maxDist));
    line = new THREE.Line(geometry, material);
    this.refFrame.add(line);

    material = new THREE.LineBasicMaterial({color: 0xbbbbbb});
    for (lid = 1; lid <= lineCount; lid++) {
        coord = lid * spaceDist;

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, -maxDist, 0), new THREE.Vector3(coord, maxDist, 0));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, -maxDist, 0), new THREE.Vector3(-coord, maxDist, 0));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, coord, 0), new THREE.Vector3(maxDist, coord, 0));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, -coord, 0), new THREE.Vector3(maxDist, -coord, 0));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);

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

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, coord, -maxDist), new THREE.Vector3(0, coord, maxDist));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, -coord, -maxDist), new THREE.Vector3(0, -coord, maxDist));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, -maxDist, coord), new THREE.Vector3(0, maxDist, coord));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, -maxDist, -coord), new THREE.Vector3(0, maxDist, -coord));
        line = new THREE.Line(geometry, material);
        this.refFrame.add(line);
    }
};

REAL3D.CageModeling.HomeState.releaseRefFrame = function () {
    "use strict";
    if (this.refFrame !== null) {
        REAL3D.RenderManager.scene.remove(this.refFrame);
        this.refFrame = null;
    }
};
