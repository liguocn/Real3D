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
        material = new THREE.LineBasicMaterial({color: 0xdbdbdb});
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
    return this.mesh.getCopy();
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
        material = new THREE.MeshPhongMaterial({color: 0x2babeb, specular: 0x2b2b2b, shininess: 10, transparent: true, opacity: 0.8, side: THREE.DoubleSide, shading: THREE.FlatShading});
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
