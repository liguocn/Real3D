REAL3D.InspectorEdit = {
    controlState: null,
    editState: null,
    winW: 0,
    winH: 0,
    canvasElement: null,
    designName: ''
};

REAL3D.InspectorEdit.init = function (winW, winH, canvasElement) {
    "use strict";
    this.winW = winW;
    this.winH = winH;
    this.canvasElement = canvasElement;

    // register callback function
    var that = this;
    canvasElement.addEventListener("mousedown", function(e) { that.mouseDown(e); }, false);
    canvasElement.addEventListener("mouseup", function(e) { that.mouseUp(e); }, false);
    canvasElement.addEventListener("mouseMove", function(e) { that.mouseMove(e); }, false);
    canvasElement.addEventListener("keypress", function(e) { that.keyPress(e); }, false);
    canvasElement.addEventListener("keydown", function (e) { that.keyDown(e); }, false);
    canvasElement.addEventListener("keyup", function (e) { that.keyUp(e); }, false);
    canvasElement.setAttribute("tabindex", 1);
    canvasElement.focus();
    canvasElement.style.outline = "none";

    console.log("InspectorEdit enter.." + winW + winH);
};

REAL3D.InspectorEdit.run = function () {
    "use strict";
    var that = this;
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        //if (that.controlState === undefined) {
        //    console.log("ControlState undefined.");
        //}
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

REAL3D.InspectorEdit.mouseDown = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.mouseDown !== undefined) {
            this.controlState.mouseDown(e);
        }
    }
};

REAL3D.InspectorEdit.mouseMove = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.mouseMove !== undefined) {
            this.controlState.mouseMove(e);
        }
    }
};

REAL3D.InspectorEdit.mouseUp = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.mouseUp !== undefined) {
            this.controlState.mouseUp(e);
        }
    }
};

REAL3D.InspectorEdit.keyPress = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.keyPress !== undefined) {
            this.controlState.keyPress(e);
        }
    }
};

REAL3D.InspectorEdit.keyDown = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.keyDown !== undefined) {
            this.controlState.keyDown(e);
        }
    }
};

REAL3D.InspectorEdit.keyUp = function (e) {
    "use strict";
    if (this.controlState !== null) {
        if (this.controlState.keyUp !== undefined) {
            this.controlState.keyUp(e);
        }
    }
};

REAL3D.InspectorEdit.enterState = function (state) {
    "use strict";
    if (this.editState !== null) {
        this.editState.exit();
    }
    this.editState = state;
    this.editState.enter();
};

REAL3D.InspectorEdit.switchControlState = function (controlState) {
    "use strict";
    this.controlState = controlState;
    this.controlState.init($(this.canvasElement).offset(), this.winW, this.winH);
    console.log("constrolState switched to ", controlState);
};

REAL3D.InspectorEdit.MouseState = {
    NONE: 0
};