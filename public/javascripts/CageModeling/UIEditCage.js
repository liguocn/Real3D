/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.CageModeling.EditCageUI = {
};

REAL3D.CageModeling.EditCageUI.enter = function () {
    "use strict";
    var that = this;
    $('<div id="toolBar" class="editCage"></div>').appendTo('#leftContainer');

    $('<button id="createBut" class="button">新建</button>').appendTo('#toolBar');
    $('#createBut').click(function () { that.enterCreateCageUI(); });
    $('<hr />').appendTo('#toolBar');

    $('<button id="translateBut" class="topButton">T</button>').appendTo('#toolBar');
    $('#translateBut').click(function () { that.translateControl(); });
    $('<button id="rotateBut" class="topButton">R</button>').appendTo('#toolBar');
    $('#rotateBut').click(function () { that.rotateControl(); });
    $('<button id="scaleBut" class="topButton">S</button>').appendTo('#toolBar');
    $('#scaleBut').click(function () { that.scaleControl(); });
    $('<button id="normalizeViewBut" class="topButton">N</button>').appendTo('#toolBar');
    $('#normalizeViewBut').click(function () { that.normalizeView(); });
    $('<hr />').appendTo('#toolBar');
};

REAL3D.CageModeling.EditCageUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.CageModeling.EditCageUI.translateControl = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchTransformMode(REAL3D.CageModeling.TransformMode.TRANSLATE);
};

REAL3D.CageModeling.EditCageUI.rotateControl = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchTransformMode(REAL3D.CageModeling.TransformMode.ROTATE);
};

REAL3D.CageModeling.EditCageUI.scaleControl = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchTransformMode(REAL3D.CageModeling.TransformMode.SCALE);
};

REAL3D.CageModeling.EditCageUI.normalizeView = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.resetView();
};

REAL3D.CageModeling.EditCageUI.enterCreateCageUI = function () {
    "use strict";
    this.exit();
    REAL3D.CageModeling.enterState(REAL3D.CageModeling.CreateCageState);
    REAL3D.CageModeling.CreateCageUI.enter();
};
