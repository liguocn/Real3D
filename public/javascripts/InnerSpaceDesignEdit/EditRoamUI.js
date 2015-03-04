/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditRoamUI = {
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.enter = function () {
    "use strict";
    $('<div id="toolBar" class="roam"></div>').appendTo('#leftContainer');
    $('<div class="text">漫游</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;

    $('<div id="roamMode">漫游模式</div>').appendTo('#toolBar');
    $('<div><input type="radio" id="freeWalk" name="roamModeRadio">自由</div>').appendTo('#roamMode');
    $('#freeWalk').get(0).addEventListener("click", function () { that.switchToFreeWalkMode(); });
    $('<div><input type="radio" id="2dWalk" name="roamModeRadio">2D</div>').appendTo('#roamMode');
    $('#2dWalk').get(0).addEventListener("click", function () { that.switchTo2DWalkMode(); });
    $('<div><input type="radio" id="pathConstrainedWalk" name="roamModeRadio">路径约束</div>').appendTo('#roamMode');
    $('#pathConstrainedWalk').get(0).addEventListener("click", function () { that.switchToPathConstrainedWalkMode(); });
    $('<hr />').appendTo('#toolBar');
    $('#freeWalk').get(0).checked = true;


    $('<button id="return" class="button">首页</button>').appendTo('#toolBar');
    $('#return').click(function () { that.enterEditHome(); });
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.enterEditHome = function () {
    "use strict";
    this.exit();
    REAL3D.InnerSpaceDesignEdit.EditHomeUI.enter();
    REAL3D.InnerSpaceDesignEdit.enterState(REAL3D.InnerSpaceDesignEdit.EditHomeState);
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToFreeWalkMode = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchTo2DWalkMode = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToPathConstrainedWalkMode = function () {
    "use strict";
};
