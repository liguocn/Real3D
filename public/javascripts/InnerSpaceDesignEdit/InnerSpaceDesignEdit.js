/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, requestAnimationFrame, $ */

REAL3D.InnerSpaceDesignEdit = {
    controlState: null,
    editState: null,
    winW: 0,
    winH: 0,
    canvasElement: null,
    designName: ''
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
    canvasElement.addEventListener("keydown", function (e) { that.keyDown(e); }, false);
    canvasElement.addEventListener("keyup", function (e) { that.keyUp(e); }, false);
    canvasElement.setAttribute("tabindex", 1);
    canvasElement.focus();
    canvasElement.style.outline = "none";

    //init user data: not done
    REAL3D.InnerSpaceDesignEdit.WallData.init(null);
    REAL3D.InnerSpaceDesignEdit.ViewPathData.init(null);
};

REAL3D.InnerSpaceDesignEdit.run = function () {
    "use strict";
    var that = this;
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        if (that.controlState !== null) {
            if (that.controlState.update !== undefined) {
                that.controlState.update(timestamp);
            }
        }
        if (that.editState !== null) {
            if (that.editState.update !== undefined) {
                that.editState.update(timestamp);
            }
        }
        requestAnimationFrame(animateFunction);
    }
    requestAnimationFrame(animateFunction);
};

REAL3D.InnerSpaceDesignEdit.mouseDown = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.mouseDown !== undefined) {
            this.controlState.mouseDown(e);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.mouseMove = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.mouseMove !== undefined) {
            this.controlState.mouseMove(e);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.mouseUp = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.mouseUp !== undefined) {
            this.controlState.mouseUp(e);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.keyPress = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.keyPress !== undefined) {
            this.controlState.keyPress(e);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.keyDown = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.keyDown !== undefined) {
            this.controlState.keyDown(e);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.keyUp = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.keyUp !== undefined) {
            this.controlState.keyUp(e);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.enterState = function (state) {
    "use strict";
    if (this.editState !== null) {
        this.editState.exit();
    }
    this.editState = state;
    this.editState.enter();
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
    REMOVEUSERPOINT: 6,
    INSERTUSERPOINT: 7,
    MERGEUSERPOINT: 8
};

REAL3D.InnerSpaceDesignEdit.HITRADIUS = 250;
REAL3D.InnerSpaceDesignEdit.MOVERADIUS = 100;
REAL3D.InnerSpaceDesignEdit.WALLTHICK = 10;
REAL3D.InnerSpaceDesignEdit.WALLHEIGHT = 200;
