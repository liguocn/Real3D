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
        material = new THREE.LineBasicMaterial({color: 0x999999});
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
