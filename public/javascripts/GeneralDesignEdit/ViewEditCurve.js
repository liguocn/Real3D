/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.GeneralDesignEdit.EditCurveView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    mouseState: null,
    editMode: null,
    isMouseDown: null,
    mouseDownPos: null,
    mouseMovePos: null,
    hitUserPointIndex: null,
    lastCreatedPointIndex: null
};

REAL3D.GeneralDesignEdit.EditCurveView.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("EditCurveView init");
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
    }
    this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
    this.editMode = REAL3D.GeneralDesignEdit.EditCurveView.EditMode.CREAT;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.GeneralDesignEdit.EditCurveView.mouseDown = function (e) {
    "use strict";
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) * (curPosY - this.mouseDownPos.y);
    isHittingTheSamePos = (mouseDownDist < REAL3D.GeneralDesignEdit.HITRADIUS);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.NONE) {
        if (this.editMode === REAL3D.GeneralDesignEdit.EditCurveView.EditMode.EDIT) {
            this.editUserPoint(this.hitUserPointIndex);
        }
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.HITCANVAS;
        } else {
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.HITUSERPOINT;
        }
    } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
        } else {
            if (this.hitUserPointIndex === -1) {
                newUserPointIndex = this.createNewUserPoint(curPosX, curPosY);
                this.connectUserPoint(this.lastCreatedPointIndex, newUserPointIndex);
                this.lastCreatedPointIndex = newUserPointIndex;
            } else {
                this.connectUserPoint(this.hitUserPointIndex, this.lastCreatedPointIndex);
                this.lastCreatedPointIndex = this.hitUserPointIndex;
            }
        }
    }
    this.mouseDownPos.set(curPosX, curPosY);
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
};

REAL3D.GeneralDesignEdit.EditCurveView.mouseMove = function (e) {
    "use strict";
    var curPosX, curPosY;
    if (this.isMouseDown) {
        //console.log("---------------------------------------------mousemove: ", this.mouseState);
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.HITUSERPOINT) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.GeneralDesignEdit.MouseState.DRAGGINGUSERPOINT;
                this.draggingUserPoint(curPosX, curPosY);
                //console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.GeneralDesignEdit.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                //console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
        // console.log("Mouse state: ", this.mouseState);
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
};

REAL3D.GeneralDesignEdit.EditCurveView.mouseUp = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
    } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
    } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.HITUSERPOINT) {
        if (this.editMode === REAL3D.GeneralDesignEdit.EditCurveView.EditMode.CREAT) {
            this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
            this.lastCreatedPointIndex = this.hitUserPointIndex;
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.CREATINGUSERPOINT;
        } else if (this.editMode === REAL3D.GeneralDesignEdit.EditCurveView.EditMode.REMOVE) {
            this.removeUserPoint(this.hitUserPointIndex);
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
        } else {
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
        }
    } else if (this.mouseState === REAL3D.GeneralDesignEdit.MouseState.HITCANVAS) {
        if (this.editMode === REAL3D.GeneralDesignEdit.EditCurveView.EditMode.CREAT) {
            this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.CREATINGUSERPOINT;
        } else if (this.editMode === REAL3D.GeneralDesignEdit.EditCurveView.EditMode.INSERT) {
            this.insertUserPoint(curPosX, curPosY);
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
        } else {
            this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
        }
    }
    this.isMouseDown = false;
};

REAL3D.GeneralDesignEdit.EditCurveView.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = REAL3D.GeneralDesignEdit.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return REAL3D.GeneralDesignEdit.CurveData.selectUserPoint(worldPosX, worldPosY);
};

REAL3D.GeneralDesignEdit.EditCurveView.connectUserPoint = function (index1, index2) {
    "use strict";
    if (REAL3D.GeneralDesignEdit.CurveData.connectUserPoint(index1, index2)) {
        REAL3D.GeneralDesignEdit.CurveData.draw();
    }
};

REAL3D.GeneralDesignEdit.EditCurveView.createNewUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newId;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    newId = REAL3D.GeneralDesignEdit.CurveData.createUserPoint(worldPosX, worldPosY, REAL3D.GeneralDesignEdit.EditCurveState.currentSmoothValue);
    return newId;
};

REAL3D.GeneralDesignEdit.EditCurveView.finishCreatingNewUserPoint = function () {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.GeneralDesignEdit.EditCurveView.isMouseMoved = function (mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    if (dist > REAL3D.GeneralDesignEdit.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.GeneralDesignEdit.EditCurveView.draggingUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    if (REAL3D.GeneralDesignEdit.CurveData.dragUserPoint(this.hitUserPointIndex, worldPosX, worldPosY)) {
        REAL3D.GeneralDesignEdit.CurveData.draw();
    }
};

REAL3D.GeneralDesignEdit.EditCurveView.draggingCanvas = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.position.x += worldDifX;
    this.camera.position.y += worldDifY;
};

REAL3D.GeneralDesignEdit.EditCurveView.removeUserPoint = function (userPointIndex) {
    "use strict";
    if (REAL3D.GeneralDesignEdit.CurveData.removeUserPoint(userPointIndex)) {
        REAL3D.GeneralDesignEdit.CurveData.draw();
    }
};

REAL3D.GeneralDesignEdit.EditCurveView.insertUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    if (REAL3D.GeneralDesignEdit.CurveData.insertUserPoint(worldPosX, worldPosY, REAL3D.GeneralDesignEdit.EditCurveState.currentSmoothValue)) {
        REAL3D.GeneralDesignEdit.CurveData.draw();
    }
};

REAL3D.GeneralDesignEdit.EditCurveView.editUserPoint = function (hitUserPointIndex) {
    "use strict";
    REAL3D.GeneralDesignEdit.CurveData.editUserPointId = hitUserPointIndex;
    REAL3D.GeneralDesignEdit.CurveData.draw();
    if (hitUserPointIndex === -1) {
        REAL3D.GeneralDesignEdit.EditCurveUI.setSmoothValue(REAL3D.GeneralDesignEdit.EditCurveState.currentSmoothValue);
    } else {
        REAL3D.GeneralDesignEdit.EditCurveUI.setSmoothValue(REAL3D.GeneralDesignEdit.CurveData.smoothValues[hitUserPointIndex]);
    }
};

REAL3D.GeneralDesignEdit.EditCurveView.switchEditMode = function (editMode) {
    "use strict";
    this.editMode = editMode;
    this.mouseState = REAL3D.GeneralDesignEdit.MouseState.NONE;
    this.finishCreatingNewUserPoint();
};

REAL3D.GeneralDesignEdit.EditCurveView.switchMouseMode = function (mouseState) {
    "use strict";
    this.mouseState = mouseState;
};

REAL3D.GeneralDesignEdit.EditCurveView.EditMode = {
    CREAT: 0,
    EDIT: 1,
    REMOVE: 2,
    INSERT: 3
};
