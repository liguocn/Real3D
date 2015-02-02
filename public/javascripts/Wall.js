/*jslint plusplus: true */
/*global REAL3D, THREE */

REAL3D.Wall = {};

REAL3D.Wall.SELECTRADIUS = 200;

REAL3D.Wall.UserPoint = function(posX, posY) {
    "use strict";
    REAL3D.Publisher.call(this);
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
    this.assistId = null;
};

REAL3D.Wall.UserPoint.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.Wall.UserPointTree = function() {
    "use strict";
    this.points = [];
};

REAL3D.Wall.UserPointTree.prototype = {
    addPoint : function(worldPosX, worldPosY) {
        "use strict";
        var newUserPoint = new REAL3D.Wall.UserPoint(worldPosX, worldPosY);
        this.points.push(newUserPoint);
        return (this.points.length - 1);
    },

    deletePoint: function(index) {
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

    connectPoints : function(index1, index2) {
        "use strict";
        var point1, point2;
        point1 = this.points[index1];
        point2 = this.points[index2];
        point1.neighbors.push(point2);
        point2.neighbors.push(point1);
    },

    selectPoint : function(worldPosX, worldPosY) {
        "use strict";
        var pid, dist, curPoint, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint !== null) {
                dist = (worldPosX - curPoint.posX) * (worldPosX - curPoint.posX) + (worldPosY - curPoint.posY) * (worldPosY - curPoint.posY);
                if (dist < REAL3D.Wall.SELECTRADIUS) {
                    return pid;
                }
            }
        }
        return -1;
    },

    setPosition : function(index, worldPosX, worldPosY) {
        "use strict";
        this.points[index].posX = worldPosX;
        this.points[index].posY = worldPosY;
    },

    updateAssistId : function() {
        "use strict";
        var pid, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            this.points[pid].assistId = pid;
        }
    }
};

REAL3D.Wall.UserPointBall = function(point, parent) {
    "use strict";
    var geometry, material;
    this.point = point;
    this.point.subscribe("move", this, this.move);
    this.point.subscribe("remove", this, this.remove);
    geometry = new THREE.SphereGeometry(5, 32, 32);
    material = new THREE.MeshBasicMaterial({color: 0x0e0efe});
    this.ball = new THREE.Mesh(geometry, material);
    this.ball.position.set(point.posX, point.posY, 0);
    this.parent = parent;
    this.parent.add(this.ball);
};

REAL3D.Wall.UserPointBall.prototype.move = function() {
    "use strict";
    this.ball.position.set(this.point.posX, this.point.posY, 0);
};

REAL3D.Wall.UserPointBall.prototype.remove = function() {
    "use strict";
    this.parent.remove(this.ball);
    this.point.unsubscribe("move", this);
    this.point.unsubscribe("remove", this);
    this.parent = null;
};

REAL3D.Wall.UserPointLine = function(point1, point2, parent) {
    "use strict";
    var geometry, material;
    this.point1 = point1;
    this.point1.subscribe("move", this, this.move);
    this.point1.subscribe("remove", this, this.remove);
    this.point2 = point2;
    this.point2.subscribe("move", this, this.move);
    this.point2.subscribe("remove", this, this.remove);
    material = new THREE.LineBasicMaterial({color: 0xae0e1e});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(this.point1.posX, this.point1.posY, 0),
                           new THREE.Vector3(this.point2.posX, this.point2.posY, 0));
    this.line = new THREE.Line(geometry, material);
    this.parent = parent;
    this.parent.add(this.line);
};

REAL3D.Wall.UserPointLine.prototype.move = function() {
    "use strict";
    var geometry, material;
    this.parent.remove(this.line);
    material = new THREE.LineBasicMaterial({color: 0xae0e1e});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(this.point1.posX, this.point1.posY, 0),
                           new THREE.Vector3(this.point2.posX, this.point2.posY, 0));
    this.line = new THREE.Line(geometry, material);
    this.parent.add(this.line);
};

REAL3D.Wall.UserPointLine.prototype.remove = function() {
    "use strict";
    this.parent.remove(this.line);
    this.point1.unsubscribe("remove", this);
    this.point2.unsubscribe("remove", this);
    this.parent = null;
};

REAL3D.Wall.WallPoint2D = function(posX, posY) {
    "use strict";
    this.posX = posX;
    this.posY = posY;
};

REAL3D.Wall.Wall2D = function() {
    "use strict";
    this.wallPoint2D = [];
};

REAL3D.Wall.WallSet2D = function() {
    "use strict";
    this.wall2D = [];
};

REAL3D.Wall.WallSet2D.prototype.generate = function(usertree) {
    "use strict";
};

REAL3D.Wall.Wall3D = function(wall2d, height) {
    "use strict";
    this.wall2D = wall2d;
    this.height = height;
};

REAL3D.Wall.WallSet3D = function() {
    "use strict";
};

REAL3D.Wall.WallSet3D.prototype.generate = function(walltree2d) {
    "use strict";
};
