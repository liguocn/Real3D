/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesign = {
    viewState: null,
    winW: 0,
    winH: 0,
    cameraOrtho: null,
    cameraOrthoName: null,
    cameraPersp: null,
    cameraPerspName: null
};

REAL3D.InnerSpaceDesign.init = function (winW, winH, canvasElement) {
    "use strict";
    this.viewState = REAL3D.InnerSpaceDesign.EditWallView;
    this.winW = winW;
    this.winH = winH;
    this.cameraOrtho = null;
    this.cameraOrthoName = "CameraOrtho";
    this.cameraPersp = null;
    this.cameraPerspName = "CameraPersp";

    //init
    REAL3D.InnerSpaceDesign.EditWallView.init();
    REAL3D.InnerSpaceDesign.WalkView.init();
    REAL3D.InnerSpaceDesign.SceneData.init(null);

    //set up scene
    if (REAL3D.RenderManager.getCamera(this.cameraOrthoName) === undefined) {
        var cameraOrthographic = new THREE.OrthographicCamera(this.winW / (-2), this.winW / 2, this.winH / 2, this.winH / (-2), 1, 2000);
        cameraOrthographic.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition);
        REAL3D.RenderManager.addCamera(this.cameraOrthoName, cameraOrthographic);
    }
    this.cameraOrtho = REAL3D.RenderManager.getCamera(this.cameraOrthoName);
    REAL3D.RenderManager.switchCamera(this.cameraOrthoName);
    if (REAL3D.RenderManager.getCamera(this.cameraPerspName) === undefined) {
        console.log("Win size: ", this.winW, this.winH);
        var cameraPerspective = new THREE.PerspectiveCamera(90, this.winW / this.winH, 1, 2000);
        cameraPerspective.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraPerspPosition);
        REAL3D.RenderManager.addCamera(this.cameraPerspName, cameraPerspective);
    }
    this.cameraPersp = REAL3D.RenderManager.getCamera(this.cameraPerspName);
    var light = new THREE.PointLight(0x197db1, 1, 5000);
    light.position.set(0, 0, 1000);
    REAL3D.RenderManager.scene.add(light);

    //register callback function
    var that = this;
    canvasElement.addEventListener("mousedown", function (e) { that.mouseDown(e); }, false);
    canvasElement.addEventListener("mouseup", function (e) { that.mouseUp(e); }, false);
    canvasElement.addEventListener("mousemove", function (e) { that.mouseMove(e); }, false);
    canvasElement.addEventListener("keypress", function (e) { that.keyPress(e); }, false);
    canvasElement.setAttribute("tabindex", 1);
    canvasElement.focus();
    canvasElement.style.outline = "none";
};

REAL3D.InnerSpaceDesign.run = function () {
    "use strict";
    var that = this;
    requestAnimationFrame(function() {that.run(); });
};

REAL3D.InnerSpaceDesign.mouseDown = function (e) {
    "use strict";
    this.viewState.mouseDown(e);
};

REAL3D.InnerSpaceDesign.mouseMove = function (e) {
    "use strict";
    this.viewState.mouseMove(e);
};

REAL3D.InnerSpaceDesign.mouseUp = function (e) {
    "use strict";
    this.viewState.mouseUp(e);
};

REAL3D.InnerSpaceDesign.keypress = function (e) {
    "use strict";
    var keyCode = e.which;
    console.log("keyCode: ", keyCode);
};

REAL3D.InnerSpaceDesign.MouseState = {
    NONE : 0,
    CREATINGUSERPOINT : 1,
    DRAGGINGUSERPOINT : 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT : 4,
    HITCANVAS : 5
};

REAL3D.InnerSpaceDesign.HITRADIUS = 250;
REAL3D.InnerSpaceDesign.MOVERADIUS = 100;
REAL3D.InnerSpaceDesign.WALLTHICK = 10;
REAL3D.InnerSpaceDesign.WALLHEIGHT = 200;

REAL3D.InnerSpaceDesign.SceneData = {
    designName: "",
    cameraOrthoPosition: null,
    cameraPerspPosition: null,
    wallThick: 0,
    wallHeight: 0,
    userPointTree: null,
    wall2ds: [],
    wall3ds: [],
    refFrame: null
};

REAL3D.InnerSpaceDesign.SceneData.init = function (sceneData) {
    "use strict";
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, userPointBall, assistFlag, wall2d, wall3d;
    if (sceneData === null) {
        this.designName = "";
        this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
        this.cameraPerspPosition = new THREE.Vector3(0, 0, 500);
        this.wallThick = REAL3D.InnerSpaceDesignState.WALLTHICK;
        this.wallHeight = REAL3D.InnerSpaceDesignState.WALLHEIGHT;
        this.userPointTree = new REAL3D.Wall.UserPointTree();
    } else {
        this.designName = sceneData.designName;
        this.cameraOrthoPosition = sceneData.cameraOrthoPosition;
        this.cameraPerspPosition = sceneData.cameraPerspPosition;
        this.wallThick = sceneData.wallThick;
        this.wallHeight = sceneData.wallHeight;
        this.userPointTree = sceneData.userPointTree;
    }
    REAL3D.InnerSpaceDesign.cameraOrtho.position.copy(this.cameraOrthoPosition);
    REAL3D.InnerSpaceDesign.cameraPersp.position.copy(this.cameraPerspPosition);
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
    //render scene data
    console.log("render scene data");
    this.wall2ds = [];
    userPoints = this.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        userPointBall = new REAL3D.Wall.UserPointBall(userPoints[pid], this.refFrame);
    }
    this.userPointTree.updateAssistId();
    assistFlag = [];
    for (pid = 0; pid < userPointLen; pid++) {
        assistFlag[pid] = 1;
        userPoints[pid].updateNeighborOrder();
    }
    for (pid = 0; pid < userPointLen; pid++) {
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        for (nid = 0; nid < neiLen; nid++) {
            if (assistFlag[neighbors[nid].assistId] === 1) {
                wall2d = new REAL3D.Wall.Wall2D(userPoints[pid], neighbors[nid], this.wallThick, this.refFrame);
                wall3d = new REAL3D.Wall.Wall3D(wall2d, this.wallHeight, this.refFrame);
                this.wall2ds.push(wall2d);
                this.wall3ds.push(wall3d);
            }
        }
        assistFlag[pid] = -1;
    }
    console.log("publish events");
    for (pid = 0; pid < userPointLen; pid++) {
        userPoints[pid].publish("updateSubscriber");
        //userPoints[pid].publish("updateMesh");
    }
};

REAL3D.InnerSpaceDesign.EditWallView = {
    mouseState: REAL3D.InnerSpaceDesignState.MouseState.NONE,
    isMouseDown: false,
    mouseDownPos: new THREE.Vector2(0, 0),
    mouseMovePos: new THREE.Vector2(0, 0),
    canvasOffset: $(canvasElement).offset(),
    hitUserPointIndex: -1,
    lastCreatedPointIndex: -1
};

REAL3D.InnerSpaceDesign.EditWallView.init = function () {
    "use strict";
    this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.canvasOffset = $(canvasElement).offset();
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesign.EditWallView.mouseDown = function (e) {
    "use strict";
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    //console.log("mousePos: ", this.mouseDownPos.x, this.mouseDownPos.y, curPosX, curPosY);
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) * (curPosY - this.mouseDownPos.y);
    //console.log("mouseDownDist: ", mouseDownDist);
    isHittingTheSamePos = (mouseDownDist < REAL3D.InnerSpaceDesign.HITRADIUS);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    //console.log("hit the same point: ", isHittingTheSamePos, "  hit index: ", this.hitUserPointIndex);
    if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.NONE) {
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.InnerSpaceDesign.MouseState.HITCANVAS;
            //console.log("state: NONE -> HITCANVAS");
        } else {
            this.mouseState = REAL3D.InnerSpaceDesign.MouseState.HITUSERPOINT;
            //console.log("state: NONE -> HITUSERPOINT");
        }
    } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.InnerSpaceDesign.MouseState.NONE;
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

REAL3D.InnerSpaceDesign.EditWallView.mouseMove = function (e) {
    "use strict";
    var curPosX, curPosY;
    if (this.isMouseDown) {
        //console.log("---------------------------------------------mousemove: ", this.mouseState);
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.HITUSERPOINT) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesign.MouseState.DRAGGINGUSERPOINT;
                this.draggingUserPoint(curPosX, curPosY);
                //console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesign.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                //console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
        // console.log("Mouse state: ", this.mouseState);
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
};

REAL3D.InnerSpaceDesign.EditWallView.mouseUp = function (e) {
    "use strict";
    //console.log("---------------------------------------------mouseup: ", this.mouseState, "stateName: ", this.stateName);
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesign.MouseState.NONE;
        //console.log("state: DRAGGINGUSERPOINT -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesign.MouseState.NONE;
        //console.log("state: DRAGGINGCANVAS -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.HITUSERPOINT) {
        this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
        this.lastCreatedPointIndex = this.hitUserPointIndex;
        this.mouseState = REAL3D.InnerSpaceDesign.MouseState.CREATINGUSERPOINT;
        //console.log("state: HITUSERPOINT -> CREATINGUSERPOINT, connectUserPoint to exist point");
    } else if (this.mouseState === REAL3D.InnerSpaceDesign.MouseState.HITCANVAS) {
        //console.log("state: HITCANVAS -> CREATINGUSERPOINT, createNewUserPoint");
        this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesign.MouseState.CREATINGUSERPOINT;
        //console.log("createNewUserPoint: ", this.lastCreatedPointIndex);
    }
    this.isMouseDown = false;
    //console.log("Mouse state: ", this.mouseState);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesign.EditWallView.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return REAL3D.InnerSpaceDesign.SceneData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesign.EditWallView.connectUserPoint = function (index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        REAL3D.InnerSpaceDesign.SceneData.userPointTree.connectPoints(index1, index2);
        var wall2d, wall3d, point1, point2;
        point1 = REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[index1];
        point2 = REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[index2];
        wall2d = new REAL3D.Wall.Wall2D(point1, point2, this.sceneData.wallThick, this.sceneData.refFrame);
        wall3d = new REAL3D.Wall.Wall3D(wall2d, this.sceneData.wallHeight, this.sceneData.refFrame);
        REAL3D.InnerSpaceDesign.SceneData.wall2ds.push(wall2d);
        REAL3D.InnerSpaceDesign.SceneData.wall3ds.push(wall3d);
        point1.publish("updateSubscriber");
        point2.publish("updateSubscriber");
        point1.publish("updateMesh");
        point2.publish("updateMesh");
        // var userPointLine = new REAL3D.Wall.UserPointLine(this.sceneData.userPointTree.points[index1],
        //     this.sceneData.userPointTree.points[index2], this.sceneData.refFrame);
    }
};

REAL3D.InnerSpaceDesign.EditWallView.createNewUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newId, userPointBall;
    mousePosY = REAL3D.InnerSpaceDesign.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesign.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesign.winH / 2 + cameraPos.y;
    newId = REAL3D.InnerSpaceDesign.SceneData.userPointTree.addPoint(worldPosX, worldPosY);
    userPointBall = new REAL3D.Wall.UserPointBall(REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[newId],
        REAL3D.InnerSpaceDesign.SceneData.refFrame);
    return newId;
};

REAL3D.InnerSpaceDesign.EditWallView.finishCreatingNewUserPoint = function () {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesign.EditWallView.isMouseMoved = function (mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    //console.log("isMouseMoved: dist = ", dist, mousePosX, mousePosY, this.mouseDownPos.x, this.mouseDownPos.y);
    if (dist > REAL3D.InnerSpaceDesign.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.InnerSpaceDesign.EditWallView.draggingUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = REAL3D.InnerSpaceDesign.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesign.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesign.winH / 2 + cameraPos.y;
    REAL3D.InnerSpaceDesign.SceneData.userPointTree.setPosition(this.hitUserPointIndex, worldPosX, worldPosY);
    REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[this.hitUserPointIndex].publish("updateMesh");
};

REAL3D.InnerSpaceDesign.EditWallView.draggingCanvas = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition.x += worldDifX;
    REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition.y += worldDifY;
    REAL3D.InnerSpaceDesign.cameraOrtho.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition);
};

REAL3D.InnerSpaceDesign.WalkView = {

};

REAL3D.InnerSpaceDesign.WalkView.mouseDown = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesign.WalkView.mouseMove = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesign.WalkView.mouseUp = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesign.initUserData = function (sceneData) {
    "use strict";
    REAL3D.InnerSpaceDesign.EditWallView.init();
    REAL3D.InnerSpaceDesign.WalkView.init();
    REAL3D.InnerSpaceDesign.SceneData.init(sceneData);
};

REAL3D.InnerSpaceDesign.saveUserData = function () {
    "use strict";
    var postData = this.packUserData();
    console.log("postData: ", postData);
    $.post("/innerspacedesign/edit/save", $.param(postData, true), function (data) {
        console.log("  data return from server:", data);
        if (data.saved === -1) {
            window.location.href = "/DoLogin";
        }
    }, "json");
};

REAL3D.InnerSpaceDesign.packUserData = function () {
    "use strict";
    var camPos, postData, points, userPointLen, pid, userPoints, curPoint, neighborLen, nid;
    camPos = this.sceneData.cameraOrthoPosition;
    this.sceneData.userPointTree.updateAssistId();
    userPoints = [];
    points = this.sceneData.userPointTree.points;
    userPointLen = points.length;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = points[pid];
        userPoints.push(curPoint.pos.getX());
        userPoints.push(curPoint.pos.getY());
        neighborLen = curPoint.neighbors.length;
        userPoints.push(neighborLen);
        for (nid = 0; nid < neighborLen; nid++) {
            userPoints.push(curPoint.neighbors[nid].assistId);
        }
    }
    postData = {
        designName: this.designName,
        cameraOrthoPosition: [camPos.x, camPos.y, camPos.z],
        wallThick: this.sceneData.wallThick,
        wallHeight: this.sceneData.wallHeight,
        userPointLen: userPointLen,
        userPoints: userPoints
    };
    return postData;
};

REAL3D.InnerSpaceDesign.unPackUserData = function (userData) {
    "use strict";
    var sceneData, camOrthPos, userPoints, userPointLen, pid, curPoint, neighbors, neiLen, nid, scenePoints;
    camOrthPos = userData.cameraOrthoPosition;
    sceneData = {};
    sceneData.cameraOrthoPosition = new THREE.Vector3(camOrthPos[0], camOrthPos[1], camOrthPos[2]);
    sceneData.wallThick = userData.wallThick;
    sceneData.wallHeight = userData.wallHeight;
    sceneData.userPointTree = new REAL3D.Wall.UserPointTree();
    userPoints = userData.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = new REAL3D.Wall.UserPoint(userPoints[pid].posX, userPoints[pid].posY);
        sceneData.userPointTree.points.push(curPoint);
    }
    scenePoints = sceneData.userPointTree.points;
    for (pid = 0; pid < userPointLen; pid++) {
        curPoint = scenePoints[pid];
        neighbors = userPoints[pid].neighbors;
        neiLen = neighbors.length;
        curPoint.neighbors = [];
        for (nid = 0; nid < neiLen; nid++) {
            curPoint.neighbors.push(scenePoints[neighbors[nid]]);
        }
    }
    return sceneData;
};

REAL3D.InnerSpaceDesignState.prototype.loadUserData = function (callback) {
    "use strict";
    var postData, curState, sceneData;
    postData = {
        designName: this.designName
    };
    curState = this;
    $.post("/innerspacedesign/edit/load", $.param(postData, true), function (data) {
        console.log("  data return from server");
        if (data.success) {
            console.log("  loaded data: ", data);
            sceneData = curState.unPackUserData(data.sceneData);
            curState.initUserData(postData.designName, sceneData);
            callback();
        }
    }, "json");
};



REAL3D.InnerSpaceDesignState.EditWallView = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignState.EditWallView.prototype.mouseDown = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignState.EditWallView.prototype.mouseMove = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignState.EditWallView.prototype.mouseUp = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignState.SceneData = function () {
    "use strict";
    this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
    this.wallThick = REAL3D.InnerSpaceDesignState.WALLTHICK;
    this.wallHeight = REAL3D.InnerSpaceDesignState.WALLHEIGHT;
    this.userPointTree = new REAL3D.Wall.UserPointTree();
    this.wall2ds = [];
    this.wall3ds = [];
    //rendering data
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
};

REAL3D.InnerSpaceDesignState.SceneData.prototype.reInit = function (sceneData) {
    "use strict";
    
};

REAL3D.InnerSpaceDesignState.SceneData.prototype.updateWallThick = function (thick) {
    "use strict";
    var wallLen, wid;
    wallLen = this.wall2ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall2ds[wid].thick = thick;
        this.wall2ds[wid].updateMesh();
    }
    this.wallThick = thick;
};

REAL3D.InnerSpaceDesignState.SceneData.prototype.updateWallHeight = function (height) {
    "use strict";
    var wallLen, wid;
    wallLen = this.wall3ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall3ds[wid].height = height;
        this.wall3ds[wid].updateMesh();
    }
    this.wallHeight = height;
};

function enterInnerSpaceDesignState(containerId) {
    "use strict";
    var InnerSpaceDesignState, canvasElement, canvContainer, winW, winH;
    winW = $(window).width() - 128;
    winW = (winW < 1024) ? 1024 : winW;
    winH = $(window).height() - 55;
    winH = (winH < 640) ? 640 : winH;
    canvasElement = REAL3D.RenderManager.init(winW, winH);
    canvContainer = document.getElementById(containerId);
    canvContainer.appendChild(canvasElement);
    InnerSpaceDesignState = new REAL3D.InnerSpaceDesignState(winW, winH, canvasElement);
    REAL3D.StateManager.enterState(InnerSpaceDesignState);
}

function updateUIData() {
    "use strict";
    var designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    $('#designName').val(designState.designName);
    $('#wallThick').val(designState.sceneData.wallThick);
    $('#wallHeight').val(designState.sceneData.wallHeight);
}

function newWorkSpace() {
    "use strict";
    REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME).initUserData("", null);
    updateUIData();
    console.log("New Work Space");
}

function saveWorkSpace() {
    "use strict";
    var designState, designName, postData;
    designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    console.log("designName: ", designState.designName);
    designName = $("#designName").val();
    if (designName === null || designName === '') {
        alert("请输入设计名字");
    } else if (designName === designState.designName) {
        designState.saveUserData();
    } else {
        $.get("/innerspacedesign/edit/findName", {designName: designName}, function (data) {
            console.log("  findName:", data);
            if (data.success === 1) {
                alert("设计", designName, "已经存在,不能覆盖");
            } else {
                //rename and save
                if (designState.designName === null || designState.designName === '') {
                    designState.designName = designName;
                    designState.saveUserData();
                } else {
                    postData = {
                        originDesignName: designState.designName,
                        newDesignName: designName
                    };
                    $.post("/innerspacedesign/edit/rename", $.param(postData, true), function (data) {
                        console.log("  rename result:", data);
                        if (data.success === 1) {
                            designState.designName = designName;
                            designState.saveUserData();
                        } else {
                            alert("保存失败");
                        }
                    }, "json");
                }
            }
        }, "json");
    }
    console.log("Save Work Space");
}

function viewSwitch() {
    "use strict";
    var designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    if ($('#viewSwitch').text() === '3D') {
        $('#viewSwitch').text('2D');
        REAL3D.RenderManager.switchCamera(designState.cameraOrthoName);
    } else {
        $('#viewSwitch').text('3D');
        REAL3D.RenderManager.switchCamera(designState.cameraPerspName);
    }
}

function backToHome() {
    "use strict";
    window.location.href = "/innerspacedesign";
}

function changeWallThick() {
    "use strict";
    console.log("changeWallThick: ", $('#wallThick').val());
    var designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    designState.sceneData.updateWallThick($('#wallThick').val());
}

function changeWallHeight() {
    "use strict";
    console.log("changeWallHeight: ", $('#wallHeight').val());
    var designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    designState.sceneData.updateWallHeight($('#wallHeight').val());
}

$(document).ready(function () {
    console.log("document is ready...");
    //init ui data
    $('#wallThick').get(0).addEventListener("input", changeWallThick, false);
    $('#wallHeight').get(0).addEventListener("input", changeWallHeight, false);
    $('#newDesign').click(newWorkSpace);
    $('#saveDesign').click(saveWorkSpace);
    $('#viewSwitch').click(viewSwitch);
    $('#return').click(backToHome);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');

    //init state
    REAL3D.Framework.init();
    REAL3D.Framework.run();
    enterInnerSpaceDesignState("designspace");
    var designState, designName;
    designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);

    //load user data
    console.log("load user data");
    designName = $('#designName').val();
    if (designName !== '') {
        console.log("designName is ", designName);
        designState.designName = designName;
        designState.loadUserData(updateUIData);
    } else {
        console.log("designName is space");
    }
});
