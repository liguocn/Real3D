/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.SubdivideFace = function (elemIndex, mesh, weight) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.weight = weight;
    this.previewMesh = null;
    this.previewElemIndex = null;
};

REAL3D.MeshModel.SubdivideFace.prototype.preview = function (pickTool) {
    "use strict";
};

REAL3D.MeshModel.SubdivideFace.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.SubdivideFace.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};

REAL3D.MeshModel.SplitFaceBySharpEdge = function (elemIndex, mesh, weight) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.weight = weight;
    this.previewMesh = null;
    this.previewElemIndex = null;
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.preview = function (pickTool) {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpEdge.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};

REAL3D.MeshModel.SplitFaceBySharpVertex = function (elemIndex, mesh, weight) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.weight = weight;
    this.previewMesh = null;
    this.previewElemIndex = null;
};

REAL3D.MeshModel.SplitFaceBySharpVertex.prototype.preview = function (pickTool) {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpVertex.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.SplitFaceBySharpVertex.prototype.setWeight = function (weight) {
    "use strict";
    this.weight = weight;
};
