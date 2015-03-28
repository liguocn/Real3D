/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.Extrude = function (index, mesh, elemType, distance) {
    "use strict";
    this.index = index;
    this.mesh = mesh;
    this.elemType = elemType;
    this.distance = distance;
};

REAL3D.MeshModel.Extrude.prototype.preview = function () {
    "use strict";
};

REAL3D.MeshModel.Extrude.prototype.apply = function () {
    "use strict";
};
