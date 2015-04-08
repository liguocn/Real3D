/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.CageModel = {
};

REAL3D.CageModel.Cage = function (mesh, drawParent) {
    "use strict";
    this.mesh = mesh;
    this.drawParent = drawParent;
    this.drawObject = null;
    this.updateDraw();
};

REAL3D.CageModel.Cage.prototype.updateDraw = function () {
    "use strict";
    if (this.drawObject !== null && this.drawParent !== null) {
        this.drawParent.remove(this.drawObject);
    }
    //draw
    if (this.drawParent !== null) {
        this.drawObject = new THREE.Object3D();
        this.drawParent.add(this.drawObject);
        var material, geometry, line, hEdgeCount, eid, hEdge, vPos0, vPos1;
        material = new THREE.LineBasicMaterial({color: 0xababab});
        hEdgeCount = this.mesh.getEdgeCount();
        for (eid = 0; eid < hEdgeCount; eid++) {
            hEdge = this.mesh.getEdge(eid);
            vPos0 = hEdge.getVertex().getPosition();
            vPos1 = hEdge.getPair().getVertex().getPosition();
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(vPos0.getX(), vPos0.getY(), vPos0.getZ()),
                new THREE.Vector3(vPos1.getX(), vPos1.getY(), vPos1.getZ()));
            line = new THREE.Line(geometry, material);
            this.drawObject.add(line);
        }
    }
};

// REAL3D.CageModel.Cage.prototype.updateDraw = function () {
//     "use strict";
//     if (this.drawObject !== null && this.drawParent !== null) {
//         this.drawParent.remove(this.drawObject);
//     }
//     //draw
//     if (this.drawParent !== null) {
//         this.drawObject = new THREE.Object3D();
//         this.drawParent.add(this.drawObject);
//         var material, geometry, visitFlag, cylinder, hEdgeCount, eid, hEdge, vPos0, vPos1, threeUpVector, threeEdgeVector, rotateQ, edgeVector, edgeLen;
//         material = new THREE.MeshPhongMaterial({color: 0xfefefe, specular: 0x101010, shininess: 10});
//         hEdgeCount = this.mesh.getEdgeCount();
//         threeUpVector = new THREE.Vector3(0, 1, 0);
//         visitFlag = [];
//         for (eid = 0; eid < hEdgeCount; eid++) {
//             visitFlag.push(1);
//         }
//         this.mesh.updateEdgeIndex();
//         for (eid = 0; eid < hEdgeCount; eid++) {
//             if (visitFlag[eid] !== 1) {
//                 continue;
//             }
//             hEdge = this.mesh.getEdge(eid);
//             vPos0 = hEdge.getVertex().getPosition();
//             vPos1 = hEdge.getPair().getVertex().getPosition();
//             edgeVector = REAL3D.Vector3.sub(vPos1, vPos0);
//             edgeLen = edgeVector.unify();
//             geometry = new THREE.CylinderGeometry(1, 1, edgeLen, 4);
//             cylinder = new THREE.Mesh(geometry, material);
//             cylinder.translateX((vPos0.x + vPos1.x) / 2);
//             cylinder.translateY((vPos0.y + vPos1.y) / 2);
//             cylinder.translateZ((vPos0.z + vPos1.z) / 2);
//             threeEdgeVector = new THREE.Vector3(edgeVector.x, edgeVector.y, edgeVector.z);
//             console.log(" Edge Vector: ", edgeVector.x, edgeVector.y, edgeVector.z);
//             rotateQ = new THREE.Quaternion();
//             rotateQ.setFromUnitVectors(threeUpVector, threeEdgeVector);
//             cylinder.setRotationFromQuaternion(rotateQ);
//             this.drawObject.add(cylinder);
//             visitFlag[eid] = -1;
//             visitFlag[hEdge.getPair().getAssistObject()] = -1;
//         }
//     }
// };

REAL3D.CageModel.Cage.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.drawObject = null;
    this.drawParent = null;
    this.mesh = null;
};

REAL3D.CageModel.SubdivideMesh = function (mesh, smoothValues, drawParent) {
    "use strict";
    this.mesh = mesh;
    this.smoothValues = smoothValues;
    this.drawParent = drawParent;
    this.subdivideMesh = null;
    this.drawObject = null;
    this.updateDraw();
};

REAL3D.CageModel.SubdivideMesh.prototype.generateSubdivideMesh = function () {
    "use strict";
    var subdTimes, sid, originMesh, subdMesh, startEdge, curEdge, centerPos, vertDegree, fid, faceCount, edgeCount, eid, edgeVert, vertexCount, vid, curVert, vertVert, curFace, vertices;
    subdTimes = 4;
    originMesh = this.mesh.getCopy();
    for (sid = 0; sid < subdTimes; sid++) {
        originMesh.updateFaceIndex();
        originMesh.validateTopology();
        subdMesh = new REAL3D.MeshModel.HMesh();
        faceCount = originMesh.getFaceCount();
        for (fid = 0; fid < faceCount; fid++) {
            startEdge = originMesh.getFace(fid).getEdge();
            curEdge = startEdge;
            centerPos = new REAL3D.Vector3(0, 0, 0);
            vertDegree = 0;
            do {
                centerPos.addVector(curEdge.getVertex().getPosition());
                vertDegree++;
                curEdge = curEdge.getNext();
            } while (startEdge !== curEdge);
            centerPos.multiply(1 / vertDegree);
            subdMesh.insertVertex(centerPos);
        }
        edgeCount = originMesh.getEdgeCount();
        for (eid = 0; eid < edgeCount; eid++) {
            originMesh.getEdge(eid).setAssistObject(null);
        }
        for (eid = 0; eid < edgeCount; eid++) {
            if (originMesh.getEdge(eid).getAssistObject() !== null) {
                continue;
            }
            curEdge = originMesh.getEdge(eid);
            centerPos = new REAL3D.Vector3(0, 0, 0);
            centerPos.addVector(curEdge.getVertex().getPosition());
            centerPos.addVector(curEdge.getPair().getVertex().getPosition());
            if (curEdge.getFace() !== null && curEdge.getPair().getFace() !== null) {
                centerPos.addVector(subdMesh.getVertex(curEdge.getFace().getAssistObject()).getPosition());
                centerPos.addVector(subdMesh.getVertex(curEdge.getPair().getFace().getAssistObject()).getPosition());
                centerPos.multiply(0.25);
            } else {
                centerPos.multiply(0.5);
            }
            edgeVert = subdMesh.insertVertex(centerPos);
            curEdge.setAssistObject(edgeVert);
            curEdge.getPair().setAssistObject(edgeVert);
        }
        vertexCount = originMesh.getVertexCount();
        for (vid = 0; vid < vertexCount; vid++) {
            curVert = originMesh.getVertex(vid);
            centerPos = new REAL3D.Vector3(0, 0, 0);
            startEdge = curVert.getEdge();
            if (startEdge.getFace() !== null) {
                curEdge = startEdge;
                vertDegree = 0;
                do {
                    centerPos.addVector(subdMesh.getVertex(curEdge.getFace().getAssistObject()).getPosition());
                    centerPos.addVector(curEdge.getAssistObject().getPosition());
                    vertDegree++;
                    curEdge = curEdge.getPair().getNext();
                } while (curEdge !== startEdge);
                centerPos.multiply(1 / vertDegree / vertDegree);
                centerPos.addVector(REAL3D.Vector3.scale(curVert.getPosition(), (vertDegree - 2) / vertDegree));
            } else {
                centerPos.addVector(startEdge.getAssistObject().getPosition());
                curEdge = startEdge;
                do {
                    if (curEdge.getPair().getFace() === null) {
                        centerPos.addVector(curEdge.getAssistObject().getPosition());
                        break;
                    }
                    curEdge = curEdge.getPair().getNext();
                } while (curEdge !== startEdge);
                centerPos.multiply(0.25);
                centerPos.addVector(REAL3D.Vector3.scale(curVert.getPosition(), 0.5));
            }
            vertVert = subdMesh.insertVertex(centerPos);

            curEdge = startEdge;
            do {
                curFace = curEdge.getFace();
                if (curFace !== null) {
                    vertices = [];
                    vertices.push(vertVert);
                    vertices.push(curEdge.getAssistObject());
                    vertices.push(subdMesh.getVertex(curFace.getAssistObject()));
                    vertices.push(curEdge.getPre().getAssistObject());
                    subdMesh.insertFace(vertices);
                }
                if (curEdge.getPair().getFace() === null) {
                    break;
                }
                curEdge = curEdge.getPair().getNext();
            } while (curEdge !== startEdge);
        }
        originMesh = subdMesh;
    }
    originMesh.validateTopology();
    originMesh.updateNormal();

    return originMesh;
};

REAL3D.CageModel.SubdivideMesh.prototype.updateDraw = function () {
    "use strict";
    if (this.drawObject !== null && this.drawParent !== null) {
        this.drawParent.remove(this.drawObject);
    }
    //draw
    if (this.drawParent !== null) {
        var material, geometry, startEdge, curPos, curEdge, startVertId, preVertId, postVertId, vertexCount, vid, faceCount, fid;
        this.subdivideMesh = this.generateSubdivideMesh();
        geometry = new THREE.Geometry();
        vertexCount = this.subdivideMesh.getVertexCount();
        for (vid = 0; vid < vertexCount; vid++) {
            curPos = this.subdivideMesh.getVertex(vid).getPosition();
            geometry.vertices.push(new THREE.Vector3(curPos.getX(), curPos.getY(), curPos.getZ()));
        }
        this.subdivideMesh.updateVertexIndex();
        faceCount = this.subdivideMesh.getFaceCount();
        for (fid = 0; fid < faceCount; fid++) {
            startEdge = this.subdivideMesh.getFace(fid).getEdge();
            startVertId = startEdge.getVertex().getAssistObject();
            curEdge = startEdge.getNext().getNext();
            do {
                preVertId = curEdge.getPair().getVertex().getAssistObject();
                postVertId = curEdge.getVertex().getAssistObject();
                geometry.faces.push(new THREE.Face3(startVertId, preVertId, postVertId));
                curEdge = curEdge.getNext();
            } while (curEdge !== startEdge);
        }
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        material = new THREE.MeshPhongMaterial({color: 0x2babeb, specular: 0x2b2b2b, shininess: 10, transparent: false, opacity: 0.8, side: THREE.DoubleSide, shading: THREE.FlatShading});
        this.drawObject = new THREE.Mesh(geometry, material);
        this.drawParent.add(this.drawObject);
    }
};

REAL3D.CageModel.SubdivideMesh.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.drawObject = null;
    this.drawParent = null;
    this.mesh = null;
    this.smoothValues = null;
    this.subdivideMesh = null;
};
