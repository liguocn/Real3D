/*jslint plusplus: true */
/*global REAL3D, console */

REAL3D.CurveModel = {
};

REAL3D.CurveModel.CurveVertex = function (userPoint, curveTree, drawParent) {
    "use strict";
    this.userPoint = userPoint;
    this.curveTree = curveTree;
    this.drawParent = drawParent;
    this.edges = [];
    this.drawObject = null;
    this.userPoint.subscribe("updateDraw", this, this.updateDraw);
    this.userPoint.subscribe("remove", this, this.remove);
    this.curveTree.subscribe("updateDraw", this, this.updateDraw);
    this.curveTree.subscribe("remove", this, this.remove);
    this.curveTree.subscribe("hideDraw", this, this.hideDraw);
    this.updateDraw();
};

REAL3D.CurveModel.CurveVertex.prototype.remove = function () {
    "use strict";
};

REAL3D.CurveModel.CurveVertex.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.CurveModel.CurveVertex.prototype.hideDraw = function () {
    "use strict";
};

REAL3D.CurveModel.CurveVertex.prototype.addEdge = function () {
    "use strict";
};

REAL3D.CurveModel.CurveEdge = function (curveVert0, curveVert1, curveTree, drawParent) {
    "use strict";
    this.vertices = [curveVert0, curveVert1];
    this.curveTree = curveTree;
    this.drawParent = drawParent;
    this.drawObject = null;
    curveVert0.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveVert0.userPoint.subscribe("remove", this, this.remove);
    curveVert1.userPoint.subscribe("updateDraw", this, this.updateDraw);
    curveVert1.userPoint.subscribe("remove", this, this.remove);
    this.curveTree.subscribe("hideDraw", this, this.hideDraw);
    this.curveTree.subscribe("updateDraw", this, this.updateDraw);
    this.curveTree.subscribe("remove", this, this.remove);
    this.updateDraw();
};

REAL3D.CurveModel.CurveEdge.prototype.remove = function () {
    "use strict";
};

REAL3D.CurveModel.CurveEdge.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.CurveModel.CurveEdge.prototype.hideDraw = function () {
    "use strict";
};

REAL3D.CurveModel.CurveTree = function () {
    "use strict";
    REAL3D.Publisher.call(this);
    this.vertices = [];
    this.smoothValues = [];
    this.edges = [];
};

REAL3D.CurveModel.CurveTree.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.CurveModel.CurveTree.prototype.addVertex = function (userPoint, smoothValue, drawParent) {
    "use strict";
    var vertex = new REAL3D.CurveModel.CurveVertex(userPoint, this, drawParent);
    this.vertices.push(vertex);
    this.smoothValues.push(smoothValue);
};

REAL3D.CurveModel.CurveTree.prototype.addEdge = function (index1, index2, drawParent) {
    "use strict";
    var edge = new REAL3D.CurveModel.CurveEdge(this.vertices[index1], this.vertices[index2], this, drawParent);
    this.edges.push(edge);
};

//Curve Tools
REAL3D.CurveModel.constructCurveTree = function (userPointTree, smoothValues, vertDrawParent, edgeDrawParent) {
    "use strict";
};

REAL3D.CurveModel.subdivideCurveTree = function (curveTree, subdTime, vertDrawParent, edgeDrawParent) {
    "use strict";
};
