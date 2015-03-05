/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.ViewPath = {
};

REAL3D.ViewPath.PathPoint = function (userPoint, pathTree, drawParent) {
    "use strict";
    this.userPoint = userPoint;
    this.edges = [];
    this.pathTree = pathTree;
    this.drawParent = drawParent;
    this.drawObject = null;
};

REAL3D.ViewPath.PathPoint.prototype.remove = function () {
    "use strict";
};

REAL3D.ViewPath.PathPoint.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.ViewPath.PathEdge = function (pathPoint0, pathPoint1, pathTree, drawParent) {
    "use strict";
    this.pathPoints = [pathPoint0, pathPoint1];
    this.edgeLength = REAL3D.Vector2.sub(pathPoint0.userPoint.pos, pathPoint1.userPoint.pos).length();
    this.pathTree = pathTree;
    this.drawParent = drawParent;
    this.drawObject = null;
};

REAL3D.ViewPath.PathEdge.prototype.remove = function () {
    "use strict";
};

REAL3D.ViewPath.PathEdge.prototype.updateDraw = function () {
    "use strict";
};

REAL3D.ViewPath.PathTree = function () {
    "use strict";
    this.pathPoints = [];
    this.pathEdges = [];
};

REAL3D.ViewPath.PathTree.prototype.updateDraw = function () {
    "use strict";
};
