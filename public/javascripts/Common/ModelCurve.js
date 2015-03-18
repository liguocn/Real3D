/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.CurveModel = {
};

REAL3D.CurveModel.CurveVertex = function (userPoint, curveTree, drawParent) {
    "use strict";
    this.userPoint = userPoint;
    this.curveTree = curveTree;
    this.drawParent = drawParent;
    this.edges = [];
    this.assistId = null;
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
        geometry = new THREE.SphereGeometry(4, 4, 4);
        material = new THREE.MeshBasicMaterial({color: 0xbbbbbb});
        this.drawObject = new THREE.Mesh(geometry, material);
        this.drawObject.position.set(this.userPoint.pos.getX(), this.userPoint.pos.getY(), -1);
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
        geometry.vertices.push(new THREE.Vector3(this.vertices[0].userPoint.pos.getX(), this.vertices[0].userPoint.pos.getY(), -1),
            new THREE.Vector3(this.vertices[1].userPoint.pos.getX(), this.vertices[1].userPoint.pos.getY(), -1));
        material = new THREE.LineDashedMaterial({color: 0xbbbbbb});
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
    this.vertices[index1].addEdge(edge);
    this.vertices[index2].addEdge(edge);
};

REAL3D.CurveModel.CurveTree.prototype.updateAssistId = function () {
    "use strict";
    var vid;
    for (vid = 0; vid < this.vertices.length; vid++) {
        this.vertices[vid].assistId = vid;
    }
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

//Curve Geomerty
REAL3D.CurveGeometry = {
};

REAL3D.CurveGeometry.Curve = function () {
    "use strict";
    this.position = [];
    this.isClose = false;
    this.drawParent = null;
    this.drawObject = null;
};

REAL3D.CurveGeometry.Curve.prototype.updateDraw = function () {
    "use strict";
    if (this.drawParent !== null) {
        if (this.drawObject !== null) {
            this.drawParent.remove(this.drawObject);
        }
        this.drawObject = new THREE.Object3D();
        this.drawParent.add(this.drawObject);
        var vertexCount, geometry, material, vid;
        material = new THREE.LineBasicMaterial({color: 0x7b9b9b, linewidth: 2});
        vertexCount = this.position.length;
        for (vid = 1; vid < vertexCount; vid++) {
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(this.position[vid].getX(), this.position[vid].getY(), this.position[vid].getZ()),
                new THREE.Vector3(this.position[vid - 1].getX(), this.position[vid - 1].getY(), this.position[vid - 1].getZ()));
            this.drawObject.add(new THREE.Line(geometry, material));
        }
        if (vertexCount > 2 && this.isClose) {
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(this.position[0].getX(), this.position[0].getY(), this.position[0].getZ()),
                new THREE.Vector3(this.position[vertexCount - 1].getX(), this.position[vertexCount - 1].getY(), this.position[vertexCount - 1].getZ()));
            this.drawObject.add(new THREE.Line(geometry, material));
        }
    }
};

REAL3D.CurveGeometry.Curve.prototype.hideDraw = function () {
    "use strict";
    if (this.drawParent !== null && this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.CurveGeometry.Curve.prototype.remove = function () {
    "use strict";
    if (this.drawParent !== null && this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.position = null;
    this.drawParent = null;
    this.drawObject = null;
};

REAL3D.CurveGeometry.constructCurveFromCurveTree = function (curveTree, subdTime, drawParent) {
    "use strict";
    var curves, vertices, vertCount, vid, assistFlag, subdCurve, subdContinue;
    curves = [];
    curveTree.updateAssistId();
    vertices = curveTree.vertices;
    vertCount = vertices.length;
    assistFlag = []; //1: unvisit, -1: invalid, 0: visited
    for (vid = 0; vid < vertCount; vid++) {
        assistFlag[vid] = 1;
    }
    subdContinue = true;
    while (subdContinue) {
        subdContinue = false;
        for (vid = 0; vid < vertCount; vid++) {
            if (assistFlag[vid] === 1) {
                subdContinue = true;
                subdCurve = REAL3D.CurveGeometry.extractSubdCurve(vertices, curveTree.smoothValues, assistFlag, vid, subdTime);
                subdCurve.drawParent = drawParent;
                curves.push(subdCurve);
                break;
            }
        }
    }
    return curves;
};

REAL3D.CurveGeometry.subdFactors = [0.25989, 0.252425, 0.250603, 0.25015065871, 0.25];

REAL3D.CurveGeometry.extractSubdCurve = function (curveVertives, smoothValues, assistFlag, vertId, subdTime) {
    "use strict";
    var curve, startId, curId, curEdges, isClose, stop, subdVertPos, subdSmoothValues, eid, sid, nextSubdVertPos, nextSubdSmoothValues, vid, cuttingPos, preId, nextId;
    startId = -1;
    curId = vertId;
    isClose = false;
    //find out startId
    while (startId === -1) {
        assistFlag[curId] = 0;
        curEdges = curveVertives[curId].edges;
        if (curEdges.length === 1) {
            startId = curId;
            isClose = false;
            break;
        } else if (curEdges.length === 2) {
            if (assistFlag[curEdges[0].vertices[0].assistId] === 1) {
                curId = curEdges[0].vertices[0].assistId;
            } else if (assistFlag[curEdges[0].vertices[1].assistId] === 1) {
                curId = curEdges[0].vertices[1].assistId;
            } else if (assistFlag[curEdges[1].vertices[0].assistId] === 1) {
                curId = curEdges[1].vertices[0].assistId;
            } else if (assistFlag[curEdges[1].vertices[1].assistId] === 1) {
                curId = curEdges[1].vertices[1].assistId;
            } else {
                startId = curId;
                isClose = true;
            }
            continue;
        } else {
            console.log("error: curEdges.length = ", curEdges.length);
        }
    }

    //tranverse
    curId = startId;
    subdVertPos = [];
    subdSmoothValues = [];
    do {
        subdVertPos.push(curveVertives[curId].userPoint.pos);
        subdSmoothValues.push(smoothValues[curId]);
        assistFlag[curId] = -1;
        curEdges = curveVertives[curId].edges;
        stop = true;
        for (eid = 0; eid < curEdges.length; eid++) {
            if (assistFlag[curEdges[eid].vertices[0].assistId] !== -1) {
                curId = curEdges[eid].vertices[0].assistId;
                stop = false;
                break;
            } else if (assistFlag[curEdges[eid].vertices[1].assistId] !== -1) {
                curId = curEdges[eid].vertices[1].assistId;
                stop = false;
                break;
            }
        }
    } while (stop === false);

    //subdivide curve
    nextSubdVertPos = [];
    nextSubdSmoothValues = [];
    for (sid = 0; sid < subdTime; sid++) {
        for (vid = 0; vid < subdVertPos.length; vid++) {
            if (isClose === false && (vid === 0 || vid === subdVertPos.length - 1)) {
                nextSubdVertPos.push(subdVertPos[vid]);
                nextSubdSmoothValues.push(0);
            } else {
                if (subdSmoothValues[vid] > 0) {
                    preId = vid - 1;
                    nextId = vid + 1;
                    if (vid === 0) {
                        preId = subdVertPos.length - 1;
                    } else if (vid === subdVertPos.length - 1) {
                        nextId = 0;
                    }
                    cuttingPos = REAL3D.Vector2.add(REAL3D.Vector2.scale(subdVertPos[preId], subdSmoothValues[vid]),
                        REAL3D.Vector2.scale(subdVertPos[vid], 1 - subdSmoothValues[vid]));
                    nextSubdVertPos.push(cuttingPos);
                    nextSubdSmoothValues.push(REAL3D.CurveGeometry.subdFactors[sid]);
                    cuttingPos = REAL3D.Vector2.add(REAL3D.Vector2.scale(subdVertPos[nextId], subdSmoothValues[vid]),
                        REAL3D.Vector2.scale(subdVertPos[vid], 1 - subdSmoothValues[vid]));
                    nextSubdVertPos.push(cuttingPos);
                    nextSubdSmoothValues.push(REAL3D.CurveGeometry.subdFactors[sid]);
                } else {
                    nextSubdVertPos.push(subdVertPos[vid]);
                    nextSubdSmoothValues.push(0);
                }
            }
        }
        subdVertPos = nextSubdVertPos;
        subdSmoothValues = nextSubdSmoothValues;
        nextSubdVertPos = [];
        nextSubdSmoothValues = [];
    }

    curve = new REAL3D.CurveGeometry.Curve();
    curve.isClose = isClose;
    for (vid = 0; vid < subdVertPos.length; vid++) {
        curve.position.push(new REAL3D.Vector3(subdVertPos[vid].getX(), subdVertPos[vid].getY(), 0));
    }

    return curve;
};

