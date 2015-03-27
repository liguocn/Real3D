/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.PickTool = {
};

REAL3D.PickTool.HITVERTEXRADIUS = 0.0005;

REAL3D.PickTool.PickHMesh = function () {
    "use strict";
    this.mesh = null;
    this.pickedVertex = null;
    this.pickedEdge = null;
    this.pickedFace = null;
};

REAL3D.PickTool.PickHMesh.prototype.setMesh = function (mesh) {
    "use strict";
    this.mesh = mesh;
    this.pickedVertex = [];
    this.pickedEdge = [];
    this.pickedFace = [];
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
    this.pickedVertex = [];
    if (minDist < REAL3D.PickTool.HITVERTEXRADIUS) {
        this.pickedVertex.push(minIndex);
        //console.log("    picked id: ", minIndex);
        return true;
    }

    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedVertex = function () {
    "use strict";
    return this.pickedVertex;
};

REAL3D.PickTool.PickHMesh.prototype.pickEdge = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedEdge = function () {
    "use strict";
};

REAL3D.PickTool.PickHMesh.prototype.pickFace = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedFace = function () {
    "use strict";
};
