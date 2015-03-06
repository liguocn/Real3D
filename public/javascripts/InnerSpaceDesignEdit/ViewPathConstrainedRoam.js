/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    moveSpeed: null,
    turnSpeed: null,
    timeStamp: null
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 2000);
        this.camera.position.set(0, 0, 100);
        this.camera.rotateX(1.570796326794897);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
        this.moveSpeed = 0.2;
        this.turnSpeed = 0.003;
    }
    this.timeStamp = 0;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.mouseDown = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.mouseMove = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.mouseUp = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.keyDown = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.keyUp = function (e) {
    "use strict";
};

