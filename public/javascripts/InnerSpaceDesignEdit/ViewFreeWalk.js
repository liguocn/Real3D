/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.InnerSpaceDesignEdit.FreeWalkView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    isMouseDown: null,
    mouseMovePos: null,
    moveSpeed: null,
    turnSpeed: null,
    camera: null,
    hMoveState: null,
    vMoveState: null,
    timeStamp: null
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
        this.moveSpeed = 0.2;
        this.turnSpeed = 0.003;
    }
    this.hMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.NONE;
    this.vMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.NONE;
    this.timeStamp = 0;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.update = function (timestamp) {
    "use strict";
    var deltaTime = timestamp - this.timeStamp;
    if (this.hMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.LEFT) {
        this.camera.translateX(-1 * this.moveSpeed * deltaTime);
    } else if (this.hMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.RIGHT) {
        this.camera.translateX(this.moveSpeed * deltaTime);
    }
    if (this.vMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.FORWARD) {
        this.camera.translateZ(-1 * this.moveSpeed * deltaTime);
    } else if (this.vMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.BACK) {
        this.camera.translateZ(this.moveSpeed * deltaTime);
    }
    this.timeStamp = timestamp;
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


REAL3D.InnerSpaceDesignEdit.FreeWalkView.keyDown = function (e) {
    "use strict";
    if (e.which === 87) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.FORWARD;
    } else if (e.which === 83) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.BACK;
    } else if (e.which === 65) {
        this.hMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.LEFT;
    } else if (e.which === 68) {
        this.hMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.RIGHT;
    }
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.keyUp = function (e) {
    "use strict";
    if (e.which === 87 && this.vMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.FORWARD) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.NONE;
    } else if (e.which === 83 && this.vMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.BACK) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.NONE;
    } else if (e.which === 65 && this.hMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.LEFT) {
        this.hMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.NONE;
    } else if (e.which === 68 && this.hMoveState === REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.RIGHT) {
        this.hMoveState = REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState.NONE;
    }
};

REAL3D.InnerSpaceDesignEdit.FreeWalkView.MoveState = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    FORWARD: 3,
    BACK: 4
};
