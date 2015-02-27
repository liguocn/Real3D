/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, requestAnimationFrame, $ */

REAL3D.InnerSpaceDesignEdit = {
    controlState: null,
    winW: 0,
    winH: 0,
    canvasElement: null
};

REAL3D.InnerSpaceDesignEdit.init = function (winW, winH, canvasElement) {
    "use strict";
    this.winW = winW;
    this.winH = winH;
    this.canvasElement = canvasElement;

    //register callback function
    var that = this;
    canvasElement.addEventListener("mousedown", function (e) { that.mouseDown(e); }, false);
    canvasElement.addEventListener("mouseup", function (e) { that.mouseUp(e); }, false);
    canvasElement.addEventListener("mousemove", function (e) { that.mouseMove(e); }, false);
    canvasElement.addEventListener("keypress", function (e) { that.keyPress(e); }, false);
    canvasElement.setAttribute("tabindex", 1);
    canvasElement.focus();
    canvasElement.style.outline = "none";

    //init control state and user data
    REAL3D.InnerSpaceDesignEdit.OverheadView.init($(this.canvasElement).offset(), this.winW, this.winH);
    this.controlState = REAL3D.InnerSpaceDesignEdit.OverheadView;
    REAL3D.InnerSpaceDesignEdit.SceneData.init(null);
};

// REAL3D.InnerSpaceDesignEdit.initUserData = function (sceneData) {
//     "use strict";
//     //set up scene
//     REAL3D.InnerSpaceDesignEdit.SceneData.init(sceneData);
//     this.controlState = REAL3D.InnerSpaceDesignEdit.EditWallView;
// };

REAL3D.InnerSpaceDesignEdit.run = function () {
    "use strict";
    var that = this;
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        that.controlState.update(timestamp);
        requestAnimationFrame(animateFunction);
    }
    requestAnimationFrame(animateFunction);
};

REAL3D.InnerSpaceDesignEdit.mouseDown = function (e) {
    "use strict";
    if (this.controlState !== null) {
        this.controlState.mouseDown(e);
    }
};

REAL3D.InnerSpaceDesignEdit.mouseMove = function (e) {
    "use strict";
    if (this.controlState !== null) {
        this.controlState.mouseMove(e);
    }
};

REAL3D.InnerSpaceDesignEdit.mouseUp = function (e) {
    "use strict";
    if (this.controlState !== null) {
        this.controlState.mouseUp(e);
    }
};

REAL3D.InnerSpaceDesignEdit.keyPress = function (e) {
    "use strict";
    if (this.controlState !== null) {
        this.controlState.keyPress(e);
    }
};

REAL3D.InnerSpaceDesignEdit.switchControlState = function (controlState) {
    "use strict";
    this.controlState = controlState;
    controlState.init($(this.canvasElement).offset(), this.winW, this.winH);
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
