/*jslint plusplus: true */
/*global REAL3D, console */

REAL3D.CommonModel.CurveNode = function (userPoint, curve2d, drawParent) {
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

REAL3D.CommonModel.CurveNode.prototype.remove = function () {
    "use strict";
};

REAL3D.CommonModel.CurveNode.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.CommonModel.CurveNode.prototype.hideDraw = function () {
    "use strict";
};

REAL3D.CommonModel.CurveNode.prototype.addEdge = function () {
    "use strict";
};

REAL3D.CommonModel.CurveEdge = function (curveNode0, curveNode1, curve2d, drawParent) {
    "use strict";
    this.nodes = [curveNode0, curveNode1];
    this.curve2d = curve2d;
    this.drawParent = drawParent;
    this.drawObject = null;
    curveNode0.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveNode0.userPoint.subscribe("remove", this, this.remove);
    curveNode1.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveNode1.userPoint.subscribe("remove", this, this.remove);
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
    this.nodes = [];
    this.edges = [];
};

REAL3D.CommonModel.Curve2D.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.CommonModel.Curve2D.prototype.addNode = function (userPoint, drawParent) {
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
