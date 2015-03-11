/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditHomeUI = {
};

REAL3D.InnerSpaceDesignEdit.EditHomeUI.enter = function () {
    "use strict";
    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div class="text">工具栏</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;
    $('<button id="wallBut" class="button">墙</button>').appendTo('#toolBar');
    $('#wallBut').click(function () { that.enterEditWall(); });
    $('<br>').appendTo('#toolBar');

    $('<button id="roamBut" class="button">漫游</button>').appendTo('#toolBar');
    $('#roamBut').click(function () { that.enterEditRoam(); });
    $('<br>').appendTo('#toolBar');
};

REAL3D.InnerSpaceDesignEdit.EditHomeUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.InnerSpaceDesignEdit.EditHomeUI.enterEditWall = function () {
    "use strict";
    this.exit();
    REAL3D.InnerSpaceDesignEdit.enterState(REAL3D.InnerSpaceDesignEdit.EditWallState);
    REAL3D.InnerSpaceDesignEdit.EditWallUI.enter();
};

REAL3D.InnerSpaceDesignEdit.EditHomeUI.enterEditRoam = function () {
    "use strict";
    this.exit();
    REAL3D.InnerSpaceDesignEdit.EditRoamUI.enter();
    REAL3D.InnerSpaceDesignEdit.enterState(REAL3D.InnerSpaceDesignEdit.EditRoamState);
};
