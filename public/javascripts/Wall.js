/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.Wall = {};

REAL3D.Wall.SELECTRADIUS = 200;

REAL3D.Wall.UserPoint = function (posX, posY) {
    "use strict";
    REAL3D.Publisher.call(this);
    this.pos = new REAL3D.Vector2(posX, posY);
    this.neighbors = [];
    this.assistId = null;
};

REAL3D.Wall.UserPoint.prototype = Object.create(REAL3D.Publisher.prototype);

//update the order of neighbors into anticlockwise
REAL3D.Wall.UserPoint.prototype.updateNeighborOrder = function () {
    "use strict";
    var neigLen, neighbors, neigVectors, curVector, nid, sortVectors;
    neigLen = this.neighbors.length;
    if (neigLen > 2) {
        console.log("updateNeighborOrder: ", neigLen);
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

REAL3D.Wall.UserPointTree = function () {
    "use strict";
    this.points = [];
};

REAL3D.Wall.UserPointTree.prototype = {
    addPoint : function (worldPosX, worldPosY) {
        "use strict";
        var newUserPoint = new REAL3D.Wall.UserPoint(worldPosX, worldPosY);
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

    selectPoint : function (worldPosX, worldPosY) {
        "use strict";
        var pid, dist, curPoint, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint !== null) {
                dist = (worldPosX - curPoint.pos.getX()) * (worldPosX - curPoint.pos.getX()) + (worldPosY - curPoint.pos.getY()) * (worldPosY - curPoint.pos.getY());
                if (dist < REAL3D.Wall.SELECTRADIUS) {
                    return pid;
                }
            }
        }
        return -1;
    },

    setPosition : function (index, worldPosX, worldPosY) {
        "use strict";
        this.points[index].pos.set(worldPosX, worldPosY);
        //this.points[index].posX = worldPosX;
        //this.points[index].posY = worldPosY;
    },

    updateAssistId : function () {
        "use strict";
        var pid, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            this.points[pid].assistId = pid;
        }
    }
};

REAL3D.Wall.UserPointBox = function (point, boxLength, parent) {
    "use strict";
    var geometry, material;
    this.point = point;
    this.point.subscribe("updateMesh", this, this.updateMesh);
    this.point.subscribe("remove", this, this.remove);
    geometry = new THREE.BoxGeometry(boxLength, boxLength, boxLength);
    material = new THREE.MeshBasicMaterial({color: 0x7d9767});
    this.box = new THREE.Mesh(geometry, material);
    this.box.position.set(point.pos.getX(), point.pos.getY(), 900);
    this.parent = parent;
    this.parent.add(this.box);
};

REAL3D.Wall.UserPointBox.prototype.updateMesh = function () {
    "use strict";
    this.box.position.set(this.point.pos.getX(), this.point.pos.getY(), 900);
};

REAL3D.Wall.UserPointBox.prototype.updateBoxLength = function (boxLength) {
    "use strict";
    this.parent.remove(this.box);
    var geometry, material;
    geometry = new THREE.BoxGeometry(boxLength, boxLength, boxLength);
    material = new THREE.MeshBasicMaterial({color: 0x7d9767});
    this.box = new THREE.Mesh(geometry, material);
    this.box.position.set(this.point.pos.getX(), this.point.pos.getY(), 900);
    this.parent.add(this.box);
};

REAL3D.Wall.UserPointBox.prototype.remove = function () {
    "use strict";
    this.parent.remove(this.box);
    this.point.unsubscribe("updateMesh", this);
    //this.point.unsubscribe("remove", this);
    this.parent = null;
    this.point = null;
    this.box = null;
};

REAL3D.Wall.Wall2D = function (point1, point2, thick) {
    "use strict";
    REAL3D.Publisher.call(this);
    this.point1 = point1;
    this.point2 = point2;
    this.thick = thick;
    this.wall2dPoints = [];
    //generate geometry
    this.generateMesh();
    //register callback functions
    this.point1.subscribe("updateSubscriber", this, this.updateSubscriber);
    this.point2.subscribe("updateSubscriber", this, this.updateSubscriber);
};

REAL3D.Wall.Wall2D.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.Wall.Wall2D.prototype.generateWallVector = function (pos1, pos2, assistPos) {
    "use strict";
    var mainVec, assistVec, wallVec, wallVecLen, dirFlag;
    mainVec = REAL3D.Vector2.sub(pos2, pos1);
    mainVec.unify();
    assistVec = REAL3D.Vector2.sub(assistPos, pos1);
    assistVec.unify();
    wallVec = REAL3D.Vector2.add(mainVec, assistVec);
    wallVecLen = wallVec.unify();
    if (REAL3D.isZero(wallVecLen)) {
        wallVec = new REAL3D.Vector2(mainVec.getY() * (-1), mainVec.getX());
    }
    dirFlag = mainVec.x * wallVec.y - mainVec.y * wallVec.x;
    if (dirFlag < 0) {
        wallVec.multiply(-1);
    }
    return wallVec;
};

REAL3D.Wall.Wall2D.prototype.generateWallPoint = function (point1, point2) {
    "use strict";
    var wallPoints, neighbors1, neigLen1, mainVec, wallVec, assistPos, wallPos1, wallPos2, nid, cosTheta, extrudLen;
    neighbors1 = point1.neighbors;
    neigLen1 = neighbors1.length;
    if (neigLen1 === 1) {
        mainVec = REAL3D.Vector2.sub(point2.pos, point1.pos);
        mainVec.unify();
        wallVec = new REAL3D.Vector2(mainVec.getY() * (-1), mainVec.getX());
        wallPos2 = point1.pos.copyTo();
        wallPos2.addVector(REAL3D.Vector2.scale(wallVec, this.thick));
        wallPos1 = point1.pos.copyTo();
        wallPos1.subVector(REAL3D.Vector2.scale(wallVec, this.thick));
    } else if (neigLen1 === 2) {
        if (neighbors1[0] === point2) {
            assistPos = neighbors1[1].pos;
        } else {
            assistPos = neighbors1[0].pos;
        }
        wallVec = this.generateWallVector(point1.pos, point2.pos, assistPos);
        mainVec = REAL3D.Vector2.sub(point2.pos, point1.pos);
        mainVec.unify();
        cosTheta = Math.abs(wallVec.getY() * mainVec.getX() - wallVec.getX() * mainVec.getY());
        if (REAL3D.isZero(cosTheta)) {
            console.log("error: cosTheta is zero");
        } else {
            extrudLen = this.thick / cosTheta;
        }
        wallPos2 = point1.pos.copyTo();
        wallPos2.addVector(REAL3D.Vector2.scale(wallVec, extrudLen));
        wallPos1 = point1.pos.copyTo();
        wallPos1.subVector(REAL3D.Vector2.scale(wallVec, extrudLen));
    } else {
        for (nid = 0; nid < neigLen1; nid++) {
            if (neighbors1[nid] === point2) {
                mainVec = REAL3D.Vector2.sub(point2.pos, point1.pos);
                mainVec.unify();

                assistPos = neighbors1[(nid - 1 + neigLen1) % neigLen1].pos;
                wallVec = this.generateWallVector(point1.pos, assistPos, point2.pos);
                cosTheta = Math.abs(wallVec.getY() * mainVec.getX() - wallVec.getX() * mainVec.getY());
                if (REAL3D.isZero(cosTheta)) {
                    console.log("error: cosTheta is zero");
                } else {
                    extrudLen = this.thick / cosTheta;
                }
                wallPos1 = point1.pos.copyTo();
                wallPos1.addVector(REAL3D.Vector2.scale(wallVec, extrudLen));

                assistPos = neighbors1[(nid + 1) % neigLen1].pos;
                wallVec = this.generateWallVector(point1.pos, point2.pos, assistPos);
                cosTheta = Math.abs(wallVec.getY() * mainVec.getX() - wallVec.getX() * mainVec.getY());
                if (REAL3D.isZero(cosTheta)) {
                    console.log("error: cosTheta is zero");
                } else {
                    extrudLen = this.thick / cosTheta;
                }
                wallPos2 = point1.pos.copyTo();
                wallPos2.addVector(REAL3D.Vector2.scale(wallVec, extrudLen));

                break;
            }
        }
    }
    wallPoints = [wallPos1, wallPos2];
    return wallPoints;
};

REAL3D.Wall.Wall2D.prototype.generateMesh = function () {
    "use strict";
    var wallPoints, wallPos1, wallPos2, wallPos3, wallPos4;
    wallPoints = this.generateWallPoint(this.point1, this.point2);
    wallPos1 = wallPoints[0];
    wallPos2 = wallPoints[1];

    wallPoints = this.generateWallPoint(this.point2, this.point1);
    wallPos3 = wallPoints[0];
    wallPos4 = wallPoints[1];

    this.wall2dPoints = [wallPos1, wallPos2, wallPos3, wallPos4];
};

REAL3D.Wall.Wall2D.prototype.updateMesh = function () {
    "use strict";
    this.generateMesh();
    this.publish("updateMesh");
};

REAL3D.Wall.Wall2D.prototype.remove = function () {
    "use strict";
    this.publish("remove");

    var neighbors1, neigLen1, nid, neighbors2, neigLen2;
    this.point1.unsubscribe("updateMesh", this, this.updateMesh);
    //this.point1.unsubscribe("remove", this, this.remove);
    neighbors1 = this.point1.neighbors;
    neigLen1 = neighbors1.length;
    for (nid = 0; nid < neigLen1; nid++) {
        neighbors1[nid].unsubscribe("updateMesh", this, this.updateMesh);
    }
    this.point2.unsubscribe("updateMesh", this, this.updateMesh);
    //this.point2.unsubscribe("remove", this, this.remove);
    neighbors2 = this.point2.neighbors;
    neigLen2 = neighbors2.length;
    for (nid = 0; nid < neigLen2; nid++) {
        neighbors2[nid].unsubscribe("updateMesh", this, this.updateMesh);
    }

    this.point1 = null;
    this.point2 = null;
    this.wall2dPoints = null;
};

REAL3D.Wall.Wall2D.prototype.updateSubscriber = function () {
    "use strict";
    var neighbors1, neigLen1, nid, neighbors2, neigLen2;
    this.point1.subscribe("updateMesh", this, this.updateMesh);
    this.point1.subscribe("remove", this, this.remove);
    neighbors1 = this.point1.neighbors;
    neigLen1 = neighbors1.length;
    for (nid = 0; nid < neigLen1; nid++) {
        neighbors1[nid].subscribe("updateMesh", this, this.updateMesh);
    }
    this.point2.subscribe("updateMesh", this, this.updateMesh);
    this.point2.subscribe("remove", this, this.remove);
    neighbors2 = this.point2.neighbors;
    neigLen2 = neighbors2.length;
    for (nid = 0; nid < neigLen2; nid++) {
        neighbors2[nid].subscribe("updateMesh", this, this.updateMesh);
    }
};

REAL3D.Wall.Wall3D = function (wall2d, height, parent) {
    "use strict";
    this.wall2d = wall2d;
    this.height = height;
    this.parent = parent;
    this.mesh = null;
    this.generateMesh();
    //registrate update callback
    this.wall2d.subscribe("updateMesh", this, this.updateMesh);
    this.wall2d.subscribe("remove", this, this.remove);
};

REAL3D.Wall.Wall3D.prototype.generateMesh = function () {
    "use strict";
    //console.log("generate 3d mesh");
    var wall2dPoints, wall2dLen, geometry, material, pid, fid;
    wall2dPoints = this.wall2d.wall2dPoints;
    wall2dLen = wall2dPoints.length;

    this.parent.remove(this.mesh);
    geometry = new THREE.Geometry();
    for (pid = 0; pid < wall2dLen; pid++) {
        geometry.vertices.push(new THREE.Vector3(wall2dPoints[pid].getX(), wall2dPoints[pid].getY(), 0));
    }
    for (pid = 0; pid < wall2dLen; pid++) {
        geometry.vertices.push(new THREE.Vector3(wall2dPoints[pid].getX(), wall2dPoints[pid].getY(), this.height));
    }
    for (fid = 1; fid < wall2dLen - 1; fid++) {
        geometry.faces.push(new THREE.Face3(0, fid, fid + 1));
    }
    for (fid = 1; fid < wall2dLen - 1; fid++) {
        geometry.faces.push(new THREE.Face3(wall2dLen, fid + wall2dLen + 1, fid + wall2dLen));
    }
    for (pid = 0; pid < wall2dLen; pid++) {
        geometry.faces.push(new THREE.Face3(pid, pid + wall2dLen, (pid + 1) % wall2dLen));
        geometry.faces.push(new THREE.Face3((pid + 1) % wall2dLen, pid + wall2dLen, (pid + 1) % wall2dLen + wall2dLen));
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    material = new THREE.MeshPhongMaterial({color: 0xfefefe, specular: 0x101010, shininess: 10, wireframe: false, shading: THREE.FlatShading});
    this.mesh = new THREE.Mesh(geometry, material);
    this.parent.add(this.mesh);
};

REAL3D.Wall.Wall3D.prototype.updateMesh = function () {
    "use strict";
    this.generateMesh();
};

REAL3D.Wall.Wall3D.prototype.remove = function() {
    "use strict";
    this.wall2d.unsubscribe("updateMesh", this, this.updateMesh);
    this.wall2d.unsubscribe("remove", this, this.remove);
    this.parent.remove(this.mesh);
    this.parent = null;
    this.mesh = null;
    this.wall2d = null;
};
