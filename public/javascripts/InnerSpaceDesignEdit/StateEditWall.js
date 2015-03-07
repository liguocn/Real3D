/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.EditWallState = {
    light: null,
    refObject: null
};

REAL3D.InnerSpaceDesignEdit.EditWallState.enter = function () {
    "use strict";
    console.log("enter EditWallState");
    //console.log("scene: ", REAL3D.RenderManager.scene);
    REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.EditWallView);

    //setup light
    this.setupEditLight();

    //setup reference objects
    this.setupReferenceObject();

    //update meshes
    REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
    //console.log("scene: ", REAL3D.RenderManager.scene);
};

REAL3D.InnerSpaceDesignEdit.EditWallState.exit = function () {
    "use strict";
    console.log("exit EditWallState");
    //clean light
    this.releaseLight();

    //clean reference objects
    this.releaseReferenceObject();
};

REAL3D.InnerSpaceDesignEdit.EditWallState.setupEditLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.light.add(ambientLight);
};

REAL3D.InnerSpaceDesignEdit.EditWallState.setupWalkLight = function () {
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

REAL3D.InnerSpaceDesignEdit.EditWallState.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallState.setupReferenceObject = function () {
    "use strict";
    this.releaseReferenceObject();
    this.refObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refObject);

    var spaceDist, subCount, subSpaceDist, maxDist, lineCount, lid, material, geometry, line, coord, subLineCount;
    spaceDist = 100;
    subCount = 5;
    subSpaceDist = spaceDist / subCount;
    maxDist = 1000;
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

REAL3D.InnerSpaceDesignEdit.EditWallState.releaseReferenceObject = function () {
    "use strict";
    if (this.refObject !== null) {
        REAL3D.RenderManager.scene.remove(this.refObject);
        this.refObject = null;
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallState.switchControlState = function (ctrlState) {
    "use strict";
    if (ctrlState === REAL3D.InnerSpaceDesignEdit.EditWallState.CONTROLSTATE.EDIT) {
        REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.EditWallView);
        this.setupEditLight();
        REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
        //console.log("scene: ", REAL3D.RenderManager.scene);
    } else if (ctrlState === REAL3D.InnerSpaceDesignEdit.EditWallState.CONTROLSTATE.WALK) {
        //REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.FreeWalkView);
        REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.OverheadView);
        this.setupWalkLight();
        REAL3D.InnerSpaceDesignEdit.WallData.updateDraw();
        //console.log("scene: ", REAL3D.RenderManager.scene);
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallState.switchEditState = function (editState) {
    "use strict";
    var mouseState;
    if (editState === REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.CREATE) {
        mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    } else if (editState === REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.DELETE) {
        mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.REMOVEUSERPOINT;
    } else if (editState === REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.INSERT) {
        mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.INSERTUSERPOINT;
    } else if (editState === REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.MERGE) {
        mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.MERGEUSERPOINT;
    } else {
        console.log("error: editState: ", editState);
        mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    }
    REAL3D.InnerSpaceDesignEdit.EditWallView.switchMouseState(mouseState);
};

REAL3D.InnerSpaceDesignEdit.EditWallState.CONTROLSTATE = {
    EDIT: 0,
    WALK: 1
};

REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE = {
    CREATE: 0,
    DELETE: 1,
    INSERT: 2,
    MERGE: 3
};
