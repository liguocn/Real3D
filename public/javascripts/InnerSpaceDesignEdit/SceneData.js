/*jslint plusplus: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.InnerSpaceDesignEdit.SceneData = {
    designName: "",
    cameraOrthoPosition: null,
    cameraPerspPosition: null,
    wallThick: 0,
    wallHeight: 0,
    userPointTree: null,
    wall2ds: [],
    wallBoxes: [],
    wall3ds: [],
    refFrame: null,
    refObject: null,
    lightObject: null
};

REAL3D.InnerSpaceDesignEdit.SceneData.init = function (sceneData) {
    "use strict";
    if (sceneData === null) {
        this.designName = "";
        this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
        this.cameraPerspPosition = new THREE.Vector3(0, 0, 100);
        this.wallThick = REAL3D.InnerSpaceDesignEdit.WALLTHICK;
        this.wallHeight = REAL3D.InnerSpaceDesignEdit.WALLHEIGHT;
        this.userPointTree = new REAL3D.Wall.UserPointTree();
    } else {
        this.designName = sceneData.designName;
        this.cameraOrthoPosition = sceneData.cameraOrthoPosition;
        this.cameraPerspPosition = sceneData.cameraPerspPosition;
        this.wallThick = sceneData.wallThick;
        this.wallHeight = sceneData.wallHeight;
        this.userPointTree = sceneData.userPointTree;
    }
    REAL3D.RenderManager.scene.remove(this.refFrame);
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
    //render scene data
    //console.log("render scene data");

    this.drawCommonScene();
    this.switchTo2DContent();
};

REAL3D.InnerSpaceDesignEdit.SceneData.drawCommonScene = function () {
    "use strict";
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, userPointBox, assistFlag, wall2d, wall3d;
    this.wall2ds = [];
    this.wallBoxes = [];
    userPoints = this.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        userPointBox = new REAL3D.Wall.UserPointBox(userPoints[pid], this.wallThick * 2, this.refFrame);
        this.wallBoxes.push(userPointBox);
    }
    this.userPointTree.updateAssistId();
    assistFlag = [];
    for (pid = 0; pid < userPointLen; pid++) {
        assistFlag[pid] = 1;
        userPoints[pid].updateNeighborOrder();
    }
    for (pid = 0; pid < userPointLen; pid++) {
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        for (nid = 0; nid < neiLen; nid++) {
            if (assistFlag[neighbors[nid].assistId] === 1) {
                wall2d = new REAL3D.Wall.Wall2D(userPoints[pid], neighbors[nid], this.wallThick);
                wall3d = new REAL3D.Wall.Wall3D(wall2d, this.wallHeight, this.refFrame);
                this.wall2ds.push(wall2d);
                this.wall3ds.push(wall3d);
            }
        }
        assistFlag[pid] = -1;
    }
    console.log("publish events");
    for (pid = 0; pid < userPointLen; pid++) {
        userPoints[pid].publish("updateSubscriber");
        //userPoints[pid].publish("updateMesh");
    }

    this.displayRefObject();
};

REAL3D.InnerSpaceDesignEdit.SceneData.switchTo2DContent = function () {
    "use strict";
    this.refFrame.remove(this.lightObject);
    this.lightObject = new THREE.Object3D();
    this.refFrame.add(this.lightObject);
    // var ambientLight = new THREE.AmbientLight(0xa77f77);
    var ambientLight = new THREE.AmbientLight(0x002b2b);
    this.lightObject.add(ambientLight);
};

REAL3D.InnerSpaceDesignEdit.SceneData.switchTo3DContent = function () {
    "use strict";
    this.refFrame.remove(this.lightObject);
    this.lightObject = new THREE.Object3D();
    this.refFrame.add(this.lightObject);

    var ambientLight, dirLight1, dirLight2, dirLight3, wallLen, wid;

    ambientLight = new THREE.AmbientLight(0xb2b2b2);
    this.lightObject.add(ambientLight);

    dirLight1 = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight1.position.set(1, 0, 1);
    this.lightObject.add(dirLight1);

    dirLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight2.position.set(-1, 1.73, 1);
    this.lightObject.add(dirLight2);

    dirLight3 = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight3.position.set(-1, -1.73, 1);
    this.lightObject.add(dirLight3);

    wallLen = this.wall2ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall2ds[wid].updateMesh();
    }
};

REAL3D.InnerSpaceDesignEdit.SceneData.displayRefObject = function () {
    "use strict";
    this.refFrame.remove(this.refObject);
    this.refObject = new THREE.Object3D();
    this.refFrame.add(this.refObject);

    var spaceDist, maxDist, lineCount, lid, material, geometry, line, coord;
    spaceDist = 100;
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

    material = new THREE.LineBasicMaterial({color: 0xa0a0a0});
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
};

REAL3D.InnerSpaceDesignEdit.SceneData.hideRefObject = function () {
    "use strict";
    this.refFrame.remove(this.refObject);
};

REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData = function () {
    "use strict";
    var postData = this.packUserData();
    console.log("postData: ", postData);
    $.post("/InnerSpaceDesign/edit/save", $.param(postData, true), function (data) {
        console.log("  data return from server:", data);
        if (data.saved === -1) {
            window.location.href = "/DoLogin";
        }
    }, "json");
};

REAL3D.InnerSpaceDesignEdit.SceneData.packUserData = function () {
    "use strict";
    var camOrthoPos, camPerspPos, postData, points, userPointLen, pid, userPoints, curPoint, neighborLen, nid;
    camOrthoPos = this.cameraOrthoPosition;
    camPerspPos = this.cameraPerspPosition;
    this.userPointTree.updateAssistId();
    userPoints = [];
    points = this.userPointTree.points;
    userPointLen = points.length;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = points[pid];
        userPoints.push(curPoint.pos.getX());
        userPoints.push(curPoint.pos.getY());
        neighborLen = curPoint.neighbors.length;
        userPoints.push(neighborLen);
        for (nid = 0; nid < neighborLen; nid++) {
            userPoints.push(curPoint.neighbors[nid].assistId);
        }
    }
    postData = {
        designName: this.designName,
        cameraOrthoPosition: [camOrthoPos.x, camOrthoPos.y, camOrthoPos.z],
        cameraPerspPosition: [camPerspPos.x, camPerspPos.y, camPerspPos.z],
        wallThick: this.wallThick,
        wallHeight: this.wallHeight,
        userPointLen: userPointLen,
        userPoints: userPoints
    };
    return postData;
};

REAL3D.InnerSpaceDesignEdit.SceneData.unPackUserData = function (userData) {
    "use strict";
    var sceneData, camOrthoPos, camPerspPos, userPoints, userPointLen, pid, curPoint, neighbors, neiLen, nid, scenePoints;
    camOrthoPos = userData.cameraOrthoPosition;
    camPerspPos = userData.cameraPerspPosition;
    sceneData = {};
    sceneData.designName = this.designName;
    sceneData.cameraOrthoPosition = new THREE.Vector3(camOrthoPos[0], camOrthoPos[1], camOrthoPos[2]);
    sceneData.cameraPerspPosition = new THREE.Vector3(camPerspPos[0], camPerspPos[1], camPerspPos[2]);
    sceneData.wallThick = userData.wallThick;
    sceneData.wallHeight = userData.wallHeight;
    sceneData.userPointTree = new REAL3D.Wall.UserPointTree();
    userPoints = userData.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = new REAL3D.Wall.UserPoint(userPoints[pid].posX, userPoints[pid].posY);
        sceneData.userPointTree.points.push(curPoint);
    }
    scenePoints = sceneData.userPointTree.points;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = scenePoints[pid];
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        curPoint.neighbors = [];
        for (nid = 0; nid < neiLen; nid++) {
            curPoint.neighbors.push(scenePoints[neighbors[nid]]);
        }
    }
    return sceneData;
};

REAL3D.InnerSpaceDesignEdit.SceneData.loadUserData = function (callback) {
    "use strict";
    var postData, curState, sceneData;
    postData = {
        designName: this.designName
    };
    curState = this;
    $.post("/InnerSpaceDesign/edit/load", $.param(postData, true), function (data) {
        console.log("  data return from server");
        if (data.success) {
            console.log("  loaded data: ", data);
            sceneData = curState.unPackUserData(data.sceneData);
            REAL3D.InnerSpaceDesignEdit.initUserData(sceneData);
            callback();
        }
    }, "json");
};

REAL3D.InnerSpaceDesignEdit.SceneData.updateWallThick = function (thick) {
    "use strict";
    var wallLen, wid, boxLen, bid;
    wallLen = this.wall2ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall2ds[wid].thick = thick;
        this.wall2ds[wid].updateMesh();
    }
    boxLen = this.wallBoxes.length;
    for (bid = 0; bid < boxLen; bid++) {
        this.wallBoxes[bid].updateBoxLength(thick * 2);
    }
    this.wallThick = thick;
};

REAL3D.InnerSpaceDesignEdit.SceneData.updateWallHeight = function (height) {
    "use strict";
    var wallLen, wid;
    wallLen = this.wall3ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall3ds[wid].height = height;
        this.wall3ds[wid].updateMesh();
    }
    this.wallHeight = height;
};