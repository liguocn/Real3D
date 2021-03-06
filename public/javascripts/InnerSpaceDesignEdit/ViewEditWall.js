/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditWallView = {
    mouseState: null,
    editMode: null,
    snapUnit: null,
    isMouseDown: null,
    mouseDownPos: null,
    mouseMovePos: null,
    canvasOffset: null,
    hitUserPointIndex: null,
    lastCreatedPointIndex: null,
    winW: null,
    winH: null,
    camera: null
};

REAL3D.InnerSpaceDesignEdit.EditWallView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
        this.snapUnit = 20;
    }
    this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    this.editMode = REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode.CREATE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.mouseDown = function (e) {
    "use strict";
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    //console.log("mousePos: ", this.mouseDownPos.x, this.mouseDownPos.y, curPosX, curPosY);
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) * (curPosY - this.mouseDownPos.y);
    //console.log("mouseDownDist: ", mouseDownDist);
    isHittingTheSamePos = (mouseDownDist < REAL3D.InnerSpaceDesignEdit.HITRADIUS);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    //console.log("hit the same point: ", isHittingTheSamePos, "  hit index: ", this.hitUserPointIndex);
    if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.NONE) {
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.HITCANVAS;
            //console.log("state: NONE -> HITCANVAS");
        } else {
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.HITUSERPOINT;
            //console.log("state: NONE -> HITUSERPOINT");
        }
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
            //console.log("state: CREATINGUSERPOINT -> NONE, hit the same point, finishCreatingNewUserPoint");
        } else {
            if (this.hitUserPointIndex === -1) {
                newUserPointIndex = this.createNewUserPoint(curPosX, curPosY);
                //console.log("createNewUserPoint: ", this.lastCreatedPointIndex, newUserPointIndex);
                this.connectUserPoint(this.lastCreatedPointIndex, newUserPointIndex);
                this.lastCreatedPointIndex = newUserPointIndex;
            } else {
                this.connectUserPoint(this.hitUserPointIndex, this.lastCreatedPointIndex);
                this.lastCreatedPointIndex = this.hitUserPointIndex;
                //console.log("connectUserPoint to exist point: ", this.hitUserPointIndex);
            }
        }
    }
    this.mouseDownPos.set(curPosX, curPosY);
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
};

REAL3D.InnerSpaceDesignEdit.EditWallView.mouseMove = function (e) {
    "use strict";
    var curPosX, curPosY;
    if (this.isMouseDown) {
        //console.log("---------------------------------------------mousemove: ", this.mouseState);
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.HITUSERPOINT) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.DRAGGINGUSERPOINT;
                this.draggingUserPoint(curPosX, curPosY);
                //console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                //console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
        // console.log("Mouse state: ", this.mouseState);
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallView.mouseUp = function (e) {
    "use strict";
    //console.log("---------------------------------------------mouseup: ", this.mouseState, "stateName: ", this.stateName);
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        //console.log("state: DRAGGINGUSERPOINT -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        //console.log("state: DRAGGINGCANVAS -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.HITUSERPOINT) {
        if (this.editMode === REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode.CREATE) {
            this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
            this.lastCreatedPointIndex = this.hitUserPointIndex;
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.CREATINGUSERPOINT;
        } else if (this.editMode === REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode.REMOVE) {
            this.removeUserPoint(this.hitUserPointIndex);
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        } else if (this.editMode === REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode.MERGE) {
            this.mergeUserPoint(this.hitUserPointIndex);
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        }
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.HITCANVAS) {
        if (this.editMode === REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode.CREATE) {
            this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.CREATINGUSERPOINT;
        } else if (this.editMode === REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode.INSERT) {
            this.insertUserPoint(curPosX, curPosY);
            this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        }
    }
    this.isMouseDown = false;
    //console.log("Mouse state: ", this.mouseState);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignEdit.EditWallView.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = REAL3D.InnerSpaceDesignEdit.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    //console.log("hitDetection: ", REAL3D.InnerSpaceDesignEdit.winH, mousePosY, cameraPos, worldPosX, worldPosY);
    return REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.connectUserPoint = function (index1, index2) {
    "use strict";
    // console.log("index: ", index1, index2);
    // console.log("userPointTree: ", REAL3D.InnerSpaceDesignEdit.WallData.userPointTree);
    // console.log("globalPublisher: ", REAL3D.InnerSpaceDesignEdit.WallData.globalPublisher);
    if (index1 !== -1 && index2 !== -1) {
        REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.connectPoints(index1, index2);
        var wall3d, point1, point2;
        point1 = REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.points[index1];
        point2 = REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.points[index2];
        point1.publish("updateSubscriber");
        point2.publish("updateSubscriber");
        point1.publish("updateDraw");
        point2.publish("updateDraw");
        wall3d = new REAL3D.WallModel.Wall3D(point1, point2,
            REAL3D.InnerSpaceDesignEdit.WallData.wallThick,
            REAL3D.InnerSpaceDesignEdit.WallData.wallHeight,
            REAL3D.InnerSpaceDesignEdit.WallData.drawObject,
            REAL3D.InnerSpaceDesignEdit.WallData.globalPublisher);
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallView.createNewUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    //console.log("userPointTree: ", REAL3D.InnerSpaceDesignEdit.WallData.userPointTree);
    var cameraPos, worldPosX, worldPosY, newId, stump;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosX = Math.round(worldPosX / this.snapUnit) * this.snapUnit;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    worldPosY = Math.round(worldPosY / this.snapUnit) * this.snapUnit;
    newId = REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.addPoint(worldPosX, worldPosY);
    stump = new REAL3D.WallModel.Stump(REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.points[newId],
        REAL3D.InnerSpaceDesignEdit.WallData.wallThick * 2,
        REAL3D.InnerSpaceDesignEdit.WallData.drawObject,
        REAL3D.InnerSpaceDesignEdit.WallData.globalPublisher);
    //console.log("scene: ", REAL3D.RenderManager.scene);
    return newId;
};

REAL3D.InnerSpaceDesignEdit.EditWallView.finishCreatingNewUserPoint = function () {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignEdit.EditWallView.isMouseMoved = function (mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    //console.log("isMouseMoved: dist = ", dist, mousePosX, mousePosY, this.mouseDownPos.x, this.mouseDownPos.y);
    if (dist > REAL3D.InnerSpaceDesignEdit.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.InnerSpaceDesignEdit.EditWallView.draggingUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosX = Math.round(worldPosX / this.snapUnit) * this.snapUnit;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    worldPosY = Math.round(worldPosY / this.snapUnit) * this.snapUnit;
    REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.setPosition(this.hitUserPointIndex, worldPosX, worldPosY);
    REAL3D.InnerSpaceDesignEdit.WallData.userPointTree.points[this.hitUserPointIndex].publish("updateDraw");
};

REAL3D.InnerSpaceDesignEdit.EditWallView.draggingCanvas = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.position.x += worldDifX;
    this.camera.position.y += worldDifY;
};

REAL3D.InnerSpaceDesignEdit.EditWallView.removeUserPoint = function (userPointIndex) {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.WallData.removeUserPoint(userPointIndex);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.insertUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    //worldPosX = Math.round(worldPosX / this.snapUnit) * this.snapUnit;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    //worldPosY = Math.round(worldPosY / this.snapUnit) * this.snapUnit;
    REAL3D.InnerSpaceDesignEdit.WallData.insertUserPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.mergeUserPoint = function (userPointIndex) {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.WallData.mergeUserPoint(userPointIndex);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.switchEditMode = function (editMode) {
    "use strict";
    this.editMode = editMode;
    this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    this.finishCreatingNewUserPoint();
};

REAL3D.InnerSpaceDesignEdit.EditWallView.EditMode = {
    CREATE: 0,
    INSERT: 1,
    REMOVE: 2,
    MERGE: 3
};
