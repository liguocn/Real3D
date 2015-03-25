/*jslint plusplus: true */
/*global REAL3D, console */
REAL3D.CommonModel = {
};

REAL3D.CommonModel.SELECTRADIUS = 200;
REAL3D.CommonModel.INSERTRADIUS = 0.6;

REAL3D.CommonModel.UserPoint = function (posX, posY) {
    "use strict";
    REAL3D.Publisher.call(this);
    this.pos = new REAL3D.Vector2(posX, posY);
    this.neighbors = [];
    this.assistId = null;
};

REAL3D.CommonModel.UserPoint.prototype = Object.create(REAL3D.Publisher.prototype);

//update the order of neighbors into anticlockwise
REAL3D.CommonModel.UserPoint.prototype.updateNeighborOrder = function () {
    "use strict";
    var neigLen, neighbors, neigVectors, curVector, nid, sortVectors;
    neigLen = this.neighbors.length;
    if (neigLen > 2) {
        //console.log("updateNeighborOrder: ", neigLen);
        neighbors = this.neighbors;
        neigVectors = [];
        for (nid = 0; nid < neigLen; nid++) {
            curVector = neighbors[nid].pos.copyTo();
            curVector.subVector(this.pos);
            curVector.unify();
            neigVectors.push(curVector);
        }
        sortVectors = [];
        for (nid = 0; nid < neigLen; nid++) {
            curVector = neigVectors[nid];
            if (curVector.getY() < 0) {
                sortVectors.push({index: nid, x: curVector.getX()});
            } else {
                sortVectors.push({index: nid, x: 2 - curVector.getX()});
            }
        }
        sortVectors.sort(function (a, b) {
            return (a.x - b.x);
        });
        this.neighbors = [];
        for (nid = 0; nid < neigLen; nid++) {
            this.neighbors.push(neighbors[sortVectors[nid].index]);
        }
    }
};

REAL3D.CommonModel.UserPointTree = function () {
    "use strict";
    this.points = [];
};

REAL3D.CommonModel.UserPointTree.prototype = {
    addPoint : function (worldPosX, worldPosY) {
        "use strict";
        var newUserPoint = new REAL3D.CommonModel.UserPoint(worldPosX, worldPosY);
        this.points.push(newUserPoint);
        return (this.points.length - 1);
    },

    deletePoint: function (index) {
        "use strict";
        var delPoint, neigLen, neighbors, curPoint, curLen, nid, cid;
        delPoint = this.points[index];
        neighbors = delPoint.neighbors;
        neigLen = neighbors.length;
        for (nid = 0; nid < neigLen; nid++) {
            curPoint = neighbors[nid];
            curLen = curPoint.neighbors.length;
            for (cid = 0; cid < curLen; cid++) {
                if (delPoint === curPoint.neighbors[cid]) {
                    curPoint.neighbors.splice(cid, 1);
                    break;
                }
            }
        }
        this.points.splice(index, 1);
    },

    connectPoints : function (index1, index2) {
        "use strict";
        var point1, point2;
        point1 = this.points[index1];
        point2 = this.points[index2];
        point1.neighbors.push(point2);
        point2.neighbors.push(point1);
        point1.updateNeighborOrder();
        point2.updateNeighborOrder();
    },

    disConnectPoints : function (point1, point2) {
        "use strict";
        var neighbors1, neigLen1, nid, neighbors2, neigLen2;
        neighbors1 = point1.neighbors;
        neigLen1 = neighbors1.length;
        for (nid = 0; nid < neigLen1; nid++) {
            if (point2 === neighbors1[nid]) {
                point1.neighbors.splice(nid, 1);
                break;
            }
        }
        neighbors2 = point2.neighbors;
        neigLen2 = neighbors2.length;
        for (nid = 0; nid < neigLen2; nid++) {
            if (point1 === neighbors2[nid]) {
                point2.neighbors.splice(nid, 1);
                break;
            }
        }
    },

    selectPoint : function (worldPosX, worldPosY) {
        "use strict";
        var pid, dist, curPoint, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint !== null) {
                dist = (worldPosX - curPoint.pos.getX()) * (worldPosX - curPoint.pos.getX()) + (worldPosY - curPoint.pos.getY()) * (worldPosY - curPoint.pos.getY());
                if (dist < REAL3D.CommonModel.SELECTRADIUS) {
                    return pid;
                }
            }
        }
        return -1;
    },

    mergePoint: function (index) {
        "use strict";
        var neighbors, neigLen, curPoints, curLen, cid, isConnected;
        neighbors = this.points[index].neighbors;
        neigLen = neighbors.length;
        if (neigLen === 1) {
            this.deletePoint(index);
        } else if (neigLen === 2) {
            this.deletePoint(index);
            isConnected = false;
            curPoints = neighbors[0].neighbors;
            curLen = curPoints.length;
            for (cid = 0; cid < curLen; cid++) {
                if (neighbors[1] === curPoints[cid]) {
                    isConnected = true;
                    break;
                }
            }
            if (isConnected === false) {
                neighbors[0].neighbors.push(neighbors[1]);
                neighbors[1].neighbors.push(neighbors[0]);
                neighbors[0].updateNeighborOrder();
                neighbors[1].updateNeighborOrder();
            }
        }
    },

    insertPointOnEdge: function (worldPosX, worldPosY) {
        "use strict";
        var userPointLen, assistFlag, pid, neighbors, neigLen, nid, curPoint, neigPoint, insertPos, lineLen0, lineLen1, lineLen2, deltaLen, insertId, newUserPoint;
        insertPos = new REAL3D.Vector2(worldPosX, worldPosY);
        userPointLen = this.points.length;
        this.updateAssistId();
        assistFlag = [];
        for (pid = 0; pid < userPointLen; pid++) {
            assistFlag[pid] = 1;
            this.points[pid].updateNeighborOrder();
        }
        insertId = -1;
        for (pid = 0; pid < userPointLen; pid++) {
            if (insertId !== -1) {
                break;
            }
            curPoint = this.points[pid];
            neighbors = this.points[pid].neighbors;
            neigLen = neighbors.length;
            for (nid = 0; nid < neigLen; nid++) {
                if (assistFlag[neighbors[nid].assistId] === 1) {
                    neigPoint = neighbors[nid];
                    lineLen0 = REAL3D.Vector2.sub(curPoint.pos, neigPoint.pos).length();
                    lineLen1 = REAL3D.Vector2.sub(curPoint.pos, insertPos).length();
                    lineLen2 = REAL3D.Vector2.sub(neigPoint.pos, insertPos).length();
                    deltaLen = lineLen1 + lineLen2 - lineLen0;
                    if (deltaLen < REAL3D.CommonModel.INSERTRADIUS) {
                        //console.log("deltaLen: ", deltaLen);
                        this.disConnectPoints(curPoint, neigPoint);

                        newUserPoint = new REAL3D.CommonModel.UserPoint(worldPosX, worldPosY);
                        this.points.push(newUserPoint);

                        newUserPoint.neighbors.push(curPoint);
                        curPoint.neighbors.push(newUserPoint);
                        newUserPoint.neighbors.push(neigPoint);
                        neigPoint.neighbors.push(newUserPoint);
                        newUserPoint.updateNeighborOrder();
                        curPoint.updateNeighborOrder();
                        neigPoint.updateNeighborOrder();

                        insertId = this.points.length - 1;
                        break;
                    }
                }
            }
            assistFlag[pid] = -1;
        }
        return insertId;
    },

    setPosition : function (index, worldPosX, worldPosY) {
        "use strict";
        this.points[index].pos.set(worldPosX, worldPosY);
    },

    updateAssistId : function () {
        "use strict";
        var pid, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            this.points[pid].assistId = pid;
        }
    },

    copyTo : function () {
        "use strict";
        var tree, pointLen, pid, nid, neighbors, neiLen, assistFlag;
        tree = new REAL3D.CommonModel.UserPointTree();
        this.updateAssistId();
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            tree.addPoint(this.points[pid].pos.getX(), this.points[pid].pos.getY());
        }
        assistFlag = [];
        for (pid = 0; pid < pointLen; pid++) {
            assistFlag[pid] = 1;
        }
        for (pid = 0; pid < pointLen; pid++) {
            neighbors = this.points[pid].neighbors;
            neiLen = neighbors.length;
            for (nid = 0; nid < neiLen; nid++) {
                if (assistFlag[neighbors[nid].assistId] === 1) {
                    tree.connectPoints(pid, neighbors[nid].assistId);
                }
            }
            assistFlag[pid] = -1;
        }
        return tree;
    }
};
