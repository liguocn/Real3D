/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.CageModeling.FrameUI = {
    canvasElement: null,
    winW: null,
    winH: null
};

REAL3D.CageModeling.FrameUI.init = function () {
    "use strict";
    //init ui data
    $('#newDesign').click(REAL3D.CageModeling.FrameUI.newWorkSpace);
    $('#saveDesign').click(REAL3D.CageModeling.FrameUI.saveWorkSpace);
    $('#back').click(REAL3D.CageModeling.FrameUI.back);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');
    REAL3D.CageModeling.HomeUI.enter();

    var canvContainer;
    this.winW = $(window).width() - 240;
    this.winW = (this.winW < 1024) ? 1024 : this.winW;
    this.winH = $(window).height() - 90;
    this.winH = (this.winH < 600) ? 640 : this.winH;
    this.canvasElement = REAL3D.RenderManager.init(this.winW, this.winH);
    canvContainer = document.getElementById("designspace");
    canvContainer.appendChild(this.canvasElement);
    console.log("winW: ", this.winW, " winH: ", this.winH, " canvasElement: ", this.canvasElement);
};

REAL3D.CageModeling.FrameUI.newWorkSpace = function () {
    "use strict";
};

REAL3D.CageModeling.FrameUI.saveWorkSpace = function () {
    "use strict";
};

REAL3D.CageModeling.FrameUI.back = function () {
    "use strict";
    window.location.href = "/personalhomepage";
};

$(document).ready(function () {
    "use strict";
    console.log("document is ready...");

    REAL3D.CageModeling.FrameUI.init();

    REAL3D.CageModeling.init(REAL3D.CageModeling.FrameUI.winW,
        REAL3D.CageModeling.FrameUI.winH,
        REAL3D.CageModeling.FrameUI.canvasElement);
    REAL3D.CageModeling.run();
    REAL3D.CageModeling.enterState(REAL3D.CageModeling.HomeState);
});
