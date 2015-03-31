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
    console.log("    new Extrude Operation: ", elemIndex, elemType, distance);
};

REAL3D.MeshModel.Extrude.prototype.preview = function (pickTool) {
    "use strict";
    if (this.previewMesh === null) {
        //construct extrude topology
    }
    //extrude distance

    //update pickTool mesh and its picked element
};

REAL3D.MeshModel.Extrude.prototype.apply = function () {
    "use strict";
    //extrude preview mesh and return it

    return this.previewMesh;
    //free data
    this.previewMesh = null;
    this.mesh = null;
    this.previewElemIndex = null;
};

REAL3D.MeshModel.Extrude.prototype.addDistance = function (deltaDist) {
    "use strict";
    this.distance += deltaDist;
    if (this.distance < 0) {
        this.distance = 0;
    }
};
