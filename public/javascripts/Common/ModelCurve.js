/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.CurveModel = {
};

REAL3D.CurveModel.CurveVertex = function (userPoint, curveTree, drawParent) {
    "use strict";
    this.userPoint = userPoint;
    this.curveTree = curveTree;
    this.drawParent = drawParent;
    this.edges = [];
    this.drawObject = null;
    this.userPoint.subscribe("updateDraw", this, this.updateDraw);
    this.userPoint.subscribe("remove", this, this.remove);
    this.curveTree.subscribe("updateDraw", this, this.updateDraw);
    this.curveTree.subscribe("remove", this, this.remove);
    this.curveTree.subscribe("hideDraw", this, this.hideDraw);
    this.updateDraw();
};

REAL3D.CurveModel.CurveVertex.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.userPoint.unsubscribe("updateDraw", this);
    this.userPoint.unsubscribe("remove", this);
    this.curveTree.unsubscribe("updateDraw", this);
    this.curveTree.unsubscribe("remove", this);
    this.curveTree.unsubscribe("hideDraw", this);
    this.userPoint = null;
    this.curveTree = null;
    this.drawParent = null;
    this.drawObject = null;
    this.edges = null;
};

REAL3D.CurveModel.CurveVertex.prototype.updateDraw = function () {
    "use strict";
    if (this.drawParent !== null) {
        var geometry, material;
        if (this.drawObject !== null) {
            this.drawParent.remove(this.drawObject);
        }
        geometry = new THREE.SphereGeometry(3, 4, 4);
        material = new THREE.MeshBasicMaterial({color: 0x7b9b7b});
        this.drawObject = new THREE.Mesh(geometry, material);
        this.drawObject.position.set(this.userPoint.pos.getX(), this.userPoint.pos.getY(), 0);
        this.drawParent.add(this.drawObject);
    }
};

REAL3D.CurveModel.CurveVertex.prototype.hideDraw = function () {
    "use strict";
    if (this.drawParent !== null && this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.CurveModel.CurveVertex.prototype.addEdge = function (edge) {
    "use strict";
    var edgeCount, found, eid;
    found = false;
    edgeCount = this.edges.length;
    for (eid = 0; eid < edgeCount; eid++) {
        if (this.edges[eid] === edge) {
            found = true;
            break;
        }
    }
    if (!found) {
        this.edges.push(edge);
    }
};

REAL3D.CurveModel.CurveEdge = function (curveVert0, curveVert1, curveTree, drawParent) {
    "use strict";
    this.vertices = [curveVert0, curveVert1];
    this.curveTree = curveTree;
    this.drawParent = drawParent;
    this.drawObject = null;
    curveVert0.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveVert0.userPoint.subscribe("remove", this, this.remove);
    curveVert1.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveVert1.userPoint.subscribe("remove", this, this.remove);
    this.curveTree.subscribe("hideDraw", this, this.hideDraw);
    this.curveTree.subscribe("updateDraw", this, this.updateDraw);
    this.curveTree.subscribe("remove", this, this.remove);
    this.updateDraw();
};

REAL3D.CurveModel.CurveEdge.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.vertices[0].userPoint.unsubscribe("updateDraw", this);
    this.vertices[0].userPoint.unsubscribe("remove", this);
    this.vertices[1].userPoint.unsubscribe("updateDraw", this);
    this.vertices[1].userPoint.unsubscribe("remove", this);
    this.curveTree.unsubscribe("hideDraw", this);
    this.curveTree.unsubscribe("updateDraw", this);
    this.curveTree.unsubscribe("remove", this);
};

REAL3D.CurveModel.CurveEdge.prototype.updateDraw = function () {
    "use strict";
    if (this.drawParent !== null) {
        var geometry, material;
        if (this.drawObject !== null) {
            this.drawParent.remove(this.drawObject);
        }
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(this.vertices[0].userPoint.pos.getX(), this.vertices[0].userPoint.pos.getY(), 1),
            new THREE.Vector3(this.vertices[1].userPoint.pos.getX(), this.vertices[1].userPoint.pos.getY(), 1));
        material = new THREE.LineBasicMaterial({color: 0x7b9b7b, linewidth: 2});
        this.drawObject = new THREE.Line(geometry, material);
        this.drawParent.add(this.drawObject);
    }
};

REAL3D.CurveModel.CurveEdge.prototype.hideDraw = function () {
    "use strict";
    if (this.drawParent !== null && this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.CurveModel.CurveTree = function () {
    "use strict";
    REAL3D.Publisher.call(this);
    this.vertices = [];
    this.smoothValues = [];
    this.edges = [];
};

REAL3D.CurveModel.CurveTree.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.CurveModel.CurveTree.prototype.addVertex = function (userPoint, smoothValue, drawParent) {
    "use strict";
    var vertex = new REAL3D.CurveModel.CurveVertex(userPoint, this, drawParent);
    this.vertices.push(vertex);
    this.smoothValues.push(smoothValue);
};

REAL3D.CurveModel.CurveTree.prototype.addEdge = function (index1, index2, drawParent) {
    "use strict";
    var edge = new REAL3D.CurveModel.CurveEdge(this.vertices[index1], this.vertices[index2], this, drawParent);
    this.edges.push(edge);
};

//Curve Tools
REAL3D.CurveModel.constructCurveTree = function (userPointTree, smoothValues, vertDrawParent, edgeDrawParent) {
    "use strict";
    var userPoints, userPointLen, pid, curveTree, assistFlag, neighbors, neiLen, nid;
    curveTree = new REAL3D.CurveModel.CurveTree();
    userPoints = userPointTree.points;
    userPointLen = userPoints.length;
    if (edgeDrawParent !== null || vertDrawParent !== null) {
        for (pid = 0; pid < userPointLen; pid++) {
            curveTree.addVertex(userPoints[pid], smoothValues[pid], vertDrawParent);
        }
    }
    if (edgeDrawParent !== null) {
        userPointTree.updateAssistId();
        assistFlag = [];
        for (pid = 0; pid < userPointLen; pid++) {
            assistFlag[pid] = 1;
        }
        for (pid = 0; pid < userPointLen; pid++) {
            neighbors = userPoints[pid].neighbors;
            neiLen = neighbors.length;
            for (nid = 0; nid < neiLen; nid++) {
                if (assistFlag[neighbors[nid].assistId] === 1) {
                    curveTree.addEdge(pid, neighbors[nid].assistId, edgeDrawParent);
                }
            }
            assistFlag[pid] = -1;
        }
    }
    return curveTree;
};

REAL3D.CurveModel.subdivideCurveTree = function (curveTree, subdTime, vertDrawParent, edgeDrawParent) {
    "use strict";
};
