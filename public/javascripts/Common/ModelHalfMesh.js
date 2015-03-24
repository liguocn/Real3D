/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel = {
};

REAL3D.MeshModel.HVertex = function () {
    "use strict";
    this.vId = null;
    this.position = null;
    this.normal = null;
    this.color = null;
    this.texCoord = null;
    this.hEdge = null;
};

REAL3D.MeshModel.HVertex.prototype.getId = function () {
    "use strict";
    return this.vId;
};

REAL3D.MeshModel.HVertex.prototype.setId = function (vId) {
    "use strict";
    this.vId = vId;
};

REAL3D.MeshModel.HVertex.prototype.getPosition = function () {
    "use strict";
    return this.position;
};

REAL3D.MeshModel.HVertex.prototype.setPosition = function (vPos) {
    "use strict";
    this.position = vPos;
};

REAL3D.MeshModel.HVertex.prototype.getNormal = function () {
    "use strict";
    return this.normal;
};

REAL3D.MeshModel.HVertex.prototype.setNormal = function (vNormal) {
    "use strict";
    this.normal = vNormal;
};

REAL3D.MeshModel.HVertex.prototype.getColor = function () {
    "use strict";
    return this.color;
};

REAL3D.MeshModel.HVertex.prototype.setColor = function (vColor) {
    "use strict";
    this.color = vColor;
};

REAL3D.MeshModel.HVertex.prototype.getTexCoord = function () {
    "use strict";
    return this.texCoord;
};

REAL3D.MeshModel.HVertex.prototype.setTexCoord = function (vTexCoord) {
    "use strict";
    this.texCoord = vTexCoord;
};

REAL3D.MeshModel.HVertex.prototype.getEdge = function () {
    "use strict";
    return this.hEdge;
};

REAL3D.MeshModel.HVertex.prototype.setEdge = function (hEdge) {
    "use strict";
    this.hEdge = hEdge;
};

REAL3D.MeshModel.HEdge = function () {
    "use strict";
    this.eId = null;
    this.hVertex = null;
    this.pairEdge = null;
    this.nextEdge = null;
    this.preEdge = null;
};

REAL3D.MeshModel.HEdge.prototype.getId = function () {
    "use strict";
    return this.eId;
};

REAL3D.MeshModel.HEdge.prototype.setId = function (eId) {
    "use strict";
    this.eId = eId;
};

REAL3D.MeshModel.HEdge.prototype.getVertex = function () {
    "use strict";
    return this.hVertex;
};

REAL3D.MeshModel.HEdge.prototype.setVertex = function (hVertex) {
    "use strict";
    this.hVertex = hVertex;
};

REAL3D.MeshModel.HEdge.prototype.getPair = function () {
    "use strict";
    return this.pairEdge;
};

REAL3D.MeshModel.HEdge.prototype.setPair = function (pairEdge) {
    "use strict";
    this.pairEdge = pairEdge;
};

REAL3D.MeshModel.HEdge.prototype.getNext = function () {
    "use strict";
    return this.nextEdge;
};

REAL3D.MeshModel.HEdge.prototype.setNext = function (nextEdge) {
    "use strict";
    this.nextEdge = nextEdge;
};

REAL3D.MeshModel.HEdge.prototype.getPre = function () {
    "use strict";
    return this.preEdge;
};

REAL3D.MeshModel.HEdge.prototype.setPre = function (preEdge) {
    "use strict";
    this.preEdge = preEdge;
};

REAL3D.MeshModel.HFace = function () {
    "use strict";
    this.fId = null;
    this.hEdge = null;
    this.normal = null;
};

REAL3D.MeshModel.HFace.prototype.getId = function () {
    "use strict";
    return this.fId;
};

REAL3D.MeshModel.HFace.prototype.setId = function (fId) {
    "use strict";
    this.fId = fId;
};

REAL3D.MeshModel.HFace.prototype.getEdge = function () {
    "use strict";
    return this.hEdge;
};

REAL3D.MeshModel.HFace.prototype.setEdge = function (hEdge) {
    "use strict";
    this.hEdge = hEdge;
};

REAL3D.MeshModel.HFace.prototype.getNormal = function () {
    "use strict";
    return this.normal;
};

REAL3D.MeshModel.HFace.prototype.setNormal = function (fNormal) {
    "use strict";
    this.normal = fNormal;
};

REAL3D.MeshModel.HMesh = function () {
    "use strict";
    this.vertices = [];
    this.edges = [];
    this.faces = [];
};

REAL3D.MeshModel.HMesh.prototype.getVertex = function (vId) {
    "use strict";
    return this.vertices[vId];
};

REAL3D.MeshModel.HMesh.prototype.getVertexCount = function () {
    "use strict";
    return this.vertices.length;
};

REAL3D.MeshModel.HMesh.prototype.getEdge = function (eId) {
    "use strict";
    return this.edges[eId];
};

REAL3D.MeshModel.HMesh.prototype.getEdgeCount = function () {
    "use strict";
    return this.edges.length;
};

REAL3D.MeshModel.HMesh.prototype.getFace = function (fId) {
    "use strict";
    return this.faces[fId];
};

REAL3D.MeshModel.HMesh.prototype.getFaceCount = function () {
    "use strict";
    return this.faces.length;
};

REAL3D.MeshModel.HMesh.prototype.updateNormal = function () {
    "use strict";
    console.log("  updateNormal");
};
