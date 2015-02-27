/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.InnerSpaceDesignEdit.FreeWalkView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    isMouseDown: false,
    mouseMovePos: new REAL3D.Vector2(0, 0),
    moveSpeed: 5,
    turnSpeed: 0.002,
    camera: null
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("FreeWalkView init");
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 2000);
        this.camera.position.set(0, 0, 100);
        this.camera.rotateX(1.570796326794897);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
        this.isMouseDown = false;
        this.mouseMovePos = new REAL3D.Vector2(0, 0);
        this.moveSpeed = 5;
        this.turnSpeed = 0.002;
    }
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.mouseDown = function (e) {
    "use strict";
    //console.log("FreeWalkView mouseDown");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.mouseMove = function (e) {
    "use strict";
    //console.log("FreeWalkView mouseMove");
    var curPosX, curPosY, angle;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.isMouseDown) {
        angle = this.mouseMovePos.x - curPosX;
        this.camera.rotateY(this.turnSpeed * angle);
    }
    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.mouseUp = function (e) {
    "use strict";
    //console.log("FreeWalkView mouseUp");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = false;
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.keyPress = function (e) {
    "use strict";
    console.log("FreeWalkView keypress: ", e.which);
    if (e.which === 119) {
        this.camera.translateZ(-1 * this.moveSpeed);
    } else if (e.which === 115) {
        this.camera.translateZ(this.moveSpeed);
    }
    if (e.which === 97) {
        this.camera.translateX(-1 * this.moveSpeed);
    } else if (e.which === 100) {
        this.camera.translateX(this.moveSpeed);
    }
};