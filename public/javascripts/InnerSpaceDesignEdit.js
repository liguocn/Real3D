/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, requestAnimationFrame, $ */

REAL3D.InnerSpaceDesign = {
    viewState: null,
    winW: 0,
    winH: 0,
    cameraOrtho: null,
    cameraOrthoName: null,
    cameraPersp: null,
    cameraPerspName: null,
    canvasElement: null
};

REAL3D.InnerSpaceDesign.init = function (winW, winH, canvasElement) {
    "use strict";
    this.winW = winW;
    this.winH = winH;
    this.cameraOrtho = null;
    this.cameraOrthoName = "CameraOrtho";
    this.cameraPersp = null;
    this.cameraPerspName = "CameraPersp";
    this.canvasElement = canvasElement;

    //init
    this.initUserData(null);

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

REAL3D.InnerSpaceDesign.setScene = function () {
    "use strict";
    if (REAL3D.RenderManager.getCamera(this.cameraOrthoName) === undefined) {
        var cameraOrthographic = new THREE.OrthographicCamera(this.winW / (-2), this.winW / 2, this.winH / 2, this.winH / (-2), 1, 2000);
        cameraOrthographic.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition);
        REAL3D.RenderManager.addCamera(this.cameraOrthoName, cameraOrthographic);
    }
    this.cameraOrtho = REAL3D.RenderManager.getCamera(this.cameraOrthoName);
    this.cameraOrtho.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition);
    REAL3D.RenderManager.switchCamera(this.cameraOrthoName);
    if (REAL3D.RenderManager.getCamera(this.cameraPerspName) === undefined) {
        //console.log("Win size: ", this.winW, this.winH);
        var cameraPerspective = new THREE.PerspectiveCamera(45, this.winW / this.winH, 1, 2000);
        cameraPerspective.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraPerspPosition);
        cameraPerspective.rotateX(1.570796326794897);
        REAL3D.RenderManager.addCamera(this.cameraPerspName, cameraPerspective);
    }
    this.cameraPersp = REAL3D.RenderManager.getCamera(this.cameraPerspName);
    this.cameraPersp.position.copy(REAL3D.InnerSpaceDesign.SceneData.cameraPerspPosition);
};

REAL3D.InnerSpaceDesign.initUserData = function (sceneData) {
    "use strict";
    //set up scene
    REAL3D.InnerSpaceDesign.EditWallView.init($(this.canvasElement).offset());
    REAL3D.InnerSpaceDesign.FreeWalkView.init($(this.canvasElement).offset(), this.winW, this.winH);
    REAL3D.InnerSpaceDesign.SceneData.init(sceneData);
    this.viewState = REAL3D.InnerSpaceDesign.EditWallView;
    this.setScene();
};

REAL3D.InnerSpaceDesign.run = function () {
    "use strict";
    var that = this;
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        that.viewState.update(timestamp);
        requestAnimationFrame(animateFunction);
    }
    requestAnimationFrame(animateFunction);
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

REAL3D.InnerSpaceDesign.keyPress = function (e) {
    "use strict";
    this.viewState.keyPress(e);
};

REAL3D.InnerSpaceDesign.MouseState = {
    NONE: 0,
    CREATINGUSERPOINT: 1,
    DRAGGINGUSERPOINT: 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT: 4,
    HITCANVAS: 5
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
    wallBoxes: [],
    wall3ds: [],
    refFrame: null,
    refObject: null
};

REAL3D.InnerSpaceDesign.SceneData.init = function (sceneData) {
    "use strict";
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, userPointBox, assistFlag, wall2d, wall3d;
    if (sceneData === null) {
        this.designName = "";
        this.cameraOrthoPosition = new THREE.Vector3(0, 0, 1000);
        this.cameraPerspPosition = new THREE.Vector3(0, 0, 100);
        this.wallThick = REAL3D.InnerSpaceDesign.WALLTHICK;
        this.wallHeight = REAL3D.InnerSpaceDesign.WALLHEIGHT;
        this.userPointTree = new REAL3D.Wall.UserPointTree();
    } else {
        this.designName = sceneData.designName;
        this.cameraOrthoPosition = sceneData.cameraOrthoPosition;
        this.cameraPerspPosition = sceneData.cameraPerspPosition;
        this.wallThick = sceneData.wallThick;
        this.wallHeight = sceneData.wallHeight;
        this.userPointTree = sceneData.userPointTree;
    }
    REAL3D.RenderManager.scene.remove(this.refFrame);
    this.refFrame = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refFrame);
    //render scene data
    //console.log("render scene data");

    this.drawCommonScene();
    this.switchTo2DContent();
};

REAL3D.InnerSpaceDesign.SceneData.drawCommonScene = function () {
    "use strict";
    var userPoints, userPointLen, pid, neighbors, neiLen, nid, userPointBox, assistFlag, wall2d, wall3d;
    this.wall2ds = [];
    this.wallBoxes = [];
    userPoints = this.userPointTree.points;
    userPointLen = userPoints.length;
    for (pid = 0; pid < userPointLen; pid++) {
        userPointBox = new REAL3D.Wall.UserPointBox(userPoints[pid], this.wallThick * 2, this.refFrame);
        this.wallBoxes.push(userPointBox);
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

REAL3D.InnerSpaceDesign.SceneData.switchTo2DContent = function () {
    "use strict";

    var light = new THREE.PointLight(0xa9a9a9, 1, 500);
    light.position.set(0, 0, 200);
    this.refFrame.add(light);

    var ambientLight = new THREE.AmbientLight(0x404040);
    this.refFrame.add(ambientLight);

    var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight1.position.set(1, 1, 1);
    this.refFrame.add(dirLight1);

    var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight2.position.set(-1, 1, 1);
    //this.refFrame.add(dirLight2);

    var dirLight3 = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight3.position.set(-1, -1, 1);
    this.refFrame.add(dirLight3);

    var dirLight4 = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight4.position.set(1, -1, 1);
    //this.refFrame.add(dirLight4);

    this.displayRefObject();
};

REAL3D.InnerSpaceDesign.SceneData.switchTo3DContent = function () {
    "use strict";
    this.hideRefObject();
};

REAL3D.InnerSpaceDesign.SceneData.displayRefObject = function () {
    "use strict";
    this.refFrame.remove(this.refObject);
    this.refObject = new THREE.Object3D();
    this.refFrame.add(this.refObject);

    var spaceDist, maxDist, lineCount, lid, material, geometry, line, coord;
    spaceDist = 100;
    maxDist = 1000;
    lineCount = maxDist / spaceDist;

    material = new THREE.LineBasicMaterial({color: 0x000000});
    
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-maxDist, 0, -1), new THREE.Vector3(maxDist, 0, -1));
    line = new THREE.Line(geometry, material);
    this.refObject.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, -maxDist, -1), new THREE.Vector3(0, maxDist, -1));
    line = new THREE.Line(geometry, material);
    this.refObject.add(line);

    material = new THREE.LineBasicMaterial({color: 0xa0a0a0});
    for (lid = 1; lid <= lineCount; lid++) {
        coord = lid * spaceDist;

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(coord, -maxDist, -1), new THREE.Vector3(coord, maxDist, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-coord, -maxDist, -1), new THREE.Vector3(-coord, maxDist, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, coord, -1), new THREE.Vector3(maxDist, coord, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-maxDist, -coord, -1), new THREE.Vector3(maxDist, -coord, -1));
        line = new THREE.Line(geometry, material);
        this.refObject.add(line);
    }
};

REAL3D.InnerSpaceDesign.SceneData.hideRefObject = function () {
    "use strict";
    this.refFrame.remove(this.refObject);
};

REAL3D.InnerSpaceDesign.SceneData.saveUserData = function () {
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

REAL3D.InnerSpaceDesign.SceneData.packUserData = function () {
    "use strict";
    var camOrthoPos, camPerspPos, postData, points, userPointLen, pid, userPoints, curPoint, neighborLen, nid;
    camOrthoPos = this.cameraOrthoPosition;
    camPerspPos = this.cameraPerspPosition;
    this.userPointTree.updateAssistId();
    userPoints = [];
    points = this.userPointTree.points;
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
        cameraOrthoPosition: [camOrthoPos.x, camOrthoPos.y, camOrthoPos.z],
        cameraPerspPosition: [camPerspPos.x, camPerspPos.y, camPerspPos.z],
        wallThick: this.wallThick,
        wallHeight: this.wallHeight,
        userPointLen: userPointLen,
        userPoints: userPoints
    };
    return postData;
};

REAL3D.InnerSpaceDesign.SceneData.unPackUserData = function (userData) {
    "use strict";
    var sceneData, camOrthoPos, camPerspPos, userPoints, userPointLen, pid, curPoint, neighbors, neiLen, nid, scenePoints;
    camOrthoPos = userData.cameraOrthoPosition;
    camPerspPos = userData.cameraPerspPosition;
    sceneData = {};
    sceneData.designName = this.designName;
    sceneData.cameraOrthoPosition = new THREE.Vector3(camOrthoPos[0], camOrthoPos[1], camOrthoPos[2]);
    sceneData.cameraPerspPosition = new THREE.Vector3(camPerspPos[0], camPerspPos[1], camPerspPos[2]);
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

REAL3D.InnerSpaceDesign.SceneData.loadUserData = function (callback) {
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
            REAL3D.InnerSpaceDesign.initUserData(sceneData);
            callback();
        }
    }, "json");
};

REAL3D.InnerSpaceDesign.SceneData.updateWallThick = function (thick) {
    "use strict";
    var wallLen, wid, boxLen, bid;
    wallLen = this.wall2ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall2ds[wid].thick = thick;
        this.wall2ds[wid].updateMesh();
    }
    boxLen = this.wallBoxes.length;
    for (bid = 0; bid < boxLen; bid++) {
        this.wallBoxes[bid].updateBoxLength(thick * 2);
    }
    this.wallThick = thick;
};

REAL3D.InnerSpaceDesign.SceneData.updateWallHeight = function (height) {
    "use strict";
    var wallLen, wid;
    wallLen = this.wall3ds.length;
    for (wid = 0; wid < wallLen; wid++) {
        this.wall3ds[wid].height = height;
        this.wall3ds[wid].updateMesh();
    }
    this.wallHeight = height;
};

REAL3D.InnerSpaceDesign.EditWallView = {
    mouseState: REAL3D.InnerSpaceDesign.MouseState.NONE,
    isMouseDown: false,
    mouseDownPos: new THREE.Vector2(0, 0),
    mouseMovePos: new THREE.Vector2(0, 0),
    canvasOffset: null,
    hitUserPointIndex: -1,
    lastCreatedPointIndex: -1
};

REAL3D.InnerSpaceDesign.EditWallView.init = function (canvasOffset) {
    "use strict";
    this.mouseState = REAL3D.InnerSpaceDesign.MouseState.NONE;
    this.isMouseDown = false;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.canvasOffset = canvasOffset;
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesign.EditWallView.update = function (timestamp) {
    "use strict";
    //console.log("update: timestamp = ", timestamp);
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

REAL3D.InnerSpaceDesign.EditWallView.keyPress = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesign.EditWallView.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = REAL3D.InnerSpaceDesign.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesign.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesign.winH / 2 + cameraPos.y;
    return REAL3D.InnerSpaceDesign.SceneData.userPointTree.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesign.EditWallView.connectUserPoint = function (index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        REAL3D.InnerSpaceDesign.SceneData.userPointTree.connectPoints(index1, index2);
        var wall2d, wall3d, point1, point2;
        point1 = REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[index1];
        point2 = REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[index2];
        wall2d = new REAL3D.Wall.Wall2D(point1, point2, REAL3D.InnerSpaceDesign.SceneData.wallThick, REAL3D.InnerSpaceDesign.SceneData.refFrame);
        wall3d = new REAL3D.Wall.Wall3D(wall2d, REAL3D.InnerSpaceDesign.SceneData.wallHeight, REAL3D.InnerSpaceDesign.SceneData.refFrame);
        REAL3D.InnerSpaceDesign.SceneData.wall2ds.push(wall2d);
        REAL3D.InnerSpaceDesign.SceneData.wall3ds.push(wall3d);
        point1.publish("updateSubscriber");
        point2.publish("updateSubscriber");
        point1.publish("updateMesh");
        point2.publish("updateMesh");
    }
};

REAL3D.InnerSpaceDesign.EditWallView.createNewUserPoint = function (mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newId, userPointBox;
    mousePosY = REAL3D.InnerSpaceDesign.winH - mousePosY;
    cameraPos = REAL3D.InnerSpaceDesign.SceneData.cameraOrthoPosition;
    worldPosX = mousePosX - REAL3D.InnerSpaceDesign.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - REAL3D.InnerSpaceDesign.winH / 2 + cameraPos.y;
    newId = REAL3D.InnerSpaceDesign.SceneData.userPointTree.addPoint(worldPosX, worldPosY);
    userPointBox = new REAL3D.Wall.UserPointBox(REAL3D.InnerSpaceDesign.SceneData.userPointTree.points[newId],
        REAL3D.InnerSpaceDesign.SceneData.wallThick * 2, REAL3D.InnerSpaceDesign.SceneData.refFrame);
    REAL3D.InnerSpaceDesign.SceneData.wallBoxes.push(userPointBox);
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

REAL3D.InnerSpaceDesign.FreeWalkView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    isMouseDown: false,
    mouseMovePos: new REAL3D.Vector2(0, 0),
    moveSpeed: 5,
    turnSpeed: 0.002
};

REAL3D.InnerSpaceDesign.FreeWalkView.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("FreeWalkView init");
    this.canvasOffset = canvasOffset;
    this.winW = winW;
    this.winH = winH;
    this.isMouseDown = false;
    this.mouseMovePos = new REAL3D.Vector2(0, 0);
    this.moveSpeed = 5;
    this.turnSpeed = 0.002;
};

REAL3D.InnerSpaceDesign.FreeWalkView.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesign.FreeWalkView.mouseDown = function (e) {
    "use strict";
    console.log("FreeWalkView mouseDown");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
};

REAL3D.InnerSpaceDesign.FreeWalkView.mouseMove = function (e) {
    "use strict";
    console.log("FreeWalkView mouseMove");
    var curPosX, curPosY, angle;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.isMouseDown) {
        angle = this.mouseMovePos.x - curPosX;
        REAL3D.InnerSpaceDesign.cameraPersp.rotateY(this.turnSpeed * angle);
    }
    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.InnerSpaceDesign.FreeWalkView.mouseUp = function (e) {
    "use strict";
    console.log("FreeWalkView mouseUp");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = false;
};

REAL3D.InnerSpaceDesign.FreeWalkView.keyPress = function (e) {
    "use strict";
    console.log("FreeWalkView keypress: ", e.which);
    if (e.which === 119) {
        REAL3D.InnerSpaceDesign.cameraPersp.translateZ(-1 * this.moveSpeed);
    } else if (e.which === 115) {
        REAL3D.InnerSpaceDesign.cameraPersp.translateZ(this.moveSpeed);
    }
    if (e.which === 97) {
        REAL3D.InnerSpaceDesign.cameraPersp.translateX(-1 * this.moveSpeed);
    } else if (e.which === 100) {
        REAL3D.InnerSpaceDesign.cameraPersp.translateX(this.moveSpeed);
    }
};

function enterInnerSpaceDesign() {
    "use strict";
    var canvasElement, canvContainer, winW, winH;
    winW = $(window).width() - 240;
    winW = (winW < 1024) ? 1024 : winW;
    winH = $(window).height() - 55;
    winH = (winH < 640) ? 640 : winH;
    canvasElement = REAL3D.RenderManager.init(winW, winH);
    canvContainer = document.getElementById("designspace");
    canvContainer.appendChild(canvasElement);
    REAL3D.InnerSpaceDesign.init(winW, winH, canvasElement);
    REAL3D.InnerSpaceDesign.run();
}

function updateUIData() {
    "use strict";
    $('#designName').val(REAL3D.InnerSpaceDesign.SceneData.designName);
    // $('#wallThick').val(REAL3D.InnerSpaceDesign.SceneData.wallThick);
    // $('#wallHeight').val(REAL3D.InnerSpaceDesign.SceneData.wallHeight);
}

function newWorkSpace() {
    "use strict";
    REAL3D.InnerSpaceDesign.initUserData(null);
    updateUIData();
    //console.log("New Work Space");
}

function saveWorkSpace() {
    "use strict";
    var designName, postData;
    designName = $("#designName").val();
    if (designName === null || designName === '') {
        alert("请输入设计名字");
    } else if (designName === REAL3D.InnerSpaceDesign.SceneData.designName) {
        REAL3D.InnerSpaceDesign.SceneData.saveUserData();
    } else {
        $.get("/innerspacedesign/edit/findName", {designName: designName}, function (data) {
            console.log("  findName:", data);
            if (data.success === 1) {
                alert("设计", designName, "已经存在,不能覆盖");
            } else {
                //rename and save
                if (REAL3D.InnerSpaceDesign.SceneData.designName === null || REAL3D.InnerSpaceDesign.SceneData.designName === '') {
                    REAL3D.InnerSpaceDesign.SceneData.designName = designName;
                    REAL3D.InnerSpaceDesign.SceneData.saveUserData();
                } else {
                    postData = {
                        originDesignName: REAL3D.InnerSpaceDesign.SceneData.designName,
                        newDesignName: designName
                    };
                    $.post("/innerspacedesign/edit/rename", $.param(postData, true), function (data) {
                        console.log("  rename result:", data);
                        if (data.success === 1) {
                            REAL3D.InnerSpaceDesign.SceneData.designName = designName;
                            REAL3D.InnerSpaceDesign.SceneData.saveUserData();
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
    if ($('#viewSwitch').text() === '2D') {
        $('#viewSwitch').text('3D');
        REAL3D.RenderManager.switchCamera(REAL3D.InnerSpaceDesign.cameraOrthoName);
        REAL3D.InnerSpaceDesign.viewState = REAL3D.InnerSpaceDesign.EditWallView;
    } else {
        $('#viewSwitch').text('2D');
        REAL3D.RenderManager.switchCamera(REAL3D.InnerSpaceDesign.cameraPerspName);
        REAL3D.InnerSpaceDesign.viewState = REAL3D.InnerSpaceDesign.FreeWalkView;
    }
}

function enterToolWall() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar" class="wall"></div>').appendTo('#leftContainer');
    $('<div class="text">墙</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    $('<div">墙厚(cm)<input id="wallThick" class="parmNumCtl" type="number" min="1" max="50"></div>').appendTo('#toolBar');
    $('#wallThick').get(0).addEventListener("input", changeWallThick, false);
    $('#wallThick').val(REAL3D.InnerSpaceDesign.SceneData.wallThick);
    
    $('<div>墙高(cm)<input id="wallHeight" class="parmNumCtl" type="number" min="100" max="500"></div>').appendTo('#toolBar');
    $('#wallHeight').get(0).addEventListener("input", changeWallHeight, false);
    $('#wallHeight').val(REAL3D.InnerSpaceDesign.SceneData.wallHeight);
    $('<hr />').appendTo('#toolBar');
    
    $('<div>视角切换<button id="viewSwitch" class="button">3D</button></div>').appendTo('#toolBar');
    $('#viewSwitch').click(viewSwitch);
    $('<hr />').appendTo('#toolBar');
    
    $('<button id="return" class="button">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolFurniture() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div>家具</div>').appendTo('#toolBar');

    $('<button id="return">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolLight() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div>灯光</div>').appendTo('#toolBar');

    $('<button id="return">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolMaterial() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div>材质</div>').appendTo('#toolBar');

    $('<button id="return">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolHome() {
    "use strict";
    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div class="text">工具栏</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');
    
    $('<button id="wallBut" class="button">墙</button>').appendTo('#toolBar');
    $('#wallBut').click(enterToolWall);
    $('<br>').appendTo('#toolBar');
    
    $('<button id="furnitureBut" class="button">家具</button>').appendTo('#toolBar');
    $('#furnitureBut').click(enterToolFurniture);
    $('<br>').appendTo('#toolBar');

    $('<button id="lightBut" class="button">灯光</button>').appendTo('#toolBar');
    $('#lightBut').click(enterToolLight);
    $('<br>').appendTo('#toolBar');

    $('<button id="materialBut" class="button">材质</button>').appendTo('#toolBar');
    $('#materialBut').click(enterToolMaterial);
    $('<br>').appendTo('#toolBar');
    
    $('<button id="return" class="button">返回</button>').appendTo('#toolBar');
    $('#return').click(backToHome);
    $('<br>').appendTo('#toolBar');
}

function backToHome() {
    "use strict";
    window.location.href = "/innerspacedesign";
}

function changeWallThick() {
    "use strict";
    //console.log("changeWallThick: ", $('#wallThick').val());
    REAL3D.InnerSpaceDesign.SceneData.updateWallThick($('#wallThick').val());
}

function changeWallHeight() {
    "use strict";
    //console.log("changeWallHeight: ", $('#wallHeight').val());
    REAL3D.InnerSpaceDesign.SceneData.updateWallHeight($('#wallHeight').val());
}

$(document).ready(function () {
    console.log("document is ready...");
    //init ui data
    enterToolHome();
    $('#newDesign').click(newWorkSpace);
    $('#saveDesign').click(saveWorkSpace);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');

    //init state
    enterInnerSpaceDesign();

    //load user data
    console.log("load user data");
    var designName = $('#designName').val();
    console.log("designName: ", designName);
    if (designName !== '') {
        console.log("designName is ", designName);
        REAL3D.InnerSpaceDesign.SceneData.designName = designName;
        REAL3D.InnerSpaceDesign.SceneData.loadUserData(updateUIData);
    } else {
        console.log("designName is space");
    }
});
