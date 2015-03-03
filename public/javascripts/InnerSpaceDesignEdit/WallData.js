/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.InnerSpaceDesignEdit.WallData = {
    userPointTree: null,
    wallThick: null,
    wallHeight: null,
    globalPublisher: null,
    drawObject: null
};

REAL3D.InnerSpaceDesignEdit.WallData.init = function (wallData) {
    "use strict";
    this.releaseData();
    this.globalPublisher = new REAL3D.Publisher();
    this.drawObject = null;
    this.wallThick = 10;
    this.wallHeight = 200;
    this.userPointTree = new REAL3D.Wall.UserPointTree();
    if (wallData !== null) {
        this.wallThick = wallData.wallThick;
        this.wallHeight = wallData.wallHeight;
        this.userPointTree = wallData.userPointTree;
    }
    this.draw();
};

REAL3D.InnerSpaceDesignEdit.WallData.draw = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.drawObject);
    //draw objects
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, stump, assistFlag, wall3d;
    userPoints = this.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        stump = new REAL3D.Wall.Stump(userPoints[pid], this.wallThick * 2, this.drawObject, this.globalPublisher);
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
                wall3d = new REAL3D.Wall.Wall3D(userPoints[pid], neighbors[nid], this.wallThick, this.wallHeight,
                    this.drawObject, this.globalPublisher);
            }
        }
        assistFlag[pid] = -1;
    }
    console.log("draw");
    console.log("userPointTree", this.userPointTree);
    console.log("globalPublisher: ", this.globalPublisher);
};

REAL3D.InnerSpaceDesignEdit.WallData.updateDraw = function () {
    "use strict";
    if (this.globalPublisher !== null) {
        this.globalPublisher.publish("updateDraw");
    }
};

REAL3D.InnerSpaceDesignEdit.WallData.releaseDraw = function () {
    "use strict";
    if (this.globalPublisher !== null) {
        this.globalPublisher.publish("remove");
        //console.log("globalPublisher: ", this.globalPublisher);
    }
    if (this.drawObject !== null) {
        REAL3D.RenderManager.scene.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.InnerSpaceDesignEdit.WallData.unPackServerData = function (userData) {
    "use strict";
    var wallData, userPoints, userPointLen, pid, curPoint, neighbors, neiLen, nid, wallPoints;
    wallData = {};
    wallData.designName = REAL3D.InnerSpaceDesignEdit.designName;
    wallData.wallThick = userData.wallThick;
    wallData.wallHeight = userData.wallHeight;
    wallData.userPointTree = new REAL3D.Wall.UserPointTree();
    userPoints = userData.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = new REAL3D.Wall.UserPoint(userPoints[pid].posX, userPoints[pid].posY);
        wallData.userPointTree.points.push(curPoint);
    }
    wallPoints = wallData.userPointTree.points;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = wallPoints[pid];
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        curPoint.neighbors = [];
        for (nid = 0; nid < neiLen; nid++) {
            curPoint.neighbors.push(wallPoints[neighbors[nid]]);
        }
    }
    return wallData;
};

REAL3D.InnerSpaceDesignEdit.WallData.loadData = function () {
    "use strict";
    var postData, curState, wallData;
    postData = {
        designName: REAL3D.InnerSpaceDesignEdit.designName
    };
    curState = this;
    $.post("/InnerSpaceDesign/edit/load", $.param(postData, true), function (data) {
        console.log("  data return from server");
        if (data.success) {
            console.log("  loaded data: ", data);
            wallData = curState.unPackServerData(data.wallData);
            curState.init(wallData);
            //callback.apply(caller);
        }
    }, "json");
};

REAL3D.InnerSpaceDesignEdit.WallData.releaseData = function () {
    "use strict";
    this.releaseDraw();
    this.wallThick = null;
    this.wallHeight = null;
    this.userPointTree = null;
};

REAL3D.InnerSpaceDesignEdit.WallData.packUserData = function () {
    "use strict";
    var postData, points, userPointLen, pid, userPoints, curPoint, neighborLen, nid;
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
        designName: REAL3D.InnerSpaceDesignEdit.designName,
        wallThick: this.wallThick,
        wallHeight: this.wallHeight,
        userPointLen: userPointLen,
        userPoints: userPoints
    };
    console.log("postData: ", postData);
    return postData;
};

REAL3D.InnerSpaceDesignEdit.WallData.saveData = function () {
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

REAL3D.InnerSpaceDesignEdit.WallData.updateWallThick = function (thick) {
    "use strict";
    this.wallThick = thick;
    this.draw();
};

REAL3D.InnerSpaceDesignEdit.WallData.updateWallHeight = function (height) {
    "use strict";
    this.wallHeight = height;
    this.draw();
};
