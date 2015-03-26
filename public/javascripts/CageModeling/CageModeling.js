/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, requestAnimationFrame, $ */

REAL3D.CageModeling = {
    control: null,
    state: null,
    winW: 0,
    winH: 0,
    canvasElement: null,
    designName: ''
};

REAL3D.CageModeling.init = function (winW, winH, canvasElement) {
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
    REAL3D.CageModeling.CageData.init(null);
};

REAL3D.CageModeling.run = function () {
    "use strict";
    var that = this;
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        if (that.control !== null) {
            if (that.control.update !== undefined) {
                that.control.update(timestamp);
            }
        }
        if (that.state !== null) {
            if (that.state.update !== undefined) {
                that.state.update(timestamp);
            }
        }
        requestAnimationFrame(animateFunction);
    }
    requestAnimationFrame(animateFunction);
};

REAL3D.CageModeling.mouseDown = function (e) {
    "use strict";
    if (this.control !== null) {
        if (this.control.mouseDown !== undefined) {
            this.control.mouseDown(e);
        }
    }
};

REAL3D.CageModeling.mouseMove = function (e) {
    "use strict";
    if (this.control !== null) {
        if (this.control.mouseMove !== undefined) {
            this.control.mouseMove(e);
        }
    }
};

REAL3D.CageModeling.mouseUp = function (e) {
    "use strict";
    if (this.control !== null) {
        if (this.control.mouseUp !== undefined) {
            this.control.mouseUp(e);
        }
    }
};

REAL3D.CageModeling.keyPress = function (e) {
    "use strict";
    if (this.control !== null) {
        if (this.control.keyPress !== undefined) {
            this.control.keyPress(e);
        }
    }
};

REAL3D.CageModeling.keyDown = function (e) {
    "use strict";
    if (this.control !== null) {
        if (this.control.keyDown !== undefined) {
            this.control.keyDown(e);
        }
    }
};

REAL3D.CageModeling.keyUp = function (e) {
    "use strict";
    if (this.control !== null) {
        if (this.control.keyUp !== undefined) {
            this.control.keyUp(e);
        }
    }
};

REAL3D.CageModeling.enterState = function (state) {
    "use strict";
    if (this.state !== null) {
        this.state.exit();
    }
    this.state = state;
    this.state.enter();
};

REAL3D.CageModeling.switchControl = function (control) {
    "use strict";
    this.control = control;
    this.control.init($(this.canvasElement).offset(), this.winW, this.winH);
};

REAL3D.CageModeling.MouseState = {
    NONE: 0
};

REAL3D.CageModeling.ViewMode = {
    NONE: 0,
    TRANSLATE: 1,
    ROTATE: 2,
    SCALE: 3
};

REAL3D.CageModeling.EditMode = {
    NONE: 0,
    EDIT: 1,
    EXTRUDE: 2,
    SPLIT: 3,
    DELETE: 4,
    MERGE: 5,
    CONNECT: 6,
    FILLHOLE: 7
};

REAL3D.CageModeling.MouseState = {
    NONE: 0,
    HITCANVAS: 1,
    HITFACE: 2,
    HITEDGE: 3,
    HITVERTEX: 4
};
