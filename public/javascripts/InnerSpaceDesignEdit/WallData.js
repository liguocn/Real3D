/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.InnerSpaceDesignEdit.WallData = {
    userPointTree: null,
    wallThick: null,
    wallHeight: null,
    globalPublisher: null,
    drawObjects: null
};

REAL3D.InnerSpaceDesignEdit.WallData.init = function (wallData) {
    "use strict";
    this.releaseData();
    this.globalPublisher = new REAL3D.Publisher();
    this.drawObjects = new THREE.Object3D();
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
    this.drawObjects = new THREE.Object3D();
    //draw objects
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, stump, assistFlag, wall3d;
    userPoints = this.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        stump = new REAL3D.Wall.Stump(userPoints[pid], this.wallThick * 2, this.drawObjects, this.globalPublisher);
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
                    this.drawObjects, this.globalPublisher);
            }
        }
        assistFlag[pid] = -1;
    }
    // for (pid = 0; pid < userPointLen; pid++) {
    //     userPoints[pid].publish("updateSubscriber");
    // }
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
    }
    if (this.drawObjects !== null) {
        REAL3D.RenderManager.scene.remove(this.drawObjects);
        this.drawObjects = null;
    }
};

REAL3D.InnerSpaceDesignEdit.WallData.loadData = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.WallData.releaseData = function () {
    "use strict";
    this.releaseDraw();
    this.wallThick = null;
    this.wallHeight = null;
    this.userPointTree = null;
};

REAL3D.InnerSpaceDesignEdit.WallData.saveData = function () {
    "use strict";
};
