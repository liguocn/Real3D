/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.InnerSpaceDesignEdit.ViewPathData = {
    userPointTree: null,
    smoothUserPointTree: null,
    pathTree: null,
    smoothPathTree: null,
    drawObject: null,
    smoothPathDrawObject: null
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.init = function (viewPathData) {
    "use strict";
    this.releaseData();
    this.userPointTree = new REAL3D.CommonModel.UserPointTree();
    this.pathTree = new REAL3D.ViewPath.PathTree();
    if (viewPathData !== null) {
        this.userPointTree = viewPathData.userPointTree;
    }
    this.draw();
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.draw = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.drawObject);
    //construct pathTree from userPointTree
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, assistFlag;
    userPoints = this.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        this.pathTree.addPathPoint(userPoints[pid], this.drawObject);
    }
    this.userPointTree.updateAssistId();
    assistFlag = [];
    for (pid = 0; pid < userPointLen; pid++) {
        assistFlag[pid] = 1;
    }
    for (pid = 0; pid < userPointLen; pid++) {
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        for (nid = 0; nid < neiLen; nid++) {
            if (assistFlag[neighbors[nid].assistId] === 1) {
                this.pathTree.addPathEdge(pid, neighbors[nid].assistId, this.drawObject);
            }
        }
        assistFlag[pid] = -1;
    }
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.updateDraw = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.releaseDraw = function () {
    "use strict";
    if (this.pathTree !== null) {
        this.pathTree.publish("remove");
        this.pathTree = new REAL3D.ViewPath.PathTree();
    }
    if (this.drawObject !== null) {
        REAL3D.RenderManager.scene.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.loadData = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.releaseData = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.saveData = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.constructSmoothPathTree = function () {
    "use strict";
    var minAngThres, maxAngThres;
    this.releaseSmoothPathTree();
    this.smoothUserPointTree = this.userPointTree.copyTo();
    minAngThres = 10 * 0.0174532925;
    maxAngThres = 150 * 0.0174532925;
    this.subdivideLineSegments(this.smoothUserPointTree, minAngThres, maxAngThres);

    //construct pathTree from userPointTree
    this.smoothPathDrawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.smoothPathDrawObject);
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, assistFlag;
    this.smoothPathTree = new REAL3D.ViewPath.PathTree();
    userPoints = this.smoothUserPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        //this.smoothPathTree.addPathPoint(userPoints[pid], this.smoothPathDrawObject);
        this.smoothPathTree.addPathPoint(userPoints[pid], null);
    }
    this.smoothUserPointTree.updateAssistId();
    assistFlag = [];
    for (pid = 0; pid < userPointLen; pid++) {
        assistFlag[pid] = 1;
    }
    for (pid = 0; pid < userPointLen; pid++) {
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        for (nid = 0; nid < neiLen; nid++) {
            if (assistFlag[neighbors[nid].assistId] === 1) {
                this.smoothPathTree.addPathEdge(pid, neighbors[nid].assistId, this.smoothPathDrawObject);
            }
        }
        assistFlag[pid] = -1;
    }
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.subdivideLineSegments = function (tree, minAngThres, maxAngThres) {
    "use strict";
    var smoothRatio, minCosAngle, maxCosAngle, subdContinue, userPoints, pointLen, pid, curPos, nextPos, prePos, preDir, nextDir, cosAngle, preInsertPos, preInsertId, nextInsertPos, nextInsertId;
    smoothRatio = 0.1;
    minCosAngle = Math.cos(maxAngThres);
    maxCosAngle = Math.cos(minAngThres);
    subdContinue = true;
    while (subdContinue) {
        subdContinue = false;
        tree.updateAssistId();
        userPoints = tree.points;
        pointLen = userPoints.length;
        for (pid = 0; pid < pointLen; pid++) {
            if (userPoints[pid].neighbors.length === 2) {
                curPos = userPoints[pid].pos;
                prePos = userPoints[pid].neighbors[0].pos;
                nextPos = userPoints[pid].neighbors[1].pos;
                preDir = REAL3D.Vector2.sub(prePos, curPos);
                preDir.unify();
                nextDir = REAL3D.Vector2.sub(curPos, nextPos);
                nextDir.unify();
                cosAngle = REAL3D.Vector2.dotProduct(preDir, nextDir);
                if (cosAngle < maxCosAngle && cosAngle > minCosAngle) {
                    preInsertPos = REAL3D.Vector2.add(REAL3D.Vector2.scale(prePos, smoothRatio), REAL3D.Vector2.scale(curPos, 1 - smoothRatio));
                    preInsertId = tree.addPoint(preInsertPos.getX(), preInsertPos.getY());
                    tree.connectPoints(preInsertId, userPoints[pid].neighbors[0].assistId);
                    nextInsertPos = REAL3D.Vector2.add(REAL3D.Vector2.scale(nextPos, smoothRatio), REAL3D.Vector2.scale(curPos, 1 - smoothRatio));
                    nextInsertId = tree.addPoint(nextInsertPos.getX(), nextInsertPos.getY());
                    tree.connectPoints(nextInsertId, userPoints[pid].neighbors[1].assistId);
                    tree.connectPoints(preInsertId, nextInsertId);
                    tree.deletePoint(pid);
                    subdContinue = true;
                    break;
                }
            }
        }
    }
    console.log("minCosAngle: ", minCosAngle, " maxCosAngle: ", maxCosAngle, " point count: ", tree.points.length);
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.releaseSmoothPathTree = function () {
    "use strict";
    if (this.smoothPathTree !== null) {
        this.smoothPathTree.publish("remove");
        this.smoothPathTree = null;
    }
    this.smoothUserPointTree = null;
    if (this.smoothPathDrawObject !== null) {
        REAL3D.RenderManager.scene.remove(this.smoothPathDrawObject);
        this.smoothPathDrawObject = null;
    }
};
