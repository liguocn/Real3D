/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.CageModeling.CreateCageUI = {
};

REAL3D.CageModeling.CreateCageUI.enter = function () {
    "use strict";
    $('<div id="toolBar" class="createCage"></div>').appendTo('#leftContainer');
    $('<div class="text">创建Cage</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;
    $('<button id="translateBut" class="topButton">T</button>').appendTo('#toolBar');
    $('#translateBut').click(function () { that.translateControl(); });
    $('<button id="rotateBut" class="topButton">R</button>').appendTo('#toolBar');
    $('#rotateBut').click(function () { that.rotateControl(); });
    $('<button id="scaleBut" class="topButton">S</button>').appendTo('#toolBar');
    $('#scaleBut').click(function () { that.scaleControl(); });
    $('<button id="normalizeViewBut" class="topButton">N</button>').appendTo('#toolBar');
    $('#normalizeViewBut').click(function () { that.normalizeView(); });
    $('<hr />').appendTo('#toolBar');

    $('<button id="return" class="button">首页</button>').appendTo('#toolBar');
    $('#return').click(function () { that.enterHomeUI(); });
};

REAL3D.CageModeling.CreateCageUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.CageModeling.CreateCageUI.translateControl = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.switchTransformMode(REAL3D.CageModeling.TransformMode.TRANSLATE);
};

REAL3D.CageModeling.CreateCageUI.rotateControl = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.switchTransformMode(REAL3D.CageModeling.TransformMode.ROTATE);
};

REAL3D.CageModeling.CreateCageUI.scaleControl = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.switchTransformMode(REAL3D.CageModeling.TransformMode.SCALE);
};

REAL3D.CageModeling.CreateCageUI.normalizeView = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.resetView();
};

REAL3D.CageModeling.CreateCageUI.enterHomeUI = function () {
    "use strict";
    this.exit();
    REAL3D.CageModeling.enterState(REAL3D.CageModeling.HomeState);
    REAL3D.CageModeling.HomeUI.enter();
};
