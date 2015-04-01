REAL3D.InspectorEdit.InspectorView = {
    mouseState: REAL3D.InspectorEdit.MouseState.NONE,
    isMouseDown: false,
    canvasOffset: null,
    viewMode: null,
    mouseMovePos: new THREE.Vector2(0, 0),
    camera: null
};

REAL3D.InspectorEdit.InspectorView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.mouseState = REAL3D.InspectorEdit.MouseState.NONE;
        this.isMouseDown = false;
        this.canvasOffset = canvasOffset;
        this.mouseMovePos = new THREE.Vector2(0, 0);
    }
    this.isMouseDown = false;
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.viewMode = REAL3D.InspectorEdit.ViewMode.ROTATE;
    REAL3D.RenderManager.switchCamera(this.camera);
};

//REAL3D.InspectorEdit.InspectorView.update = function(timestamp) {
//    "use strict";
//};

REAL3D.InspectorEdit.InspectorView.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = true;
    this.mouseMovePos.set(curPosX, curPosY);
    //console.log("mouse down");
};

REAL3D.InspectorEdit.InspectorView.mouseUp = function (e) {
    "use strict";
    this.isMouseDown = false;
}

REAL3D.InspectorEdit.InspectorView.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.viewMode === REAL3D.InspectorEdit.ViewMode.TRANSLATE) {
            this.translateCamera(curPosX, curPosY);
        } else if (this.viewMode === REAL3D.InspectorEdit.ViewMode.ROTATE) {
            this.rotateScene(curPosX, curPosY);
        } else if (this.viewMode === REAL3D.InspectorEdit.ViewMode.SCALE) {
            this.zoomCamera(curPosX, curPosY);
        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.InspectorEdit.InspectorView.keyPress = function (e) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.draggingCanvas = function (e) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.translateCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateX(worldDifX);
    this.camera.translateY(worldDifY);
};

REAL3D.InspectorEdit.InspectorView.rotateScene = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    REAL3D.RenderManager.scene.rotateXGlobal(worldDifY * 0.003);
    REAL3D.RenderManager.scene.rotateYGlobal(worldDifX * -0.003);
};

REAL3D.InspectorEdit.InspectorView.zoomCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifY;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateZ(worldDifY * 5);
};