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
    this.startVertices = null;
    this.endVertices = null;
    this.centerVertices = null;
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.preview = function (pickTool) {
    "use strict";
    if (this.previewMesh === null) {
        this.constructPreviewTopology();
        pickTool.setMesh(this.previewMesh, false);
    } else {
        this.updateGeometry();
    }
    return this.previewMesh;
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.generate = function () {
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
    this.startVertices = null;
    this.endVertices = null;
    this.centerVertices = null;

    return resMesh;
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.constructPreviewTopology = function () {
    "use strict";
    var edge, face, startVertex0, startVertex1, endVertex0, endVertex1, centerVertex0, centerVertex1, startEdge, curEdge, faceVertices;
    this.previewMesh = this.mesh.getCopy();
    edge = this.previewMesh.getEdge(this.elemIndex);
    face = edge.getFace();
    this.startVertices = [];
    this.endVertices = [];
    this.centerVertices = [];
    if (face !== null) {
        this.previewMesh.updateFaceIndex();

        startVertex0 = edge.getPair().getVertex();
        endVertex0 = edge.getPre().getPair().getVertex();
        centerVertex0 = this.previewMesh.insertVertexOnEdge(REAL3D.Vector3.add(REAL3D.Vector3.scale(startVertex0.getPosition(), 1 - this.weight), REAL3D.Vector3.scale(endVertex0.getPosition(), this.weight)), edge.getPre());
        centerVertex0.setSmoothValue(startVertex0.getSmoothValue());
        this.startVertices.push(startVertex0);
        this.endVertices.push(endVertex0);
        this.centerVertices.push(centerVertex0);

        startVertex1 = edge.getVertex();
        endVertex1 = edge.getNext().getVertex();
        centerVertex1 = this.previewMesh.insertVertexOnEdge(REAL3D.Vector3.add(REAL3D.Vector3.scale(startVertex1.getPosition(), 1 - this.weight), REAL3D.Vector3.scale(endVertex1.getPosition(), this.weight)), edge.getNext());
        centerVertex1.setSmoothValue(startVertex1.getSmoothValue());
        this.startVertices.push(startVertex1);
        this.endVertices.push(endVertex1);
        this.centerVertices.push(centerVertex1);

        faceVertices = [];
        startEdge = face.getEdge();
        curEdge = startEdge;
        do {
            if (curEdge.getVertex() !== startVertex0 && curEdge.getVertex() !== startVertex1) {
                faceVertices.push(curEdge.getVertex());
            }
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        this.previewMesh.deleteFace(face.getAssistObject());
        this.previewMesh.insertFace(faceVertices);
        faceVertices = [startVertex0, startVertex1, centerVertex1, centerVertex0];
        this.previewMesh.insertFace(faceVertices);
        edge.getNext().getNext().setSmoothValue(edge.getSmoothValue());
        edge.getNext().getNext().getPair().setSmoothValue(edge.getSmoothValue());
    }
    face = edge.getPair().getFace();
    if (face !== null) {
        this.previewMesh.updateFaceIndex();

        startVertex0 = edge.getVertex();
        endVertex0 = edge.getPair().getPre().getPair().getVertex();
        centerVertex0 = this.previewMesh.insertVertexOnEdge(REAL3D.Vector3.add(REAL3D.Vector3.scale(startVertex0.getPosition(), 1 - this.weight), REAL3D.Vector3.scale(endVertex0.getPosition(), this.weight)), edge.getPair().getPre());
        centerVertex0.setSmoothValue(startVertex0.getSmoothValue());
        this.startVertices.push(startVertex0);
        this.endVertices.push(endVertex0);
        this.centerVertices.push(centerVertex0);

        startVertex1 = edge.getPair().getVertex();
        endVertex1 = edge.getPair().getNext().getVertex();
        centerVertex1 = this.previewMesh.insertVertexOnEdge(REAL3D.Vector3.add(REAL3D.Vector3.scale(startVertex1.getPosition(), 1 - this.weight), REAL3D.Vector3.scale(endVertex1.getPosition(), this.weight)), edge.getPair().getNext());
        centerVertex1.setSmoothValue(startVertex1.getSmoothValue());
        this.startVertices.push(startVertex1);
        this.endVertices.push(endVertex1);
        this.centerVertices.push(centerVertex1);

        faceVertices = [];
        startEdge = face.getEdge();
        curEdge = startEdge;
        do {
            if (curEdge.getVertex() !== startVertex0 && curEdge.getVertex() !== startVertex1) {
                faceVertices.push(curEdge.getVertex());
            }
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        this.previewMesh.deleteFace(face.getAssistObject());
        this.previewMesh.insertFace(faceVertices);
        faceVertices = [startVertex0, startVertex1, centerVertex1, centerVertex0];
        this.previewMesh.insertFace(faceVertices);

        edge.getPair().getNext().getNext().setSmoothValue(edge.getPair().getSmoothValue());
        edge.getPair().getNext().getNext().getPair().setSmoothValue(edge.getPair().getSmoothValue());
    }
    this.previewMesh.validateTopology();
    this.previewMesh.updateNormal();
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.updateGeometry = function () {
    "use strict";
    var vid, centerPos;
    for (vid = 0; vid < this.centerVertices.length; vid++) {
        centerPos = REAL3D.Vector3.add(REAL3D.Vector3.scale(this.startVertices[vid].getPosition(), 1 - this.weight), REAL3D.Vector3.scale(this.endVertices[vid].getPosition(), this.weight));
        this.centerVertices[vid].setPosition(centerPos);
    }
    this.previewMesh.updateNormal();
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
