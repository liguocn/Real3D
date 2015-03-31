/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel = {
};

/////////////////////////////////////////////////// HVertex ///////////////////////////////////////////////////
REAL3D.MeshModel.HVertex = function () {
    "use strict";
    this.vId = null;
    this.position = null;
    this.normal = null;
    this.color = null;
    this.texCoord = null;
    this.hEdge = null;
    this.assistObject = null;
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
    this.position = vPos.copyTo();
};

REAL3D.MeshModel.HVertex.prototype.getNormal = function () {
    "use strict";
    return this.normal;
};

REAL3D.MeshModel.HVertex.prototype.setNormal = function (vNormal) {
    "use strict";
    this.normal = vNormal.copyTo();
};

REAL3D.MeshModel.HVertex.prototype.getColor = function () {
    "use strict";
    return this.color;
};

REAL3D.MeshModel.HVertex.prototype.setColor = function (vColor) {
    "use strict";
    this.color = vColor.copyTo();
};

REAL3D.MeshModel.HVertex.prototype.getTexCoord = function () {
    "use strict";
    return this.texCoord;
};

REAL3D.MeshModel.HVertex.prototype.setTexCoord = function (vTexCoord) {
    "use strict";
    this.texCoord = vTexCoord.copyTo();
};

REAL3D.MeshModel.HVertex.prototype.getEdge = function () {
    "use strict";
    return this.hEdge;
};

REAL3D.MeshModel.HVertex.prototype.setEdge = function (hEdge) {
    "use strict";
    this.hEdge = hEdge;
};

REAL3D.MeshModel.HVertex.prototype.getAssistObject = function () {
    "use strict";
    return this.assistObject;
};

REAL3D.MeshModel.HVertex.prototype.setAssistObject = function (assistObject) {
    "use strict";
    this.assistObject = assistObject;
};

/////////////////////////////////////////////////// HEdge ///////////////////////////////////////////////////
REAL3D.MeshModel.HEdge = function () {
    "use strict";
    this.eId = null;
    this.hVertex = null;
    this.pairEdge = null;
    this.nextEdge = null;
    this.preEdge = null;
    this.hFace = null;
    this.assistObject = null;
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

REAL3D.MeshModel.HEdge.prototype.getFace = function () {
    "use strict";
    return this.hFace;
};

REAL3D.MeshModel.HEdge.prototype.setFace = function (hFace) {
    "use strict";
    return this.hFace = hFace;
};

REAL3D.MeshModel.HEdge.prototype.getAssistObject = function () {
    "use strict";
    return this.assistObject;
};

REAL3D.MeshModel.HEdge.prototype.setAssistObject = function (assistObject) {
    "use strict";
    this.assistObject = assistObject;
};

/////////////////////////////////////////////////// HFace ///////////////////////////////////////////////////
REAL3D.MeshModel.HFace = function () {
    "use strict";
    this.fId = null;
    this.hEdge = null;
    this.normal = null;
    this.assistObject = null;
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
    this.normal = fNormal.copyTo();
};

REAL3D.MeshModel.HFace.prototype.getAssistObject = function () {
    "use strict";
    return this.assistObject;
};

REAL3D.MeshModel.HFace.prototype.setAssistObject = function (assistObject) {
    "use strict";
    this.assistObject = assistObject;
};

/////////////////////////////////////////////////// EdgeMap ///////////////////////////////////////////////////
REAL3D.MeshModel.EdgeMap = function () {
    "use strict";
    this.edges = [];
};

REAL3D.MeshModel.EdgeMap.prototype.createEdge = function (vertStart, vertEnd) {
    "use strict";
    var vertexEdges, vertStartId, vertEndId, eid, res;
    vertStartId = vertStart.getId();
    vertEndId = vertEnd.getId();
    res = {
        isNew: true,
        edge: null
    };
    if (this.edges[vertStartId] === undefined) {
        res.isNew = true;
        this.edges[vertStartId] = [];
        res.edge = new REAL3D.MeshModel.HEdge();
        res.edge.setVertex(vertEnd);
        this.edges[vertStartId].push({vertId: vertEndId, edge: res.edge});
    } else {
        vertexEdges = this.edges[vertStartId];
        res.isNew = true;
        for (eid = 0; eid < vertexEdges.length; eid++) {
            if (vertexEdges[eid].vertId === vertEndId) {
                res.edge = vertexEdges[eid].edge;
                res.isNew = false;
                break;
            }
        }
        if (res.isNew) {
            res.edge = new REAL3D.MeshModel.HEdge();
            res.edge.setVertex(vertEnd);
            vertexEdges.push({vertId: vertEndId, edge: res.edge});
        }
    }
    return res;
};

/////////////////////////////////////////////////// HMesh ///////////////////////////////////////////////////
REAL3D.MeshModel.HMesh = function () {
    "use strict";
    this.vertices = [];
    this.edges = [];
    this.faces = [];
    this.edgeMap = new REAL3D.MeshModel.EdgeMap();
    this.vertexNewId = 0;
    this.edgeNewId = 0;
    this.faceNewId = 0;
};

REAL3D.MeshModel.HMesh.prototype.getVertex = function (index) {
    "use strict";
    return this.vertices[index];
};

REAL3D.MeshModel.HMesh.prototype.getVertexCount = function () {
    "use strict";
    return this.vertices.length;
};

REAL3D.MeshModel.HMesh.prototype.getEdge = function (index) {
    "use strict";
    return this.edges[index];
};

REAL3D.MeshModel.HMesh.prototype.getEdgeCount = function () {
    "use strict";
    return this.edges.length;
};

REAL3D.MeshModel.HMesh.prototype.getFace = function (index) {
    "use strict";
    return this.faces[index];
};

REAL3D.MeshModel.HMesh.prototype.getFaceCount = function () {
    "use strict";
    return this.faces.length;
};

REAL3D.MeshModel.HMesh.prototype.updateNormal = function () {
    "use strict";
    console.log("  updateNormal");
    var faceCount, fid, startEdge, curEdge, startVertPos, faceNormal, triVertPos0, triVertPos1, vertCount, vid, vertNormal;
    //update face normal
    faceCount = this.faces.length;
    for (fid = 0; fid < faceCount; fid++) {
        startEdge = this.faces[fid].getEdge();
        startVertPos = startEdge.getPair().getVertex().getPosition();
        curEdge = startEdge.getNext().getNext();
        faceNormal = new REAL3D.Vector3(0, 0, 0);
        while (curEdge !== startEdge) {
            triVertPos0 = curEdge.getPair().getVertex().getPosition();
            triVertPos1 = curEdge.getVertex().getPosition();
            faceNormal.addVector(REAL3D.Vector3.crossProduct(REAL3D.Vector3.sub(triVertPos0, startVertPos),
                REAL3D.Vector3.sub(triVertPos1, startVertPos)));
            curEdge = curEdge.getNext();
        }
        faceNormal.unify();
        this.faces[fid].setNormal(faceNormal);
    }

    //update vertex normal
    vertCount = this.vertices.length;
    for (vid = 0; vid < vertCount; vid++) {
        startEdge = this.vertices[vid].getEdge();
        curEdge = startEdge;
        vertNormal = new REAL3D.Vector3(0, 0, 0);
        do {
            vertNormal.addVector(curEdge.getFace().getNormal());
            curEdge = curEdge.getPair().getNext();
        } while (curEdge !== startEdge && curEdge !== null);
        vertNormal.unify();
        this.vertices[vid].setNormal(vertNormal);
    }
};

//primitive operations
REAL3D.MeshModel.HMesh.prototype.insertVertex = function (vertPos) {
    "use strict";
    var newVertex;
    newVertex = new REAL3D.MeshModel.HVertex();
    newVertex.setPosition(vertPos);
    newVertex.setId(this.vertexNewId);
    this.vertexNewId++;
    this.vertices.push(newVertex);
    return newVertex;
};

// REAL3D.MeshModel.HMesh.prototype.deleteVertex = function (vertex) {
//     "use strict";
// };

REAL3D.MeshModel.HMesh.prototype.insertEdge = function (vertStart, vertEnd) {
    "use strict";
    var res = this.edgeMap.createEdge(vertStart, vertEnd);
    if (res.isNew) {
        res.edge.setId(this.edgeNewId);
        this.edgeNewId++;
        this.edges.push(res.edge);
        vertStart.setEdge(res.edge);
    }
    return res.edge;
};

// REAL3D.MeshModel.HMesh.prototype.deleteEdge = function (edge) {
//     "use strict";
// };

REAL3D.MeshModel.HMesh.prototype.insertFace = function (vertices) {
    "use strict";
    if (vertices.length < 3) {
        return null;
    }
    var newFace, vertCount, innerEdges, vid, eid, curEdge, pairEdge;
    newFace = new REAL3D.MeshModel.HFace();
    newFace.setId(this.faceNewId);
    this.faceNewId++;
    innerEdges = [];
    vertCount = vertices.length;
    for (vid = 0; vid < vertCount; vid++) {
        curEdge = this.insertEdge(vertices[vid], vertices[(vid + 1) % vertCount]);
        curEdge.setFace(newFace);
        innerEdges.push(curEdge);
        pairEdge = this.insertEdge(vertices[(vid + 1) % vertCount], vertices[vid]);
        curEdge.setPair(pairEdge);
        pairEdge.setPair(curEdge);
    }
    for (eid = 0; eid < vertCount; eid++) {
        innerEdges[eid].setNext(innerEdges[(eid + 1) % vertCount]);
        innerEdges[(eid + 1) % vertCount].setPre(innerEdges[eid]);
    }
    newFace.setEdge(innerEdges[0]);
    this.faces.push(newFace);
    return newFace;
};

REAL3D.MeshModel.HMesh.prototype.deleteFace = function (face) {
    "use strict";
};

REAL3D.MeshModel.HMesh.prototype.updateVertexIndex = function () {
    "use strict";
    var vid, vertexCount;
    vertexCount = this.vertices.length;
    for (vid = 0; vid < vertexCount; vid++) {
        this.vertices[vid].setAssistObject(vid);
    }
};

REAL3D.MeshModel.HMesh.prototype.updateEdgeIndex = function () {
    "use strict";
    var eid, edgeCount;
    edgeCount = this.edges.length;
    for (eid = 0; eid < edgeCount; eid++) {
        this.edges[eid].setAssistObject(eid);
    }
};

REAL3D.MeshModel.HMesh.prototype.updateFaceIndex = function () {
    "use strict";
    var fid, faceCount;
    faceCount = this.faces.length;
    for (fid = 0; fid < faceCount; fid++) {
        this.faces[fid].setAssistObject(fid);
    }
};

REAL3D.MeshModel.ElementType = {
    VERTEX: 0,
    EDGE: 1,
    FACE: 2
};
