/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.EditRoamState = {
    light: null,
    refObject: null
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.enter = function () {
    "use strict";
    console.log("enter EditRoamState");
    this.switchRoamMode(REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode.FREE);
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.exit = function () {
    "use strict";
    console.log("exit EditWallState");
    //clean light
    this.releaseLight();

    //clean reference objects
    this.releaseReferenceObject();
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.setupRoamLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);

    var ambientLight, dirLight1, dirLight2, dirLight3;

    ambientLight = new THREE.AmbientLight(0xb2b2b2);
    this.light.add(ambientLight);

    dirLight1 = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight1.position.set(1, 0, 1);
    this.light.add(dirLight1);

    dirLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight2.position.set(-1, 1.73, 1);
    this.light.add(dirLight2);

    dirLight3 = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight3.position.set(-1, -1.73, 1);
    this.light.add(dirLight3);
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.setupReferenceObject = function () {
    "use strict";
    this.releaseReferenceObject();
    this.refObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refObject);

    var spaceDist, subCount, subSpaceDist, maxDist, lineCount, lid, material, geometry, line, coord, subLineCount;
    spaceDist = 100;
    subCount = 2;
    subSpaceDist = spaceDist / subCount;
    maxDist = 2000;
    lineCount = maxDist / spaceDist;

    material = new THREE.LineBasicMaterial({color: 0x000000});

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-maxDist, 0, -1), new THREE.Vector3(maxDist, 0, -1));
    line = new THREE.Line(geometry, material);
    this.refObject.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, -maxDist, -1), new THREE.Vector3(0, maxDist, -1));
    line = new THREE.Line(geometry, material);
    this.refObject.add(line);

    material = new THREE.LineBasicMaterial({color: 0x888888});
    for (lid = 1; lid <= lineCount; lid++) {
        coord = lid * spaceDist;

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, -maxDist, -1), new THREE.Vector3(coord, maxDist, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, -maxDist, -1), new THREE.Vector3(-coord, maxDist, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, coord, -1), new THREE.Vector3(maxDist, coord, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, -coord, -1), new THREE.Vector3(maxDist, -coord, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);
    }

    subLineCount = maxDist / subSpaceDist;
    material = new THREE.LineBasicMaterial({color: 0xbbbbbb});
    for (lid = 1; lid <= subLineCount; lid++) {
        if (lid % subCount === 0) {
            continue;
        }
        coord = lid * subSpaceDist;

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, -maxDist, -1), new THREE.Vector3(coord, maxDist, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, -maxDist, -1), new THREE.Vector3(-coord, maxDist, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, coord, -1), new THREE.Vector3(maxDist, coord, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, -coord, -1), new THREE.Vector3(maxDist, -coord, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);
    }
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.releaseReferenceObject = function () {
    "use strict";
    if (this.refObject !== null) {
        REAL3D.RenderManager.scene.remove(this.refObject);
        this.refObject = null;
    }
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.switchRoamMode = function (roamMode) {
    "use strict";
    if (roamMode === REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode.FREE) {
        REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.FreeWalkView);
        this.setupRoamLight();
        this.setupReferenceObject();
        REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
    } else if (roamMode === REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode.OVERHEAD) {
        REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.OverheadView);
        this.setupRoamLight();
        this.setupReferenceObject();
        REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
    } else if (roamMode === REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode.PATHCONSTAINED) {

    }
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.switchPathEditMode = function (pathEditMode) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode = {
    FREE: 0,
    OVERHEAD: 1,
    PATHCONSTAINED: 2
};

REAL3D.InnerSpaceDesignEdit.EditRoamState.PathEditMode = {
    CREATE: 0,
    REMOVE: 1,
    INSERT: 2,
    ROAM: 3
};
