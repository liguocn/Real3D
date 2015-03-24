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

REAL3D.CageModel.Cage.prototype.remove = function () {
    "use strict";
    if (this.drawObject !== null) {
        this.drawParent.remove(this.drawObject);
    }
    this.drawObject = null;
    this.drawParent = null;
    this.mesh = null;
};
