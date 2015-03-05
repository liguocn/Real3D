/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.ViewPath = {
};

REAL3D.ViewPath.PathPoint = function (userPoint) {
    "use strict";
    this.userPoint = userPoint;
    this.edges = [];
};

REAL3D.ViewPath.PathPoint.prototype = Object.create(REAL3D.Publisher.prototype);

REAL3D.ViewPath.PathEdge = function (pathPoint0, pathPoint1) {
    "use strict";
    this.pathPoints = [pathPoint0, pathPoint1];
    this.edgeLength = REAL3D.Vector2.sub(pathPoint0.userPoint.pos, pathPoint1.userPoint.pos).length();
};
