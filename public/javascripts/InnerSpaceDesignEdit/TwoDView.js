/*jslint plusplus: true */
/*global REAL3D, THREE, console */

REAL3D.InnerSpaceDesignEdit.TwoDView = {
    mouseState: REAL3D.InnerSpaceDesignEdit.MouseState.NONE,
    isMouseDown: false,
    canvasOffset: null,
    mouseMovePos: new THREE.Vector2(0, 0),
    camera: null
};

REAL3D.InnerSpaceDesignEdit.TwoDView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        this.isMouseDown = false;
        this.canvasOffset = canvasOffset;
        this.mouseMovePos = new THREE.Vector2(0, 0);
    }
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.TwoDView.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.TwoDView.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
};

REAL3D.InnerSpaceDesignEdit.TwoDView.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        this.draggingCanvas(curPosX, curPosY);
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.InnerSpaceDesignEdit.TwoDView.mouseUp = function (e) {
    "use strict";
    this.isMouseDown = false;
};

REAL3D.InnerSpaceDesignEdit.TwoDView.keyPress = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.TwoDView.draggingCanvas = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.position.x += worldDifX;
    this.camera.position.y += worldDifY;
};
