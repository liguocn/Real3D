/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditRoamUI = {
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.enter = function () {
    "use strict";
    $('<div id="toolBar" class="roam"></div>').appendTo('#leftContainer');
    $('<div id="title" class="text">漫游</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;

    $('<div id="roamMode">漫游模式</div>').appendTo('#toolBar');
    $('<div><input type="radio" id="freeWalk" name="roamModeRadio">自由</div>').appendTo('#roamMode');
    $('#freeWalk').get(0).addEventListener("click", function () { that.switchToFreeWalkMode(); });
    $('<div><input type="radio" id="overhead" name="roamModeRadio">俯视</div>').appendTo('#roamMode');
    $('#overhead').get(0).addEventListener("click", function () { that.switchToOverheadWalkMode(); });
    $('<div><input type="radio" id="pathConstrainedWalk" name="roamModeRadio">路径约束</div>').appendTo('#roamMode');
    $('#pathConstrainedWalk').get(0).addEventListener("click", function () { that.switchToPathConstrainedWalkMode(); });
    $('<hr />').appendTo('#toolBar');
    $('#freeWalk').get(0).checked = true;

    this.addReturnButton();
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
    $('#pathEditTool').remove();
    REAL3D.InnerSpaceDesignEdit.EditRoamState.switchRoamMode(REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode.FREE);
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToOverheadWalkMode = function () {
    "use strict";
    $('#pathEditTool').remove();
    REAL3D.InnerSpaceDesignEdit.EditRoamState.switchRoamMode(REAL3D.InnerSpaceDesignEdit.EditRoamState.RoamMode.OVERHEAD);
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.addReturnButton = function () {
    "use strict";
    var that = this;
    $('<button id="return" class="button">首页</button>').appendTo('#toolBar');
    $('#return').click(function () { that.enterEditHome(); });
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.removeReturnButton = function () {
    "use strict";
    $('#return').remove();
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToPathConstrainedWalkMode = function () {
    "use strict";
    this.removeReturnButton();
    var that = this;
    $('<div id="pathEditTool">路径编辑</div>').appendTo('#toolBar');
    $('<div><input type="radio" id="create" name="pathEditRadio">创建</div>').appendTo('#pathEditTool');
    $('#create').get(0).addEventListener("click", function () { that.switchToCreatePathTool(); });
    $('<div><input type="radio" id="remove" name="pathEditRadio">删除</div>').appendTo('#pathEditTool');
    $('#remove').get(0).addEventListener("click", function () { that.switchToRemovePathTool(); });
    $('<div><input type="radio" id="insert" name="pathEditRadio">插入</div>').appendTo('#pathEditTool');
    $('#insert').get(0).addEventListener("click", function () { that.switchToInsertPathTool(); });
    $('<div><input type="radio" id="roamOnPath" name="pathEditRadio">漫游</div>').appendTo('#pathEditTool');
    $('#roamOnPath').get(0).addEventListener("click", function () { that.switchToRoamOnPath(); });
    $('<hr />').appendTo('#pathEditTool');
    $('#create').get(0).checked = true;
    this.addReturnButton();
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToCreatePathTool = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToRemovePathTool = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToInsertPathTool = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamUI.switchToRoamOnPath = function () {
    "use strict";
};


