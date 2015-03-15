/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, requestAnimationFrame, $ */

REAL3D.GeneralDesignEdit = {
    winW: 0,
    winH: 0,
    canvasElement: null,
    designName: ''
};

REAL3D.GeneralDesignEdit.init = function (winW, winH, canvasElement) {
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
};

REAL3D.GeneralDesignEdit.run = function () {
    "use strict";
    function animateFunction(timestamp) {
        REAL3D.RenderManager.update();
        requestAnimationFrame(animateFunction);
    }
    requestAnimationFrame(animateFunction);
};

REAL3D.GeneralDesignEdit.mouseDown = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.mouseMove = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.mouseUp = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.keyPress = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.keyDown = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.keyUp = function (e) {
    "use strict";
};
