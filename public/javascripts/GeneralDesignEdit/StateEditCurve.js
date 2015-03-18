/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.GeneralDesignEdit.EditCurveState = {
    light: null,
    refObject: null,
    curveEditMode: null,
    currentSmoothValue: 0.24
};

REAL3D.GeneralDesignEdit.EditCurveState.enter = function () {
    "use strict";
    console.log("enter EditCurveState");
    //console.log("scene: ", REAL3D.RenderManager.scene);
    REAL3D.GeneralDesignEdit.switchControlState(REAL3D.GeneralDesignEdit.EditCurveView);

    //setup light
    this.setupEditLight();

    //setup reference objects
    this.setupReferenceObject();

    //update meshes
    //REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
};

REAL3D.GeneralDesignEdit.EditCurveState.exit = function () {
    "use strict";
    console.log("exit EditCurveState");
    //clean light
    this.releaseLight();

    //clean reference objects
    this.releaseReferenceObject();
};

REAL3D.GeneralDesignEdit.EditCurveState.setupEditLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.light.add(ambientLight);
};

REAL3D.GeneralDesignEdit.EditCurveState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};

REAL3D.GeneralDesignEdit.EditCurveState.setupReferenceObject = function () {
    "use strict";
    this.releaseReferenceObject();
    this.refObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refObject);

    var spaceDist, subCount, subSpaceDist, maxDist, lineCount, lid, material, geometry, line, coord, subLineCount;
    spaceDist = 100;
    subCount = 2;
    subSpaceDist = spaceDist / subCount;
    maxDist = 1000;
    lineCount = maxDist / spaceDist;

    material = new THREE.LineBasicMaterial({color: 0x999999});

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-maxDist, 0, -1), new THREE.Vector3(maxDist, 0, -1));
    line = new THREE.Line(geometry, material);
    this.refObject.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, -maxDist, -1), new THREE.Vector3(0, maxDist, -1));
    line = new THREE.Line(geometry, material);
    this.refObject.add(line);

    material = new THREE.LineBasicMaterial({color: 0xbbbbbb});
    for (lid = 1; lid <= lineCount; lid++) {
        coord = lid * spaceDist;

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, -maxDist, -2), new THREE.Vector3(coord, maxDist, -2));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, -maxDist, -2), new THREE.Vector3(-coord, maxDist, -2));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, coord, -2), new THREE.Vector3(maxDist, coord, -2));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, -coord, -2), new THREE.Vector3(maxDist, -coord, -2));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);
    }

    subLineCount = maxDist / subSpaceDist;
    material = new THREE.LineBasicMaterial({color: 0xcccccc});
    for (lid = 1; lid <= subLineCount; lid++) {
        if (lid % subCount === 0) {
            continue;
        }
        coord = lid * subSpaceDist;

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, -maxDist, -3), new THREE.Vector3(coord, maxDist, -3));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, -maxDist, -3), new THREE.Vector3(-coord, maxDist, -3));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, coord, -3), new THREE.Vector3(maxDist, coord, -3));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, -coord, -3), new THREE.Vector3(maxDist, -coord, -3));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);
    }
};

REAL3D.GeneralDesignEdit.EditCurveState.releaseReferenceObject = function () {
    "use strict";
    if (this.refObject !== null) {
        REAL3D.RenderManager.scene.remove(this.refObject);
        this.refObject = null;
    }
};

REAL3D.GeneralDesignEdit.EditCurveState.switchCurveEditMode = function (curveEditMode) {
    "use strict";
    this.curveEditMode = curveEditMode;
    if (this.curveEditMode === REAL3D.GeneralDesignEdit.EditCurveState.CurveEditMode.CREATE) {
        REAL3D.GeneralDesignEdit.EditCurveView.switchMouseMode(REAL3D.GeneralDesignEdit.MouseState.NONE);
    } else if (this.curveEditMode === REAL3D.GeneralDesignEdit.EditCurveState.CurveEditMode.EDIT) {
        REAL3D.GeneralDesignEdit.EditCurveView.switchMouseMode(REAL3D.GeneralDesignEdit.MouseState.EDITUSERPOINT);
    } else if (this.curveEditMode === REAL3D.GeneralDesignEdit.EditCurveState.CurveEditMode.REMOVE) {
        REAL3D.GeneralDesignEdit.EditCurveView.switchMouseMode(REAL3D.GeneralDesignEdit.MouseState.REMOVE);
    } else if (this.curveEditMode === REAL3D.GeneralDesignEdit.EditCurveState.CurveEditMode.MERGE) {
        REAL3D.GeneralDesignEdit.EditCurveView.switchMouseMode(REAL3D.GeneralDesignEdit.MouseState.MERGE);
    }
};

REAL3D.GeneralDesignEdit.EditCurveState.CurveEditMode = {
    CREATE: 0,
    EDIT: 1,
    REMOVE: 2,
    MERGE: 3
};

REAL3D.GeneralDesignEdit.EditCurveState.changeSmoothValue = function (smoothValue) {
    "use strict";
    if (this.curveEditMode === REAL3D.GeneralDesignEdit.EditCurveState.CurveEditMode.EDIT) {

    } else {
        this.currentSmoothValue = smoothValue;
    }
};

