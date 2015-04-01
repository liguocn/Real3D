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
    this.hFace = hFace;
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
            if (curEdge.getFace() !== null) {
                vertNormal.addVector(curEdge.getFace().getNormal());
            }
            if (curEdge.getPair().getFace() === null) {
                break;
            }
            curEdge = curEdge.getPair().getNext();
        } while (curEdge !== startEdge);
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

// REAL3D.MeshModel.HMesh.prototype.deleteVertex = function (vertexIndex) {
//     "use strict";
// };

REAL3D.MeshModel.HMesh.prototype.insertEdge = function (vertStart, vertEnd) {
    "use strict";
    var res = this.edgeMap.createEdge(vertStart, vertEnd);
    if (res.isNew) {
        res.edge.setId(this.edgeNewId);
        this.edgeNewId++;
        this.edges.push(res.edge);
        if (res.edge.getFace() !== null) {
            vertStart.setEdge(res.edge);
        }
    }
    return res.edge;
};

// //1. Remove edge face
// //2. Remove edge and its pair
// REAL3D.MeshModel.HMesh.prototype.deleteEdge = function (edgeIndex) {
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
        vertices[vid].setEdge(curEdge);
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

//1. make face edge's face null
//2. remove face
//3. there may exist dummy edge or vertex, if you want to remove them, please call removeDummyElement
REAL3D.MeshModel.HMesh.prototype.deleteFace = function (faceIndex) {
    "use strict";
    var curFace, startEdge, curEdge;
    if (faceIndex >= 0 && faceIndex < this.faces.length) {
        curFace = this.faces[faceIndex];
        startEdge = curFace.getEdge();
        curEdge = startEdge;
        do {
            curEdge.setFace(null);
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        this.faces.splice(faceIndex, 1);
    }
};

//1. remove dummy element
//2. make mesh a manifold
REAL3D.MeshModel.HMesh.prototype.removeDummyElement = function () {
    "use strict";
    var edgeCount, eid, removeFlag, boundaryEdges, preEdge, nextEdge, pairEdge, startVert, curEdge, vertCount, vid, curVert;
    edgeCount = this.edges.length;
    removeFlag = [];
    boundaryEdges = [];
    for (eid = 0; eid < edgeCount; eid++) {
        if (this.edges[eid].getFace() !== null || this.edges[eid].getPair().getFace() !== null) {
            removeFlag.push(0);
        } else {
            removeFlag.push(1);
        }
        if (this.edges[eid].getFace() === null && this.edges[eid].getPair().getFace() !== null) {
            boundaryEdges.push(this.edges[eid]);
        }
    }
    for (eid = edgeCount - 1; eid >= 0; eid--) {
        if (removeFlag[eid] === 1) {
            curEdge = this.edges[eid];
            preEdge = curEdge.getPre();
            if (preEdge !== null) {
                preEdge.setNext(null);
            }
            curEdge.setPre(null);
            nextEdge = curEdge.getNext();
            if (nextEdge !== null) {
                nextEdge.setPre(null);
            }
            curEdge.setNext(null);
            pairEdge = curEdge.getPair();
            if (pairEdge !== null) {
                pairEdge.setPair(null);
            }
            curEdge.setPair(null);
            curEdge.setVertex(null);

            this.edges.splice(eid, 1);
        }
    }
    //if a vertex is not a manifold, it should be splitted into several vertices: not done
    for (eid = 0; eid < boundaryEdges.length; eid++) {
        startVert = boundaryEdges[eid].getPair().getVertex();
        startVert.setEdge(boundaryEdges[eid]);
    }

    //remove dummy vertex
    vertCount = this.vertices.length;
    removeFlag = [];
    for (vid = 0; vid < vertCount; vid++) {
        curVert = this.vertices[vid];
        if (curVert.getEdge() === null) {
            removeFlag.push(1);
        } else if (curVert.getEdge().getPair() === null) {
            removeFlag.push(1);
        } else {
            removeFlag.push(0);
        }
    }
    for (vid = vertCount - 1; vid >= 0; vid--) {
        if (removeFlag[vid] === 1) {
            this.vertices.splice(vid, 1);
        }
    }
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

REAL3D.MeshModel.HMesh.prototype.getCopy = function () {
    "use strict";
    var copyMesh, vertCount, vid, faceCount, fid, faceVertices, curVertIndex, startEdge, curEdge;
    copyMesh = new REAL3D.MeshModel.HMesh();
    this.updateVertexIndex();
    vertCount = this.vertices.length;
    for (vid = 0; vid < vertCount; vid++) {
        copyMesh.insertVertex(this.vertices[vid].getPosition());
    }
    faceCount = this.faces.length;
    for (fid = 0; fid < faceCount; fid++) {
        faceVertices = [];
        startEdge = this.faces[fid].getEdge();
        curEdge = startEdge;
        do {
            curVertIndex = curEdge.getVertex().getAssistObject();
            faceVertices.push(copyMesh.getVertex(curVertIndex));
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        copyMesh.insertFace(faceVertices);
    }
    copyMesh.updateNormal();
    return copyMesh;
};

REAL3D.MeshModel.ElementType = {
    VERTEX: 0,
    EDGE: 1,
    FACE: 2
};
