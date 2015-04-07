/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.PickTool = {
};

REAL3D.PickTool.HITVERTEXRADIUS = 0.0005;
REAL3D.PickTool.HITEDGEDISTANCE = 0.01;
REAL3D.PickTool.POINTONEDGEWEIGHT = 0.1;

REAL3D.PickTool.PickHMesh = function () {
    "use strict";
    this.mesh = null;
    this.pickedVertex = null;
    this.pickedEdge = null;
    this.pickedFace = null;
    this.currentElementType = null;
};

REAL3D.PickTool.PickHMesh.prototype.clearPickedElement = function (keepMesh) {
    "use strict";
    if (!keepMesh) {
        this.mesh = null;
        this.pickedVertex = null;
        this.pickedEdge = null;
        this.pickedFace = null;
    } else {
        this.pickedVertex = [];
        this.pickedEdge = [];
        this.pickedFace = [];
    }
    this.currentElementType = null;
};

REAL3D.PickTool.PickHMesh.prototype.clearPickedVertex = function () {
    "use strict";
    this.pickedVertex = [];
};

REAL3D.PickTool.PickHMesh.prototype.clearPickedEdge = function () {
    "use strict";
    this.pickedEdge = [];
};

REAL3D.PickTool.PickHMesh.prototype.clearPickedFace = function () {
    "use strict";
    this.pickedFace = [];
};

REAL3D.PickTool.PickHMesh.prototype.setMesh = function (mesh, keepPickIndex) {
    "use strict";
    this.mesh = mesh;
    if (!keepPickIndex) {
        this.pickedVertex = [];
        this.pickedEdge = [];
        this.pickedFace = [];
        this.currentElementType = null;
    }
};

REAL3D.PickTool.PickHMesh.prototype.getMesh = function () {
    "use strict";
    return this.mesh;
};

REAL3D.PickTool.PickHMesh.prototype.pickVertex = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    if (this.mesh === null) {
        return false;
    }
    var wpMatrix, vertexCount, vid, vPos, threeVPos, vDist, minDist, minIndex;
    wpMatrix = new THREE.Matrix4();
    wpMatrix.multiplyMatrices(projectMatrix, worldMatrix);
    vertexCount = this.mesh.getVertexCount();
    //console.log("  worldMatrix: ", worldMatrix.elements[0], worldMatrix.elements[1], worldMatrix.elements[2], worldMatrix.elements[3], worldMatrix.elements[4], worldMatrix.elements[5], worldMatrix.elements[6], worldMatrix.elements[7], worldMatrix.elements[8], worldMatrix.elements[9], worldMatrix.elements[10], worldMatrix.elements[11], worldMatrix.elements[12], worldMatrix.elements[13], worldMatrix.elements[14], worldMatrix.elements[15]);
    //console.log("  projectMatrix: ", projectMatrix.elements[0], projectMatrix.elements[1], projectMatrix.elements[2], projectMatrix.elements[3], projectMatrix.elements[4], projectMatrix.elements[5], projectMatrix.elements[6], projectMatrix.elements[7], projectMatrix.elements[8], projectMatrix.elements[9], projectMatrix.elements[10], projectMatrix.elements[11], projectMatrix.elements[12], projectMatrix.elements[13], projectMatrix.elements[14], projectMatrix.elements[15]);
    //console.log("  wpMatrix: ", wpMatrix.elements[0], wpMatrix.elements[1], wpMatrix.elements[2], wpMatrix.elements[3], wpMatrix.elements[4], wpMatrix.elements[5], wpMatrix.elements[6], wpMatrix.elements[7], wpMatrix.elements[8], wpMatrix.elements[9], wpMatrix.elements[10], wpMatrix.elements[11], wpMatrix.elements[12], wpMatrix.elements[13], wpMatrix.elements[14], wpMatrix.elements[15]);
    minDist = 1;
    minIndex = -1;
    for (vid = 0; vid < vertexCount; vid++) {
        vPos = this.mesh.getVertex(vid).getPosition();
        threeVPos = new THREE.Vector3(vPos.getX(), vPos.getY(), vPos.getZ());
        threeVPos.applyProjection(wpMatrix);
        vDist = (mouseNormPosX - threeVPos.x) * (mouseNormPosX - threeVPos.x) + (mouseNormPosY - threeVPos.y) * (mouseNormPosY - threeVPos.y);
        if (vDist < minDist) {
            minDist = vDist;
            minIndex = vid;
        }
        //console.log("  vertex", vid, " vDist: ", vDist, " project: ", threeVPos.x, threeVPos.y, threeVPos.z, " mousePos: ", mouseNormPosX, mouseNormPosY);
    }
    if (minDist < REAL3D.PickTool.HITVERTEXRADIUS) {
        this.pickedVertex = [];
        this.pickedVertex.push(minIndex);
        this.currentElementType = REAL3D.MeshModel.ElementType.VERTEX;
        //console.log("    picked id: ", minIndex);
        return true;
    }

    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedVertex = function () {
    "use strict";
    return this.pickedVertex;
};

REAL3D.PickTool.PickHMesh.prototype.pickEdge = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY, onlyBoundary) {
    "use strict";
    if (this.mesh === null) {
        return false;
    }
    this.mesh.updateEdgeIndex();
    var wpMatrix, edgeCount, eid, visitFlag, mousePoint, curEdge, pairEdge, vertPosStart, vertPosEnd, threeVertPosStart, threeVertPosEnd;
    wpMatrix = new THREE.Matrix4();
    wpMatrix.multiplyMatrices(projectMatrix, worldMatrix);
    edgeCount = this.mesh.getEdgeCount();
    visitFlag = [];
    if (onlyBoundary) {
        for (eid = 0; eid < edgeCount; eid++) {
            if (this.mesh.getEdge(eid).getFace() !== null) {
                visitFlag.push(-1);
            } else {
                visitFlag.push(1);
            }
        }
    } else {
        for (eid = 0; eid < edgeCount; eid++) {
            visitFlag.push(1);
        }
    }

    mousePoint = new REAL3D.Vector2(mouseNormPosX, mouseNormPosY);
    for (eid = 0; eid < edgeCount; eid++) {
        if (visitFlag[eid] !== 1) {
            continue;
        }
        curEdge = this.mesh.getEdge(eid);
        pairEdge = curEdge.getPair();
        visitFlag[eid] = -1;
        visitFlag[pairEdge.getAssistObject()] = -1;
        vertPosStart = pairEdge.getVertex().getPosition();
        threeVertPosStart = new THREE.Vector3(vertPosStart.getX(), vertPosStart.getY(), vertPosStart.getZ());
        threeVertPosStart.applyProjection(wpMatrix);
        vertPosEnd = curEdge.getVertex().getPosition();
        threeVertPosEnd = new THREE.Vector3(vertPosEnd.getX(), vertPosEnd.getY(), vertPosEnd.getZ());
        threeVertPosEnd.applyProjection(wpMatrix);
        if (this.isPointOnLineSegment(mousePoint, new REAL3D.Vector2(threeVertPosStart.x, threeVertPosStart.y), new REAL3D.Vector2(threeVertPosEnd.x, threeVertPosEnd.y))) {
            this.pickedEdge = [];
            this.pickedEdge.push(eid);
            this.currentElementType = REAL3D.MeshModel.ElementType.EDGE;
            return true;
        }
    }

    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedEdge = function () {
    "use strict";
    return this.pickedEdge;
};

REAL3D.PickTool.PickHMesh.prototype.pickFace = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    if (this.mesh === null) {
        return false;
    }
    var wpMatrix, faceCount, mousePoint, faceNormal, threeFaceNormal, fid, startEdge, polyVertices, polyTriCount, ptid, curEdge, bboxMinX, bboxMaxX, bboxMinY, bboxMaxY, vertPos, threeVertPos;
    wpMatrix = new THREE.Matrix4();
    wpMatrix.multiplyMatrices(projectMatrix, worldMatrix);
    faceCount = this.mesh.getFaceCount();
    mousePoint = new REAL3D.Vector2(mouseNormPosX, mouseNormPosY);
    for (fid = 0; fid < faceCount; fid++) {
        //cull back face
        faceNormal = this.mesh.getFace(fid).getNormal();
        threeFaceNormal = new THREE.Vector3(faceNormal.getX(), faceNormal.getY(), faceNormal.getZ());
        threeFaceNormal.applyMatrix4(worldMatrix);
        if (threeFaceNormal.z <= 0) {
            continue;
        }
        //collect polyline vertices
        polyVertices = [];
        startEdge = this.mesh.getFace(fid).getEdge();
        curEdge = startEdge;
        bboxMinX = null;
        bboxMaxX = null;
        bboxMinY = null;
        bboxMaxY = null;
        do {
            vertPos = curEdge.getVertex().getPosition();
            threeVertPos = new THREE.Vector3(vertPos.getX(), vertPos.getY(), vertPos.getZ());
            threeVertPos.applyProjection(wpMatrix);  //speed up: project all the vertices once
            polyVertices.push(new REAL3D.Vector2(threeVertPos.x, threeVertPos.y));
            if (bboxMinX === null) {
                bboxMinX = threeVertPos.x;
                bboxMaxX = threeVertPos.x;
                bboxMinY = threeVertPos.y;
                bboxMaxY = threeVertPos.y;
            } else {
                if (threeVertPos.x < bboxMinX) {
                    bboxMinX = threeVertPos.x;
                } else if (threeVertPos.x > bboxMaxX) {
                    bboxMaxX = threeVertPos.x;
                }
                if (threeVertPos.y < bboxMinY) {
                    bboxMinY = threeVertPos.y;
                } else if (threeVertPos.y > bboxMaxY) {
                    bboxMaxY = threeVertPos.y;
                }
            }
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        if (polyVertices.length < 3) {
            continue;
        }
        //compare bbox
        if (mouseNormPosX <= bboxMinX || mouseNormPosX >= bboxMaxX || mouseNormPosY <= bboxMinY || mouseNormPosY >= bboxMaxY) {
            continue;
        }
        //judge line segments' intersections
        polyTriCount = polyVertices.length - 2;
        for (ptid = 1; ptid <= polyTriCount; ptid++) {
            if (this.isPointIn2DTriangle(mousePoint, polyVertices[0], polyVertices[ptid], polyVertices[ptid + 1])) {
                this.pickedFace = [];
                this.pickedFace.push(fid);
                this.currentElementType = REAL3D.MeshModel.ElementType.FACE;
                return true;
            }
        }
    }
    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedFace = function () {
    "use strict";
    return this.pickedFace;
};

REAL3D.PickTool.PickHMesh.prototype.isPointIn2DTriangle = function (point, triVert0, triVert1, triVert2) {
    "use strict";
    var intersectCount;
    intersectCount = 0;
    if (this.isPointXRayIntersectLineSegment(point, triVert0, triVert1)) {
        intersectCount++;
    }
    if (this.isPointXRayIntersectLineSegment(point, triVert1, triVert2)) {
        intersectCount++;
    }
    if (this.isPointXRayIntersectLineSegment(point, triVert2, triVert0)) {
        intersectCount++;
    }
    return (intersectCount === 1);
};

REAL3D.PickTool.PickHMesh.prototype.isPointXRayIntersectLineSegment = function (point, vert0, vert1) {
    "use strict";
    var yDelta, w, t;
    yDelta = vert0.y - vert1.y;
    if (REAL3D.isZero(yDelta)) {
        return false;
    }
    w = (point.y - vert1.y) / yDelta;
    if (w >= 1 || w <= 0) {
        return false;
    }
    t = w * vert0.x + (1 - w) * vert1.x - point.x;
    return (t > 0);
};

REAL3D.PickTool.PickHMesh.prototype.isPointOnLineSegment = function (point, vert0, vert1) {
    "use strict";
    var lineVec, lineVecLen, pointVec, w, distVec;
    lineVec = REAL3D.Vector2.sub(vert1, vert0);
    lineVecLen = REAL3D.Vector2.dotProduct(lineVec, lineVec);
    if (REAL3D.isZero(lineVecLen)) {
        return false;
    }
    pointVec = REAL3D.Vector2.sub(vert1, point);
    w = REAL3D.Vector2.dotProduct(lineVec, pointVec) / lineVecLen;
    if (w <= 0 || w >= 1) {
        return false;
    }
    distVec = REAL3D.Vector2.sub(REAL3D.Vector2.add(REAL3D.Vector2.scale(vert0, w), REAL3D.Vector2.scale(vert1, 1 - w)), point);
    if (distVec.length() < REAL3D.PickTool.HITEDGEDISTANCE) {
        return true;
    }
    return false;
};
