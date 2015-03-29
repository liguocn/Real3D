/*global REAL3D, console, document, $, window, requestAnimationFrame */

REAL3D.InspectorEdit.FrameUI = {
    canvasElement: null,
    winW: null,
    winH: null
};

REAL3D.InspectorEdit.FrameUI.init = function () {
    "use strict";
    console.log("Initialize InspectorEdit UI..");

    $('#newDesign').click(REAL3D.InspectorEdit.FrameUI.newWorkSpace);
    $('#saveDesign').click(REAL3D.InspectorEdit.FrameUI.saveWorkSpace);
    $('#back').click(REAL3D.InspectorEdit.FrameUI.back);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');

    this.winW = $(window).width() - 240;
    this.winW = this.winW < 1024 ? 1024 : this.winW;
    this.winH = $(window).height() - 90;
    this.winH = this.winH < 640 ? 640 : this.winH;
    this.canvasElement = REAL3D.RenderManager.init(this.winW, this.winH);
    $('#designspace').append($(this.canvasElement));
    console.log("winW: ", this.winW, " winH: ", this.winH, " canvasElement: ", this.canvasElement);
};

REAL3D.InspectorEdit.FrameUI.updateFrameUIData = function () {
    "use strict";
    $('#designName').val(REAL3D.InspectorEdit.SceneData.designName);
};

REAL3D.InspectorEdit.FrameUI.newWorkSpace = function () {
    "use strict";
};

REAL3D.InspectorEdit.FrameUI.saveWorkSpace = function () {
    "use strict";
};

REAL3D.InspectorEdit.FrameUI.back = function () {
    "use strict";
    window.location.href = "/Inspector";
};

$(document).ready(function () {
    "use strict";
    console.log("InspectorEdit UI ready.");

    REAL3D.InspectorEdit.FrameUI.init();
    REAL3D.InspectorEdit.init(REAL3D.InspectorEdit.FrameUI.winW,
        REAL3D.InspectorEdit.FrameUI.winH,
        REAL3D.InspectorEdit.FrameUI.canvasElement);
    REAL3D.InspectorEdit.run();
    REAL3D.InspectorEdit.enterState(REAL3D.InspectorEdit.StateMaterial);
});