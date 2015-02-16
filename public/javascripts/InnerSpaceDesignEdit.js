/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignState = function (winW, winH, canvasElement) {
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

    this.designName = null;
    this.sceneData = new REAL3D.InnerSpaceDesignState.SceneData();

    var that = this;
    canvasElement.addEventListener("mousedown", function (e) { that.mouseDown(e); }, false);
    canvasElement.addEventListener("mouseup", function (e) { that.mouseUp(e); }, false);
    canvasElement.addEventListener("mousemove", function (e) { that.mouseMove(e); }, false);
    canvasElement.addEventListener("keypress", function (e) { that.keyPress(e); }, false);
    canvasElement.setAttribute("tabindex", 1);
    canvasElement.focus();
    canvasElement.style.outline = "none";
};

REAL3D.InnerSpaceDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.InnerSpaceDesignState.prototype.initUserData = function (designName, sceneData) {
    "use strict";
    this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;

    this.designName = designName;
    this.sceneData.reInit(sceneData);

    this.cameraOrtho.position.copy(this.sceneData.cameraOrthoPosition);
};

REAL3D.InnerSpaceDesignState.prototype.saveUserData = function () {
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

REAL3D.InnerSpaceDesignState.prototype.packUserData = function () {
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

REAL3D.InnerSpaceDesignState.prototype.unPackUserData = function (userData) {
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

REAL3D.InnerSpaceDesignState.prototype.setupScene = function () {
    "use strict";
    var light = new THREE.PointLight(0x197db1, 1, 5000);
    light.position.set(0, 0, 1000);
    REAL3D.RenderManager.scene.add(light);
};

REAL3D.InnerSpaceDesignState.prototype.enter = function () {
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
    this.setupScene();
};

REAL3D.InnerSpaceDesignState.prototype.update = function () {
    "use strict";
    REAL3D.RenderManager.update();
};

REAL3D.InnerSpaceDesignState.prototype.exit = function () {
    "use strict";
    console.log("Exit InnerSpaceDesignState");
};

REAL3D.InnerSpaceDesignState.prototype.mouseDown = function (e) {
    "use strict";
    //console.log("---------------------------------------------mousedown: ", this.mouseState, "stateName: ", this.stateName);
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    //console.log("mousePos: ", this.mouseDownPos.x, this.mouseDownPos.y, curPosX, curPosY);
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) * (curPosY - this.mouseDownPos.y);
    //console.log("mouseDownDist: ", mouseDownDist);
    isHittingTheSamePos = (mouseDownDist < REAL3D.InnerSpaceDesignState.HITRADIUS);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    //console.log("hit the same point: ", isHittingTheSamePos, "  hit index: ", this.hitUserPointIndex);
    if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.NONE) {
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS;
            //console.log("state: NONE -> HITCANVAS");
        } else {
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT;
            //console.log("state: NONE -> HITUSERPOINT");
        }
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
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
    //console.log("Mouse state: ", this.mouseState);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignState.prototype.mouseMove = function (e) {
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
                //console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                //console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
        // console.log("Mouse state: ", this.mouseState);
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
};

REAL3D.InnerSpaceDesignState.prototype.mouseUp = function (e) {
    "use strict";
    //console.log("---------------------------------------------mouseup: ", this.mouseState, "stateName: ", this.stateName);
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
        //console.log("state: DRAGGINGUSERPOINT -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
        //console.log("state: DRAGGINGCANVAS -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT) {
        this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
        this.lastCreatedPointIndex = this.hitUserPointIndex;
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT;
        //console.log("state: HITUSERPOINT -> CREATINGUSERPOINT, connectUserPoint to exist point");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS) {
        //console.log("state: HITCANVAS -> CREATINGUSERPOINT, createNewUserPoint");
        this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT;
        //console.log("createNewUserPoint: ", this.lastCreatedPointIndex);
    }
    this.isMouseDown = false;
    //console.log("Mouse state: ", this.mouseState);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignState.prototype.keyPress = function (e) {
    "use strict";
    var keyCode = e.which;
    console.log("keyCode: ", keyCode);
};

REAL3D.InnerSpaceDesignState.prototype.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.sceneData.cameraOrthoPosition;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return this.sceneData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignState.prototype.connectUserPoint = function (index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        this.sceneData.userPointTree.connectPoints(index1, index2);
        var wall2d, point1, point2;
        point1 = this.sceneData.userPointTree.points[index1];
        point2 = this.sceneData.userPointTree.points[index2];
        wall2d = new REAL3D.Wall.Wall2D(point1, point2, this.sceneData.wallThick, this.sceneData.refFrame);
        this.sceneData.wall2ds.push(wall2d);
        point1.publish("updateSubscriber");
        point2.publish("updateSubscriber");
        point1.publish("updateMesh");
        point2.publish("updateMesh");
        // var userPointLine = new REAL3D.Wall.UserPointLine(this.sceneData.userPointTree.points[index1],
        //     this.sceneData.userPointTree.points[index2], this.sceneData.refFrame);
    }
};

REAL3D.InnerSpaceDesignState.prototype.createNewUserPoint = function (mousePosX, mousePosY) {
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

REAL3D.InnerSpaceDesignState.prototype.finishCreatingNewUserPoint = function () {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignState.prototype.isMouseMoved = function (mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    //console.log("isMouseMoved: dist = ", dist, mousePosX, mousePosY, this.mouseDownPos.x, this.mouseDownPos.y);
    if (dist > REAL3D.InnerSpaceDesignState.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.InnerSpaceDesignState.prototype.draggingUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    this.sceneData.userPointTree.setPosition(this.hitUserPointIndex, worldPosX, worldPosY);
    this.sceneData.userPointTree.points[this.hitUserPointIndex].publish("updateMesh");
};

REAL3D.InnerSpaceDesignState.prototype.draggingCanvas = function (mousePosX, mousePosY) {
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
REAL3D.InnerSpaceDesignState.WALLTHICK = 10;
REAL3D.InnerSpaceDesignState.WALLHEIGHT = 200;

REAL3D.InnerSpaceDesignState.SceneData = function () {
    "use strict";
    this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
    this.wallThick = REAL3D.InnerSpaceDesignState.WALLTHICK;
    this.wallHeight = REAL3D.InnerSpaceDesignState.WALLHEIGHT;
    this.userPointTree = new REAL3D.Wall.UserPointTree();
    this.wall2ds = [];
    //rendering data
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
};

REAL3D.InnerSpaceDesignState.SceneData.prototype.reInit = function (sceneData) {
    "use strict";
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, userPointBall, assistFlag, wall2d;
    if (sceneData === null) {
        this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
        this.wallThick = REAL3D.InnerSpaceDesignState.WALLTHICK;
        this.wallHeight = REAL3D.InnerSpaceDesignState.WALLHEIGHT;
        this.userPointTree = new REAL3D.Wall.UserPointTree();
    } else {
        this.cameraOrthoPosition = sceneData.cameraOrthoPosition;
        this.wallThick = sceneData.wallThick;
        this.wallHeight = sceneData.wallHeight;
        this.userPointTree = sceneData.userPointTree;
    }
    console.log(" userPointTree:", this.userPointTree);
    REAL3D.RenderManager.scene.remove(this.refFrame);
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
    //render scene data
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
                this.wall2ds.push(wall2d);
            }
        }
        assistFlag[pid] = -1;
    }
    for (pid = 0; pid < userPointLen; pid++) {
        userPoints[pid].publish("updateSubscriber");
        userPoints[pid].publish("updateMesh");
    }
};

REAL3D.InnerSpaceDesignState.SceneData.prototype.updateWall2DThick = function (thick) {
    "use strict";
    var wallLen, wid;
    wallLen = this.wall2ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall2ds[wid].thick = thick;
        this.wall2ds[wid].updateMesh();
    }
    this.wallThick = thick;
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

function newWorkSpace() {
    "use strict";
    REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME).initUserData(null, null);
    console.log("New Work Space");
    // var userName = window.prompt("Input your name: ");
    // console.log("userName: ", userName);
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

// function renameWorkSpace() {
//     "use strict";
//     var newName, designState, postData;
//     newName = window.prompt("请输入新的设计名字：");
//     if (newName === null) {
//         return;
//     }
//     console.log("newName: ", newName);
//     //Need to verify newName, which will be done later.
//     designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
//     if (designState.designName === null) {
//         designState.designName = newName;
//     } else {
//         postData = {
//             originDesignName: designState.designName,
//             newDesignName: newName
//         };
//         $.post("/innerspacedesign/edit/rename", $.param(postData, true), function (data) {
//             console.log("  rename result:", data);
//             if (data.success === 1) {
//                 designState.designName = newName;
//             }
//         }, "json");
//     }
//     console.log("ReName Work Space");
// }

function backToHome() {
    "use strict";
    window.location.href = "/innerspacedesign";
}

function changeWallThick() {
    "use strict";
    console.log("changeWallThick: ", $('#wallThick').val());
    var designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    designState.sceneData.updateWall2DThick($('#wallThick').val());
}

function changeWallHeight() {
    "use strict";
    console.log("changeWallHeight: ", $('#wallHeight').val());
}

function updateUIData() {
    "use strict";
    var designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);
    $('#wallThick').val(designState.sceneData.wallThick);
    $('#wallHeight').val(designState.sceneData.wallHeight);
}

$(document).ready(function () {
    console.log("document is ready...");
    //init ui data
    $('#wallThick').get(0).addEventListener("input", changeWallThick, false);
    $('#wallHeight').get(0).addEventListener("input", changeWallHeight, false);
    $('#newDesign').click(newWorkSpace);
    $('#saveDesign').click(saveWorkSpace);
    $('#return').click(backToHome);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');

    //init state
    REAL3D.Framework.init();
    REAL3D.Framework.run();
    enterInnerSpaceDesignState("designspace");
    var designState, designName;
    designState = REAL3D.StateManager.getState(REAL3D.InnerSpaceDesignState.STATENAME);

    //load user data
    designName = $('#designName').val();
    if (designName !== '') {
        console.log("designName is ", designName);
        designState.designName = designName;
        designState.loadUserData(updateUIData);
    } else {
        console.log("designName is space");
    }
});
