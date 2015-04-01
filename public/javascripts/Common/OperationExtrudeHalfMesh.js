/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.Extrude = function (elemIndex, mesh, elemType, distance) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.elemType = elemType;
    this.distance = distance;
    this.previewMesh = null;
    this.previewElemIndex = null;
    this.originVertices = null;
    this.extrudeVertices = null;
    //console.log("    new Extrude Operation: ", elemIndex, elemType, distance);
};

REAL3D.MeshModel.Extrude.prototype.preview = function (pickTool) {
    "use strict";
    if (this.previewMesh === null) {
        this.constructPreviewTopology();
        //update pickTool mesh and its picked element
        pickTool.setMesh(this.previewMesh, false);
        if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
            pickTool.pickedFace.push(this.previewElemIndex);
        } else if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {
            pickTool.pickedEdge.push(this.previewElemIndex);
        }
    }
    //extrude distance
    this.extrudePreviewMesh();

    return this.previewMesh;
};

REAL3D.MeshModel.Extrude.prototype.generate = function () {
    "use strict";
    //extrude preview mesh and return it
    if (this.previewMesh === null) {
        this.constructPreviewTopology();
    }
    this.extrudePreviewMesh();
    var resMesh = this.previewMesh;

    //free data
    this.previewMesh = null;
    this.mesh = null;
    this.previewElemIndex = null;
    this.originVertices = null;
    this.extrudeVertices = null;

    return resMesh;
};

REAL3D.MeshModel.Extrude.prototype.addDistance = function (deltaDist) {
    "use strict";
    this.distance += deltaDist;
    if (this.distance < 0) {
        this.distance = 0;
    }
};

REAL3D.MeshModel.Extrude.prototype.setDistance = function (dist) {
    "use strict";
    if (dist >= 0) {
        this.distance = dist;
    }
};

REAL3D.MeshModel.Extrude.prototype.constructPreviewTopology = function () {
    "use strict";
    var startEdge, curEdge, curVertex, extrudeVertexLen, faceVertices, extrudeVertex, vid, nextId, extrudeFace;
    //construct extrude topology
    this.previewMesh = this.mesh.getCopy();
    if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
        this.originVertices = [];
        this.extrudeVertices = [];
        startEdge = this.previewMesh.getFace(this.elemIndex).getEdge();
        curEdge = startEdge;
        do {
            curVertex = curEdge.getVertex();
            this.originVertices.push(curVertex);
            extrudeVertex = this.previewMesh.insertVertex(curVertex.getPosition());
            this.extrudeVertices.push(extrudeVertex);
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        this.previewMesh.deleteFace(this.elemIndex);
        extrudeVertexLen = this.originVertices.length;
        for (vid = 0; vid < extrudeVertexLen; vid++) {
            nextId = (vid + 1) % extrudeVertexLen;
            faceVertices = [this.originVertices[vid], this.originVertices[nextId], this.extrudeVertices[nextId], this.extrudeVertices[vid]];
            this.previewMesh.insertFace(faceVertices);
        }
        extrudeFace =  this.previewMesh.insertFace(this.extrudeVertices);
        this.previewMesh.validateTopology();
        this.previewMesh.updateNormal();
        this.previewMesh.updateFaceIndex();
        this.previewElemIndex = extrudeFace.getAssistObject();
    } else if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {

    } else {
        console.log("error: wrong element type in extrude preview: ", this.elemType);
    }
};

REAL3D.MeshModel.Extrude.prototype.extrudePreviewMesh = function () {
    "use strict";
    var extrudeVertexLen, vid, extrudeVec;
    if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
        extrudeVec = this.previewMesh.getFace(this.previewElemIndex).getNormal();
        extrudeVec.multiply(this.distance);
        extrudeVertexLen = this.originVertices.length;
        for (vid = 0; vid < extrudeVertexLen; vid++) {
            this.extrudeVertices[vid].setPosition(REAL3D.Vector3.add(this.originVertices[vid].getPosition(), extrudeVec));
        }
        this.previewMesh.updateNormal();

    } else if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {

    }
};
