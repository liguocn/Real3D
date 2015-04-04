/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.Translate = function (elemIndex, mesh, elemType, translateDir, translateValue) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.elemType = elemType;
    this.translateDir = translateDir;
    this.translateValue = translateValue;
};

REAL3D.MeshModel.Translate.prototype.preview = function () {
    "use strict";
};

REAL3D.MeshModel.Translate.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.Translate.prototype.setTranslateValue = function (value) {
    "use strict";
    this.translateValue = value;
};

REAL3D.MeshModel.Translate.prototype.addTranslateValue = function (value) {
    "use strict";
    this.translateValue += value;
};

REAL3D.MeshModel.Rotate = function (elemIndex, mesh, elemType, rotateDir, rotateValue) {
    "use strict";
};

REAL3D.MeshModel.Rotate.prototype.preview = function () {
    "use strict";
};

REAL3D.MeshModel.Rotate.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.Rotate.prototype.setRotateValue = function (value) {
    "use strict";
};

REAL3D.MeshModel.Rotate.prototype.addRotateValue = function (value) {
    "use strict";
};

REAL3D.MeshModel.Scale = function (elemIndex, mesh, elemType, scaleDir, scaleValue) {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.preview = function () {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.setScaleValue = function (value) {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.addScaleValue = function (value) {
    "use strict";
};
