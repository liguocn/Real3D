/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.CageModeling.HomeUI = {
};

REAL3D.CageModeling.HomeUI.enter = function () {
    "use strict";
    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div class="text">Cage建模</div>').appendTo('#toolBar');
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
    // $('<br>').appendTo('#toolBar');

    $('<button id="createCageBut" class="appButton">创建</button>').appendTo('#toolBar');
    $('#createCageBut').click(function () { that.enterCreateCage(); });
    $('<br>').appendTo('#toolBar');

    $('<button id="editCageBut" class="appButton">编辑</button>').appendTo('#toolBar');
    $('#editCageBut').click(function () { that.enterEditCage(); });
    $('<br>').appendTo('#toolBar');
};

REAL3D.CageModeling.HomeUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.CageModeling.HomeUI.translateControl = function () {
    "use strict";
    REAL3D.CageModeling.HomeControl.switchViewMode(REAL3D.CageModeling.ViewMode.TRANSLATE);
};

REAL3D.CageModeling.HomeUI.rotateControl = function () {
    "use strict";
    REAL3D.CageModeling.HomeControl.switchViewMode(REAL3D.CageModeling.ViewMode.ROTATE);
};

REAL3D.CageModeling.HomeUI.scaleControl = function () {
    "use strict";
    REAL3D.CageModeling.HomeControl.switchViewMode(REAL3D.CageModeling.ViewMode.SCALE);
};

REAL3D.CageModeling.HomeUI.normalizeView = function () {
    "use strict";
    REAL3D.CageModeling.HomeControl.resetView();
};

REAL3D.CageModeling.HomeUI.enterCreateCage = function () {
    "use strict";
    this.exit();
    REAL3D.CageModeling.enterState(REAL3D.CageModeling.CreateCageState);
    REAL3D.CageModeling.CreateCageUI.enter();
};

REAL3D.CageModeling.HomeUI.enterEditCage = function () {
    "use strict";
    this.exit();
    REAL3D.CageModeling.enterState(REAL3D.CageModeling.EditCageState);
    REAL3D.CageModeling.EditCageUI.enter();
};


