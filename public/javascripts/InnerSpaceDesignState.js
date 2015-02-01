/*jslint plusplus: true */
/*global REAL3D, THREE, console, document, $ */

REAL3D.InnerSpaceDesignState = function(winW, winH, canvasElement) {
    "use strict";
    REAL3D.StateBase.call(this);
    this.stateName = REAL3D.InnerSpaceDesignState.STATENAME;
    this.winW = winW;
    this.winH = winH;
    this.cameraOrtho = null;
    this.cameraOrthoName = "CameraOrtho";
    this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.canvasOffset = $(canvasElement).offset();
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;

    this.designId = null;
    this.sceneData = new REAL3D.InnerSpaceDesignState.SceneData();

    var that = this;
    canvasElement.addEventListener("mousedown", function(e) { that.mouseDown(e); }, false);
    canvasElement.addEventListener("mouseup", function(e) { that.mouseUp(e); }, false);
    canvasElement.addEventListener("mousemove", function(e) { that.mouseMove(e); }, false);
    // canvasElement.addEventListener("keypress", function(e) { that.keyPress(e); }, false);
    canvasElement.setAttribute("tabindex", 1);
    canvasElement.focus();
    canvasElement.style.outline = "none";
};

REAL3D.InnerSpaceDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.InnerSpaceDesignState.prototype.initUserData = function() {
    "use strict";
    this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;

    this.designId = null;
    this.sceneData.reInit();
    this.cameraOrtho.position.copy(this.sceneData.cameraOrthoPosition);
};

REAL3D.InnerSpaceDesignState.prototype.saveUserData = function() {
    "use strict";
    var camPos, postData, points, pointLen, pid, userPoints;
    camPos = this.sceneData.cameraOrthoPosition;
    userPoints = [];
    points = this.sceneData.userPointTree.points;
    pointLen = points.length;
    for (pid = 0; pid < pointLen; pid++) {
        userPoints.push({
            posX: points[pid].posX,
            posY: points[pid].posY,
            neighbors: points[pid].neighbors
        });
    }
    postData = {
        designId: this.designId,
        sceneData: {
            cameraOrthoPosition: [camPos.x, camPos.y, camPos.z],
            userPointTree: {
                points: userPoints
            }
        }
    };
    $.post("/innerspacedesign/save", postData, function(data) {
        console.log("data return from server");
        console.log("data saved: ", data.saved);
        if (data.saved) {
            this.designId = data.designId;
        }
    });
};

REAL3D.InnerSpaceDesignState.prototype.enter = function() {
    "use strict";
    console.log("Enter InnerSpaceDesignState");
    if (REAL3D.RenderManager.getCamera(this.cameraOrthoName) === undefined) {
        console.log("Win size: ", this.winW, this.winH);
        var cameraOrthographic = new THREE.OrthographicCamera(this.winW / (-2), this.winW / 2, this.winH / 2, this.winH / (-2), 1, 2000);
        cameraOrthographic.position.copy(this.sceneData.cameraOrthoPosition);
        REAL3D.RenderManager.addCamera(this.cameraOrthoName, cameraOrthographic);
    }
    this.cameraOrtho = REAL3D.RenderManager.getCamera(this.cameraOrthoName);
    REAL3D.RenderManager.switchCamera(this.cameraOrthoName);
};

REAL3D.InnerSpaceDesignState.prototype.update = function() {
    "use strict";
    REAL3D.RenderManager.update();
};

REAL3D.InnerSpaceDesignState.prototype.exit = function() {
    "use strict";
    console.log("Exit InnerSpaceDesignState");
};

REAL3D.InnerSpaceDesignState.prototype.mouseDown = function(e) {
    "use strict";
    console.log("---------------------------------------------mousedown: ", this.mouseState, "stateName: ", this.stateName);
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    console.log("mousePos: ", this.mouseDownPos.x, this.mouseDownPos.y, curPosX, curPosY);
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) * (curPosY - this.mouseDownPos.y);
    console.log("mouseDownDist: ", mouseDownDist);
    isHittingTheSamePos = (mouseDownDist < REAL3D.InnerSpaceDesignState.HITRADIUS);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    console.log("hit the same point: ", isHittingTheSamePos, "  hit index: ", this.hitUserPointIndex);
    if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.NONE) {
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS;
            console.log("state: NONE -> HITCANVAS");
        } else {
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT;
            console.log("state: NONE -> HITUSERPOINT");
        }
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
            console.log("state: CREATINGUSERPOINT -> NONE, hit the same point, finishCreatingNewUserPoint");
        } else {
            if (this.hitUserPointIndex === -1) {
                newUserPointIndex = this.createNewUserPoint(curPosX, curPosY);
                console.log("createNewUserPoint: ", this.lastCreatedPointIndex, newUserPointIndex);
                this.connectUserPoint(this.lastCreatedPointIndex, newUserPointIndex);
                this.lastCreatedPointIndex = newUserPointIndex;
            } else {
                this.connectUserPoint(this.hitUserPointIndex, this.lastCreatedPointIndex);
                this.lastCreatedPointIndex = this.hitUserPointIndex;
                console.log("connectUserPoint to exist point: ", this.hitUserPointIndex);
            }
        }
    }
    this.mouseDownPos.set(curPosX, curPosY);
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
    console.log("Mouse state: ", this.mouseState);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignState.prototype.mouseMove = function(e) {
    "use strict";
    var curPosX, curPosY;
    if (this.isMouseDown) {
        //console.log("---------------------------------------------mousemove: ", this.mouseState);
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT;
                this.draggingUserPoint(curPosX, curPosY);
                console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
        // console.log("Mouse state: ", this.mouseState);
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
};

REAL3D.InnerSpaceDesignState.prototype.mouseUp = function(e) {
    "use strict";
    console.log("---------------------------------------------mouseup: ", this.mouseState, "stateName: ", this.stateName);
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
        console.log("state: DRAGGINGUSERPOINT -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
        console.log("state: DRAGGINGCANVAS -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT) {
        this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
        this.lastCreatedPointIndex = this.hitUserPointIndex;
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT;
        console.log("state: HITUSERPOINT -> CREATINGUSERPOINT, connectUserPoint to exist point");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS) {
        console.log("state: HITCANVAS -> CREATINGUSERPOINT, createNewUserPoint");
        this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT;
        console.log("createNewUserPoint: ", this.lastCreatedPointIndex);
    }
    this.isMouseDown = false;
    console.log("Mouse state: ", this.mouseState);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignState.prototype.hitDetection = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.sceneData.cameraOrthoPosition;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return this.sceneData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignState.prototype.connectUserPoint = function(index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        this.sceneData.userPointTree.connectPoints(index1, index2);
        var userPointLine = new REAL3D.Wall.UserPointLine(this.sceneData.userPointTree.points[index1],
            this.sceneData.userPointTree.points[index2], this.sceneData.refFrame);
    }
};

REAL3D.InnerSpaceDesignState.prototype.createNewUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newId, userPointBall;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    newId = this.sceneData.userPointTree.addPoint(worldPosX, worldPosY);
    userPointBall = new REAL3D.Wall.UserPointBall(this.sceneData.userPointTree.points[newId],
        this.sceneData.refFrame);
    return newId;
};

REAL3D.InnerSpaceDesignState.prototype.finishCreatingNewUserPoint = function() {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignState.prototype.isMouseMoved = function(mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    console.log("isMouseMoved: dist = ", dist, mousePosX, mousePosY, this.mouseDownPos.x, this.mouseDownPos.y);
    if (dist > REAL3D.InnerSpaceDesignState.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.InnerSpaceDesignState.prototype.draggingUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    this.sceneData.userPointTree.setPosition(this.hitUserPointIndex, worldPosX, worldPosY);
    this.sceneData.userPointTree.points[this.hitUserPointIndex].publish("move");
};

REAL3D.InnerSpaceDesignState.prototype.draggingCanvas = function(mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.sceneData.cameraOrthoPosition.x += worldDifX;
    this.sceneData.cameraOrthoPosition.y += worldDifY;
    this.cameraOrtho.position.copy(this.sceneData.cameraOrthoPosition);
};

REAL3D.InnerSpaceDesignState.MouseState = {
    NONE : 0,
    CREATINGUSERPOINT : 1,
    DRAGGINGUSERPOINT : 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT : 4,
    HITCANVAS : 5
};

REAL3D.InnerSpaceDesignState.HITRADIUS = 250;
REAL3D.InnerSpaceDesignState.MOVERADIUS = 100;
REAL3D.InnerSpaceDesignState.STATENAME = "InnerSpaceDesignState";

REAL3D.InnerSpaceDesignState.SceneData = function() {
    "use strict";
    this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
    this.userPointTree = new REAL3D.Wall.UserPointTree();
    //rendering data
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
};

REAL3D.InnerSpaceDesignState.SceneData.prototype.reInit = function() {
    "use strict";
    this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
    this.userPointTree = new REAL3D.Wall.UserPointTree();
    REAL3D.RenderManager.scene.remove(this.refFrame);
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
};

function enterInnerSpaceDesignState(containerId) {
    "use strict";
    var InnerSpaceDesignState, canvasElement, canvContainer, winW, winH;
    winW = $(window).width() - 100;
    winW = (winW < 1024) ? 1024 : winW;
    winH = $(window).height();
    winH = (winH < 768) ? 768 : winH;
    canvasElement = REAL3D.RenderManager.init(winW, winH);
    canvContainer = document.getElementById(containerId);
    canvContainer.appendChild(canvasElement);
    InnerSpaceDesignState = new REAL3D.InnerSpaceDesignState(winW, winH, canvasElement);
    REAL3D.StateManager.enterState(InnerSpaceDesignState);
}

function newWorkSpace() {
    "use strict";
    REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME).initUserData();
    console.log("New Work Space");
}

function saveWorkSpace() {
    "use strict";
    REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME).saveUserData();
    console.log("Save Work Space");
}

function savaAsWorkSpace() {
    "use strict";
    console.log("Save As Work Space");
}

function openWorkSpace() {
    "use strict";
    console.log("Open Work Space");
}
