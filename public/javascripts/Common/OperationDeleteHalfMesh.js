/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.Delete = function (elemIndex, mesh, elemType) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.elemType = elemType;
};

REAL3D.MeshModel.Delete.prototype.generate = function () {
    "use strict";
    if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
        this.mesh.deleteFace(this.elemIndex);
        this.mesh.removeDummyElement();
        this.mesh.updateNormal();
    } else {
        console.log("error: wrong delete type: ", this.elemType);
    }

    return this.mesh;
};
