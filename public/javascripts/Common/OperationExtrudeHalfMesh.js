/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.Extrude = function (index, mesh, elemType, distance) {
    "use strict";
    this.index = index;
    this.mesh = mesh;
    this.elemType = elemType;
    this.distance = distance;
    this.previewMesh = null;
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
};
