/*jslint plusplus: true */
/*global REAL3D */

REAL3D.Wall = {};

REAL3D.Wall.SELECTRADIUS = 200;

REAL3D.Wall.UserPoint = function(posX, posY) {
    "use strict";
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
};

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
    }
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
