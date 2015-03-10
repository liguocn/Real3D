/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.ViewPath = {
};

REAL3D.ViewPath.PathPoint = function (userPoint, pathTree, drawParent) {
    "use strict";
    this.userPoint = userPoint;
    this.edges = [];
    this.pathTree = pathTree;
    this.drawParent = drawParent;
    this.drawObject = null;
    this.userPoint.subscribe("updateDraw", this, this.updateDraw);
    this.userPoint.subscribe("remove", this, this.remove);
    this.pathTree.subscribe("updateDraw", this, this.updateDraw);
    this.pathTree.subscribe("remove", this, this.remove);
    this.updateDraw();
};

REAL3D.ViewPath.PathPoint.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.userPoint.unsubscribe("updateDraw", this);
    this.userPoint.unsubscribe("remove", this);
    this.pathTree.unsubscribe("update", this);
    this.pathTree.unsubscribe("remove", this);
    this.pathTree.removePathPoint(this);
    this.userPoint = null;
    this.edges = null;
    this.pathTree = null;
    this.drawParent = null;
    this.drawObject = null;
};

REAL3D.ViewPath.PathPoint.prototype.updateDraw = function () {
    "use strict";
    if (this.drawParent !== null) {
        var geometry, material;
        if (this.drawObject !== null) {
            this.drawParent.remove(this.drawObject);
        }
        geometry = new THREE.SphereGeometry(5, 5, 5);
        material = new THREE.MeshBasicMaterial({color: 0x6b6b6b});
        this.drawObject = new THREE.Mesh(geometry, material);
        this.drawObject.position.set(this.userPoint.pos.getX(), this.userPoint.pos.getY(), 0);
        this.drawParent.add(this.drawObject);
    }
};

REAL3D.ViewPath.PathPoint.prototype.addPathEdge = function (pathEdge) {
    "use strict";
    var edgeCount, found, eid;
    found = false;
    edgeCount = this.edges.length;
    for (eid = 0; eid < edgeCount; eid++) {
        if (this.edges[eid] === pathEdge) {
            found = true;
            break;
        }
    }
    if (!found) {
        this.edges.push(pathEdge);
    }
};

REAL3D.ViewPath.PathEdge = function (pathPoint0, pathPoint1, pathTree, drawParent) {
    "use strict";
    this.pathPoints = [pathPoint0, pathPoint1];
    this.edgeLength = REAL3D.Vector2.sub(pathPoint0.userPoint.pos, pathPoint1.userPoint.pos).length();
    this.pathTree = pathTree;
    this.drawParent = drawParent;
    this.drawObject = null;
    pathPoint0.userPoint.subscribe("updateDraw", this, this.updateDraw);
    pathPoint0.userPoint.subscribe("remove", this, this.remove);
    pathPoint1.userPoint.subscribe("updateDraw", this, this.updateDraw);
    pathPoint1.userPoint.subscribe("remove", this, this.remove);
    this.pathTree.subscribe("updateDraw", this, this.updateDraw);
    this.pathTree.subscribe("remove", this, this.remove);
    this.updateDraw();
};

REAL3D.ViewPath.PathEdge.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.pathPoints[0].userPoint.unsubscribe("updateDraw", this);
    this.pathPoints[0].userPoint.unsubscribe("remove", this);
    this.pathPoints[1].userPoint.unsubscribe("updateDraw", this);
    this.pathPoints[1].userPoint.unsubscribe("remove", this);
    this.pathTree.unsubscribe("update", this);
    this.pathTree.unsubscribe("remove", this);
    this.pathTree.removePathEdge(this);
    //remove pathEdge from its pathPoints
    //not done
    //
    this.pathPoints = null;
    this.edgeLength = null;
    this.pathTree = null;
    this.drawParent = null;
    this.drawObject = null;
};

REAL3D.ViewPath.PathEdge.prototype.updateDraw = function () {
    "use strict";
    this.edgeLength = REAL3D.Vector2.sub(this.pathPoints[0].userPoint.pos, this.pathPoints[1].userPoint.pos).length();
    if (this.drawParent !== null) {
        var geometry, material;
        if (this.drawObject !== null) {
            this.drawParent.remove(this.drawObject);
        }
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(this.pathPoints[0].userPoint.pos.getX(), this.pathPoints[0].userPoint.pos.getY(), 1),
            new THREE.Vector3(this.pathPoints[1].userPoint.pos.getX(), this.pathPoints[1].userPoint.pos.getY(), 1));
        material = new THREE.LineBasicMaterial({color: 0x000000});
        this.drawObject = new THREE.Line(geometry, material);
        this.drawParent.add(this.drawObject);
    }
};

REAL3D.ViewPath.PathTree = function () {
    "use strict";
    REAL3D.Publisher.call(this);
    this.pathPoints = [];
    this.pathEdges = [];
};

REAL3D.ViewPath.PathTree.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.ViewPath.PathTree.prototype.addPathPoint = function (userPoint, drawParent) {
    "use strict";
    var pathPoint = new REAL3D.ViewPath.PathPoint(userPoint, this, drawParent);
    this.pathPoints.push(pathPoint);
    //console.log("addPathPoint: pathPoints length: ", this.pathPoints.length);
};

REAL3D.ViewPath.PathTree.prototype.addPathEdge = function (index1, index2, drawParent) {
    "use strict";
    var pathEdge = new REAL3D.ViewPath.PathEdge(this.pathPoints[index1], this.pathPoints[index2], this, drawParent);
    this.pathEdges.push(pathEdge);
    this.pathPoints[index1].addPathEdge(pathEdge);
    this.pathPoints[index2].addPathEdge(pathEdge);
    //console.log("addPathEdge: pathEdges length: ", this.pathEdges.length);
};

REAL3D.ViewPath.PathTree.prototype.removePathPoint = function (pathPoint) {
    "use strict";
    var pid;
    for (pid = 0; pid < this.pathPoints.length; pid++) {
        if (this.pathPoints[pid] === pathPoint) {
            this.pathPoints.splice(pid, 1);
            break;
        }
    }
    //console.log("removePathPoint: pathPoints length: ", this.pathPoints.length);
};

REAL3D.ViewPath.PathTree.prototype.removePathEdge = function (pathEdge) {
    "use strict";
    var eid;
    for (eid = 0; eid < this.pathEdges.length; eid++) {
        if (this.pathEdges[eid] === pathEdge) {
            this.pathEdges.splice(eid, 1);
        }
    }
    //console.log("removePathEdge: pathEdges length: ", this.pathEdges.length);
};
