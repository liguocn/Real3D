/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditWallView = {
    mouseState: REAL3D.InnerSpaceDesignEdit.MouseState.NONE,
    snapUnit: 20,
    isMouseDown: false,
    mouseDownPos: new THREE.Vector2(0, 0),
    mouseMovePos: new THREE.Vector2(0, 0),
    canvasOffset: null,
    hitUserPointIndex: -1,
    lastCreatedPointIndex: -1
};

REAL3D.InnerSpaceDesignEdit.EditWallView.init = function (canvasOffset) {
    "use strict";
    this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    this.snapUnit = 20;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.canvasOffset = canvasOffset;
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignEdit.EditWallView.update = function (timestamp) {
    "use strict";
    //console.log("update: timestamp = ", timestamp);
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
        this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
        this.lastCreatedPointIndex = this.hitUserPointIndex;
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.CREATINGUSERPOINT;
        //console.log("state: HITUSERPOINT -> CREATINGUSERPOINT, connectUserPoint to exist point");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.HITCANVAS) {
        //console.log("state: HITCANVAS -> CREATINGUSERPOINT, createNewUserPoint");
        this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.CREATINGUSERPOINT;
        //console.log("createNewUserPoint: ", this.lastCreatedPointIndex);
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.REMOVEUSERPOINT) {
        this.removeUserPoint(curPosX, curPosY);
    }
    this.isMouseDown = false;
    //console.log("Mouse state: ", this.mouseState);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignEdit.EditWallView.keyPress = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditWallView.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = REAL3D.InnerSpaceDesignEdit.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesignEdit.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesignEdit.winH / 2 + cameraPos.y;
    return REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.connectUserPoint = function (index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.connectPoints(index1, index2);
        var wall2d, wall3d, point1, point2;
        point1 = REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.points[index1];
        point2 = REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.points[index2];
        wall2d = new REAL3D.Wall.Wall2D(point1, point2, REAL3D.InnerSpaceDesignEdit.SceneData.wallThick);
        wall3d = new REAL3D.Wall.Wall3D(wall2d, REAL3D.InnerSpaceDesignEdit.SceneData.wallHeight, REAL3D.InnerSpaceDesignEdit.SceneData.refFrame);
        REAL3D.InnerSpaceDesignEdit.SceneData.wall2ds.push(wall2d);
        REAL3D.InnerSpaceDesignEdit.SceneData.wall3ds.push(wall3d);
        point1.publish("updateSubscriber");
        point2.publish("updateSubscriber");
        point1.publish("updateMesh");
        point2.publish("updateMesh");
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallView.createNewUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newId, userPointBox;
    mousePosY = REAL3D.InnerSpaceDesignEdit.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesignEdit.winW / 2 + cameraPos.x;
    worldPosX = Math.round(worldPosX / this.snapUnit) * this.snapUnit;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesignEdit.winH / 2 + cameraPos.y;
    worldPosY = Math.round(worldPosY / this.snapUnit) * this.snapUnit;
    newId = REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.addPoint(worldPosX, worldPosY);
    userPointBox = new REAL3D.Wall.UserPointBox(REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.points[newId],
        REAL3D.InnerSpaceDesignEdit.SceneData.wallThick * 2, REAL3D.InnerSpaceDesignEdit.SceneData.refFrame);
    REAL3D.InnerSpaceDesignEdit.SceneData.wallBoxes.push(userPointBox);
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
    mousePosY = REAL3D.InnerSpaceDesignEdit.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesignEdit.winW / 2 + cameraPos.x;
    worldPosX = Math.round(worldPosX / this.snapUnit) * this.snapUnit;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesignEdit.winH / 2 + cameraPos.y;
    worldPosY = Math.round(worldPosY / this.snapUnit) * this.snapUnit;
    REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.setPosition(this.hitUserPointIndex, worldPosX, worldPosY);
    REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.points[this.hitUserPointIndex].publish("updateMesh");
};

REAL3D.InnerSpaceDesignEdit.EditWallView.draggingCanvas = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition.x += worldDifX;
    REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition.y += worldDifY;
    REAL3D.InnerSpaceDesignEdit.cameraOrtho.position.copy(REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition);
};

REAL3D.InnerSpaceDesignEdit.EditWallView.removeUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var hitIndex;
    hitIndex = this.hitDetection(mousePosX, mousePosY);
    if (hitIndex !== -1) {
        REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.points[hitIndex].publish("remove");
        REAL3D.InnerSpaceDesignEdit.SceneData.userPointTree.deletePoint(hitIndex);
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallView.switchRemoveState = function (isRemove) {
    "use strict";
    if (isRemove) {
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.REMOVEUSERPOINT;
        this.finishCreatingNewUserPoint();
    } else {
        REAL3D.InnerSpaceDesignEdit.EditWallView.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    }
};
