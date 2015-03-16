/*jslint plusplus: true */
/*global REAL3D, console */

REAL3D.CommonModel.CurveVertex = function (userPoint, curve2d, drawParent) {
    "use strict";
    this.userPoint = userPoint;
    this.curve2d = curve2d;
    this.drawParent = drawParent;
    this.edges = [];
    this.drawObject = null;
    this.userPoint.subscribe("updateDraw", this, this.updateDraw);
    this.userPoint.subscribe("remove", this, this.remove);
    this.curve2d.subscribe("updateDraw", this, this.updateDraw);
    this.curve2d.subscribe("remove", this, this.remove);
    this.curve2d.subscribe("hideDraw", this, this.hideDraw);
    this.updateDraw();
};

REAL3D.CommonModel.CurveVertex.prototype.remove = function () {
    "use strict";
};

REAL3D.CommonModel.CurveVertex.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.CommonModel.CurveVertex.prototype.hideDraw = function () {
    "use strict";
};

REAL3D.CommonModel.CurveVertex.prototype.addEdge = function () {
    "use strict";
};

REAL3D.CommonModel.CurveEdge = function (curveVert0, curveVert1, curve2d, drawParent) {
    "use strict";
    this.vertices = [curveVert0, curveVert1];
    this.curve2d = curve2d;
    this.drawParent = drawParent;
    this.drawObject = null;
    curveVert0.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveVert0.userPoint.subscribe("remove", this, this.remove);
    curveVert1.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveVert1.userPoint.subscribe("remove", this, this.remove);
    this.curve2d.subscribe("hideDraw", this, this.hideDraw);
    this.curve2d.subscribe("updateDraw", this, this.updateDraw);
    this.curve2d.subscribe("remove", this, this.remove);
    this.updateDraw();
};

REAL3D.CommonModel.CurveEdge.prototype.remove = function () {
    "use strict";
};

REAL3D.CommonModel.CurveEdge.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.CommonModel.CurveEdge.prototype.hideDraw = function () {
    "use strict";
};

REAL3D.CommonModel.Curve2D = function () {
    "use strict";
    REAL3D.Publisher.call(this);
    this.vertices = [];
    this.edges = [];
};

REAL3D.CommonModel.Curve2D.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.CommonModel.Curve2D.prototype.addVertex = function (userPoint, drawParent) {
    "use strict";
};

REAL3D.CommonModel.Curve2D.prototype.addEdge = function (index1, index2, drawParent) {
    "use strict";
};

REAL3D.CommonModel.Curve2DTools = {
};

REAL3D.CommonModel.Curve2DTools.constructCurve2D = function (userPointTree, smoothValues) {
    "use strict";
};
