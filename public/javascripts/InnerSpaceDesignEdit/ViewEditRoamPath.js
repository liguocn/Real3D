/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditRoamPathView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    mouseState: null,
    isMouseDown: null,
    mouseDownPos: null,
    mouseMovePos: null,
    hitUserPointIndex: null,
    lastCreatedPointIndex: null
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
    }
    this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.mouseDown = function (e) {
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

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.mouseMove = function (e) {
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

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.mouseUp = function (e) {
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
    } else if (this.mouseState === REAL3D.InnerSpaceDesignEdit.MouseState.INSERTUSERPOINT) {
        this.insertUserPoint(curPosX, curPosY);
    }
    this.isMouseDown = false;
    //console.log("Mouse state: ", this.mouseState);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = REAL3D.InnerSpaceDesignEdit.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.connectUserPoint = function (index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        var userPoint1, userPoint2;
        userPoint1 = REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.points[index1];
        userPoint2 = REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.points[index2];
        if (userPoint1.neighbors.length < 2 && userPoint2.neighbors.length < 2) {
            REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.connectPoints(index1, index2);
            // REAL3D.InnerSpaceDesignEdit.ViewPathData.pathTree.addPathEdge(index1, index2,
            //     REAL3D.InnerSpaceDesignEdit.ViewPathData.drawObject);
            REAL3D.InnerSpaceDesignEdit.ViewPathData.pathTree.addPathEdge(index1, index2, null);
        }
    }
    REAL3D.InnerSpaceDesignEdit.ViewPathData.constructSmoothPathTree();
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.createNewUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newId;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    newId = REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.addPoint(worldPosX, worldPosY);
    REAL3D.InnerSpaceDesignEdit.ViewPathData.pathTree.addPathPoint(REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.points[newId],
        REAL3D.InnerSpaceDesignEdit.ViewPathData.drawObject);
    return newId;
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.finishCreatingNewUserPoint = function () {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.isMouseMoved = function (mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    if (dist > REAL3D.InnerSpaceDesignEdit.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.draggingUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.setPosition(this.hitUserPointIndex, worldPosX, worldPosY);
    REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.points[this.hitUserPointIndex].publish("updateDraw");
    REAL3D.InnerSpaceDesignEdit.ViewPathData.constructSmoothPathTree();
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.draggingCanvas = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.position.x += worldDifX;
    this.camera.position.y += worldDifY;
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.removeUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var hitIndex;
    hitIndex = this.hitDetection(mousePosX, mousePosY);
    if (hitIndex !== -1) {
        REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.points[hitIndex].publish("remove");
        REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.deletePoint(hitIndex);
        REAL3D.InnerSpaceDesignEdit.ViewPathData.constructSmoothPathTree();
    }
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.insertUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.camera.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    REAL3D.InnerSpaceDesignEdit.ViewPathData.releaseDraw();
    REAL3D.InnerSpaceDesignEdit.ViewPathData.userPointTree.insertPointOnEdge(worldPosX, worldPosY);
    REAL3D.InnerSpaceDesignEdit.ViewPathData.draw();
    REAL3D.InnerSpaceDesignEdit.ViewPathData.constructSmoothPathTree();
};

REAL3D.InnerSpaceDesignEdit.EditRoamPathView.switchMouseState = function (mouseState) {
    "use strict";
    this.mouseState = mouseState;
};
