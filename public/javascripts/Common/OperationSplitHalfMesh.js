/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.SubdivideFace = function (elemIndex, mesh, weight) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.weight = weight;
    this.previewMesh = null;
    this.originVertices = null;
    this.subdVertices = null;
    this.centerPosition = null;
};

REAL3D.MeshModel.SubdivideFace.prototype.preview = function (pickTool) {
    "use strict";
    if (this.previewMesh === null) {
        this.constructPreviewTopology();
        pickTool.setMesh(this.previewMesh, false);
    } else {
        this.updateGeometry();
    }

    return this.previewMesh;

};

REAL3D.MeshModel.SubdivideFace.prototype.generate = function () {
    "use strict";
    if (this.previewMesh === null) {
        this.constructPreviewTopology();
    } else {
        this.updateGeometry();
    }
    var resMesh = this.previewMesh;

    //free data
    this.previewMesh = null;
    this.mesh = null;
    this.originVertices = null;
    this.subdVertices = null;
    this.centerVertex = null;

    return resMesh;
};

REAL3D.MeshModel.SubdivideFace.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};

REAL3D.MeshModel.SubdivideFace.prototype.constructPreviewTopology = function () {
    "use strict";
    var startEdge, curEdge, subdPosition, subdVertex, scaleCenterPos, vid, vertCount, nextId, faceVertices;
    this.previewMesh = this.mesh.getCopy();
    startEdge = this.previewMesh.getFace(this.elemIndex).getEdge();
    curEdge = startEdge;
    this.centerPosition = new REAL3D.Vector3(0, 0, 0);
    vertCount = 0;
    do {
        this.centerPosition.addVector(curEdge.getVertex().getPosition());
        vertCount++;
        curEdge = curEdge.getNext();
    } while (curEdge !== startEdge);
    this.centerPosition.multiply(1 / vertCount);
    curEdge = startEdge;
    scaleCenterPos = REAL3D.Vector3.scale(this.centerPosition, this.weight);
    this.originVertices = [];
    this.subdVertices = [];
    do {
        subdPosition = REAL3D.Vector3.add(REAL3D.Vector3.scale(curEdge.getVertex().getPosition(), 1 - this.weight), scaleCenterPos);
        subdVertex = this.previewMesh.insertVertex(subdPosition);
        subdVertex.setSmoothValue(0);
        this.originVertices.push(curEdge.getVertex());
        this.subdVertices.push(subdVertex);
        curEdge = curEdge.getNext();
    } while (curEdge !== startEdge);
    this.previewMesh.deleteFace(this.elemIndex);
    vertCount = this.originVertices.length;
    for (vid = 0; vid < vertCount; vid++) {
        nextId = (vid + 1) % vertCount;
        faceVertices = [this.originVertices[vid], this.originVertices[nextId], this.subdVertices[nextId], this.subdVertices[vid]];
        this.previewMesh.insertFace(faceVertices);
    }
    faceVertices = [];
    for (vid = 0; vid < vertCount; vid++) {
        faceVertices.push(this.subdVertices[vid]);
    }
    this.previewMesh.insertFace(faceVertices);
    this.previewMesh.validateTopology();
    for (vid = 0; vid < vertCount; vid++) {
        startEdge = this.subdVertices[vid].getEdge();
        curEdge = startEdge;
        do {
            curEdge.setSmoothValue(0);
            curEdge.getPair().setSmoothValue(0);
            curEdge = curEdge.getPair().getNext();
        } while (curEdge !== startEdge);
    }
    this.previewMesh.updateNormal();
};

REAL3D.MeshModel.SubdivideFace.prototype.updateGeometry = function () {
    "use strict";
    var vid, vertCount, scaleCenterPos, subdPosition;
    scaleCenterPos = REAL3D.Vector3.scale(this.centerPosition, this.weight);
    vertCount = this.originVertices.length;
    for (vid = 0; vid < vertCount; vid++) {
        subdPosition = REAL3D.Vector3.add(REAL3D.Vector3.scale(this.originVertices[vid].getPosition(), 1 - this.weight), scaleCenterPos);
        this.subdVertices[vid].setPosition(subdPosition);
    }
    this.previewMesh.updateNormal();
};

REAL3D.MeshModel.SplitFaceBySharpEdge = function (elemIndex, mesh, weight) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.weight = weight;
    this.previewMesh = null;
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.preview = function (pickTool) {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};

REAL3D.MeshModel.SplitFaceBySharpVertex = function (elemIndex, mesh, weight) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.weight = weight;
    this.previewMesh = null;
    this.previewElemIndex = null;
};

REAL3D.MeshModel.SplitFaceBySharpVertex.prototype.preview = function (pickTool) {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpVertex.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpVertex.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};
