/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.PickTool = {
};

REAL3D.PickTool.PickHMesh = function () {
    "use strict";
    this.mesh = null;
    this.pickedVertex = null;
    this.pickedEdge = null;
    this.pickedFace = null;
};

REAL3D.PickTool.PickHMesh.prototype.setMesh = function (mesh) {
    "use strict";
    this.mesh = mesh;
    this.pickedVertex = [];
    this.pickedEdge = [];
    this.pickedFace = [];
};

REAL3D.PickTool.PickHMesh.prototype.pickVertex = function (mousePosX, mousePosY) {
    "use strict";
    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedVertex = function () {
    "use strict";
    return this.pickedVertex;
};

REAL3D.PickTool.PickHMesh.prototype.pickEdge = function (mousePosX, mousePosY) {
    "use strict";
    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedEdge = function () {
    "use strict";
};

REAL3D.PickTool.PickHMesh.prototype.pickFace = function (mousePosX, mousePosY) {
    "use strict";
    return false;
};

REAL3D.PickTool.PickHMesh.prototype.getPickedFace = function () {
    "use strict";
};
