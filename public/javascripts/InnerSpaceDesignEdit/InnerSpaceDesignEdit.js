/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, requestAnimationFrame, $ */

REAL3D.InnerSpaceDesignEdit = {
    viewState: null,
    winW: 0,
    winH: 0,
    cameraOrtho: null,
    cameraOrthoName: null,
    cameraPersp: null,
    cameraPerspName: null,
    canvasElement: null
};

REAL3D.InnerSpaceDesignEdit.init = function (winW, winH, canvasElement) {
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

REAL3D.InnerSpaceDesignEdit.setScene = function () {
    "use strict";
    var cameraOrthographic, cameraPerspective;
    if (REAL3D.RenderManager.getCamera(this.cameraOrthoName) === undefined) {
        cameraOrthographic = new THREE.OrthographicCamera(this.winW / (-2), this.winW / 2, this.winH / 2, this.winH / (-2), 1, 2000);
        cameraOrthographic.position.copy(REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition);
        REAL3D.RenderManager.addCamera(this.cameraOrthoName, cameraOrthographic);
    }
    this.cameraOrtho = REAL3D.RenderManager.getCamera(this.cameraOrthoName);
    this.cameraOrtho.position.copy(REAL3D.InnerSpaceDesignEdit.SceneData.cameraOrthoPosition);
    REAL3D.RenderManager.switchCamera(this.cameraOrthoName);
    if (REAL3D.RenderManager.getCamera(this.cameraPerspName) === undefined) {
        //console.log("Win size: ", this.winW, this.winH);
        cameraPerspective = new THREE.PerspectiveCamera(45, this.winW / this.winH, 1, 2000);
        cameraPerspective.position.copy(REAL3D.InnerSpaceDesignEdit.SceneData.cameraPerspPosition);
        cameraPerspective.rotateX(1.570796326794897);
        REAL3D.RenderManager.addCamera(this.cameraPerspName, cameraPerspective);
    }
    this.cameraPersp = REAL3D.RenderManager.getCamera(this.cameraPerspName);
    this.cameraPersp.position.copy(REAL3D.InnerSpaceDesignEdit.SceneData.cameraPerspPosition);
};

REAL3D.InnerSpaceDesignEdit.initUserData = function (sceneData) {
    "use strict";
    //set up scene
    REAL3D.InnerSpaceDesignEdit.EditWallView.init($(this.canvasElement).offset());
    REAL3D.InnerSpaceDesignEdit.FreeWalkView.init($(this.canvasElement).offset(), this.winW, this.winH);
    REAL3D.InnerSpaceDesignEdit.SceneData.init(sceneData);
    this.viewState = REAL3D.InnerSpaceDesignEdit.EditWallView;
    this.setScene();
};

REAL3D.InnerSpaceDesignEdit.run = function () {
    "use strict";
    var that = this;
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        that.viewState.update(timestamp);
        requestAnimationFrame(animateFunction);
    }
    requestAnimationFrame(animateFunction);
};

REAL3D.InnerSpaceDesignEdit.mouseDown = function (e) {
    "use strict";
    this.viewState.mouseDown(e);
};

REAL3D.InnerSpaceDesignEdit.mouseMove = function (e) {
    "use strict";
    this.viewState.mouseMove(e);
};

REAL3D.InnerSpaceDesignEdit.mouseUp = function (e) {
    "use strict";
    this.viewState.mouseUp(e);
};

REAL3D.InnerSpaceDesignEdit.keyPress = function (e) {
    "use strict";
    this.viewState.keyPress(e);
};

REAL3D.InnerSpaceDesignEdit.MouseState = {
    NONE: 0,
    CREATINGUSERPOINT: 1,
    DRAGGINGUSERPOINT: 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT: 4,
    HITCANVAS: 5,
    REMOVEUSERPOINT: 6
};

REAL3D.InnerSpaceDesignEdit.HITRADIUS = 250;
REAL3D.InnerSpaceDesignEdit.MOVERADIUS = 100;
REAL3D.InnerSpaceDesignEdit.WALLTHICK = 10;
REAL3D.InnerSpaceDesignEdit.WALLHEIGHT = 200;
