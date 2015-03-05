/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.Wall = {
};

REAL3D.Wall.Stump = function (userPoint, stumpSize, parent, globalPublisher) {
    "use strict";
    this.point = userPoint;
    this.point.subscribe("updateDraw", this, this.updateDraw);
    this.point.subscribe("remove", this, this.remove);
    this.globalPublisher = globalPublisher;
    globalPublisher.subscribe("updateDraw", this, this.updateDraw);
    globalPublisher.subscribe("remove", this, this.remove);
    this.stumpSize = stumpSize;
    this.parent = parent;
    this.mesh = null;
    this.updateDraw();
};

REAL3D.Wall.Stump.prototype.remove = function () {
    "use strict";
    if (this.mesh !== null) {
        this.parent.remove(this.mesh);
    }
    this.point.unsubscribe("updateDraw", this);
    this.point.unsubscribe("remove", this);
    this.globalPublisher.unsubscribe("updateDraw", this);
    this.globalPublisher.unsubscribe("remove", this);
    this.parent = null;
    this.globalPublisher = null;
    this.point = null;
    this.mesh = null;
};

REAL3D.Wall.Stump.prototype.updateDraw = function () {
    "use strict";
    var geometry, material;
    if (this.mesh !== null) {
        this.parent.remove(this.mesh);
    }
    geometry = new THREE.BoxGeometry(this.stumpSize, this.stumpSize, this.stumpSize);
    material = new THREE.MeshBasicMaterial({color: 0x6b6b6b});
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.point.pos.getX(), this.point.pos.getY(), 900);
    this.parent.add(this.mesh);
};

REAL3D.Wall.Wall3D = function (point1, point2, thick, height, parent, globalPublisher) {
    "use strict";
    //console.log("New Wall3D, point1, ", point1, " point2, ", point2);
    this.point1 = point1;
    this.point2 = point2;
    this.thick = thick;
    this.height = height;
    this.parent = parent;
    this.mesh = null;
    this.globalPublisher = globalPublisher;
    this.point1.subscribe("updateSubscriber", this, this.updateSubscriber);
    this.point2.subscribe("updateSubscriber", this, this.updateSubscriber);
    this.updateSubscriber();
    this.updateDraw();
};

REAL3D.Wall.Wall3D.prototype.remove = function () {
    "use strict";
    if (this.mesh !== null) {
        this.parent.remove(this.mesh);
    }

    var neighbors1, neigLen1, nid, neighbors2, neigLen2;
    this.point1.unsubscribe("updateSubscriber", this, this.updateSubscriber);
    this.point1.unsubscribe("updateDraw", this, this.updateDraw);
    this.point1.unsubscribe("remove", this, this.remove);
    neighbors1 = this.point1.neighbors;
    neigLen1 = neighbors1.length;
    for (nid = 0; nid < neigLen1; nid++) {
        neighbors1[nid].unsubscribe("updateDraw", this, this.updateDraw);
    }
    this.point2.unsubscribe("updateSubscriber", this, this.updateSubscriber);
    this.point2.unsubscribe("updateDraw", this, this.updateDraw);
    this.point2.unsubscribe("remove", this, this.remove);
    neighbors2 = this.point2.neighbors;
    neigLen2 = neighbors2.length;
    for (nid = 0; nid < neigLen2; nid++) {
        neighbors2[nid].unsubscribe("updateDraw", this, this.updateDraw);
    }
    this.globalPublisher.unsubscribe("updateDraw", this);
    this.globalPublisher.unsubscribe("remove", this);

    this.point1 = null;
    this.point2 = null;
    this.mesh = null;
    this.parent = null;
};

REAL3D.Wall.Wall3D.prototype.updateDraw = function () {
    "use strict";
    if (this.mesh !== null) {
        this.parent.remove(this.mesh);
    }
    var wall2dPoints, wall2dLen, geometry, material, pid, fid;
    wall2dPoints = this.generateGeometry();
    wall2dLen = wall2dPoints.length;

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

REAL3D.Wall.Wall3D.prototype.updateSubscriber = function () {
    "use strict";
    //console.log("point1", this.point1);
    //console.log("point2", this.point2);
    var neighbors1, neigLen1, nid, neighbors2, neigLen2;
    this.point1.subscribe("updateDraw", this, this.updateDraw);
    this.point1.subscribe("remove", this, this.remove);
    neighbors1 = this.point1.neighbors;
    neigLen1 = neighbors1.length;
    for (nid = 0; nid < neigLen1; nid++) {
        neighbors1[nid].subscribe("updateDraw", this, this.updateDraw);
    }
    this.point2.subscribe("updateDraw", this, this.updateDraw);
    this.point2.subscribe("remove", this, this.remove);
    neighbors2 = this.point2.neighbors;
    neigLen2 = neighbors2.length;
    for (nid = 0; nid < neigLen2; nid++) {
        neighbors2[nid].subscribe("updateDraw", this, this.updateDraw);
    }
    this.globalPublisher.subscribe("updateDraw", this, this.updateDraw);
    this.globalPublisher.subscribe("remove", this, this.remove);
};

REAL3D.Wall.Wall3D.prototype.generateGeometry = function () {
    "use strict";
    var wallPoints, wallPos1, wallPos2, wallPos3, wallPos4;
    wallPoints = this.generateWallPoint(this.point1, this.point2);
    wallPos1 = wallPoints[0];
    wallPos2 = wallPoints[1];

    wallPoints = this.generateWallPoint(this.point2, this.point1);
    wallPos3 = wallPoints[0];
    wallPos4 = wallPoints[1];

    return [wallPos1, wallPos2, wallPos3, wallPos4];
};

REAL3D.Wall.Wall3D.prototype.generateWallVector = function (pos1, pos2, assistPos) {
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

REAL3D.Wall.Wall3D.prototype.generateWallPoint = function (point1, point2) {
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

