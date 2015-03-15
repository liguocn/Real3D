/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.GeneralDesignEdit.FrameUI = {
    canvasElement: null,
    winW: null,
    winH: null
};

REAL3D.GeneralDesignEdit.FrameUI.init = function () {
    "use strict";
    //init ui data
    $('#newDesign').click(REAL3D.GeneralDesignEdit.FrameUI.newWorkSpace);
    $('#saveDesign').click(REAL3D.GeneralDesignEdit.FrameUI.saveWorkSpace);
    $('#back').click(REAL3D.GeneralDesignEdit.FrameUI.back);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');
    //REAL3D.InnerSpaceDesignEdit.EditHomeUI.enter();

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

REAL3D.GeneralDesignEdit.FrameUI.newWorkSpace = function () {
    "use strict";
};

REAL3D.GeneralDesignEdit.FrameUI.saveWorkSpace = function () {
    "use strict";
};

REAL3D.GeneralDesignEdit.FrameUI.back = function () {
    "use strict";
    window.location.href = "/GeneralDesign";
};

$(document).ready(function () {
    "use strict";
    console.log("document is ready...");

    REAL3D.GeneralDesignEdit.FrameUI.init();

    REAL3D.GeneralDesignEdit.init(REAL3D.GeneralDesignEdit.FrameUI.winW,
        REAL3D.GeneralDesignEdit.FrameUI.winH,
        REAL3D.GeneralDesignEdit.FrameUI.canvasElement);
    REAL3D.GeneralDesignEdit.run();
});
