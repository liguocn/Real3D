/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditWallUI = {

};

REAL3D.InnerSpaceDesignEdit.EditWallUI.changeWallThick = function () {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.WallData.updateWallThick($('#wallThick').val());
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.changeWallHeight = function () {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.WallData.updateWallHeight($('#wallHeight').val());
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.switchEditModeToCreate = function () {
    "use strict";
    console.log("switchEditModeToCreate: ", $('#create').get(0).checked);
    REAL3D.InnerSpaceDesignEdit.EditWallState.switchEditState(REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.CREATE);
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.switchEditModeToInsert = function () {
    "use strict";
    console.log("switchEditModeToInsert: ", $('#insert').get(0).checked);
    REAL3D.InnerSpaceDesignEdit.EditWallState.switchEditState(REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.INSERT);
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.switchEditModeToDelete = function () {
    "use strict";
    console.log("switchEditModeToDelete: ", $('#delete').get(0).checked);
    REAL3D.InnerSpaceDesignEdit.EditWallState.switchEditState(REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.DELETE);
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.switchEditModeToMerge = function () {
    "use strict";
    console.log("switchEditModeToMerge: ", $('#merge').get(0).checked);
    REAL3D.InnerSpaceDesignEdit.EditWallState.switchEditState(REAL3D.InnerSpaceDesignEdit.EditWallState.EDITSTATE.MERGE);
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.enter = function () {
    "use strict";

    $('<div id="toolBar" class="wall"></div>').appendTo('#leftContainer');
    $('<div class="text">墙</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;
    $('<div">墙厚(cm)<input id="wallThick" class="parmNumCtl" type="number" min="1" max="50"></div>').appendTo('#toolBar');
    $('#wallThick').get(0).addEventListener("input", function () { that.changeWallThick(); }, false);
    $('#wallThick').val(REAL3D.InnerSpaceDesignEdit.WallData.wallThick);
    $('<div>墙高(cm)<input id="wallHeight" class="parmNumCtl" type="number" min="100" max="500"></div>').appendTo('#toolBar');
    $('#wallHeight').get(0).addEventListener("input", function () { that.changeWallHeight(); }, false);
    $('#wallHeight').val(REAL3D.InnerSpaceDesignEdit.WallData.wallHeight);
    $('<hr />').appendTo('#toolBar');

    $('<div>视角切换<button id="viewSwitch" class="button">2D</button></div>').appendTo('#toolBar');
    $('#viewSwitch').click(function () { that.viewSwitch(); });
    $('<hr />').appendTo('#toolBar');

    $('<div id="editMode">编辑模式</div>').appendTo('#toolBar');
    $('<div><input type="radio" id="create" name="editRadio">创建</div>').appendTo('#editMode');
    $('#create').get(0).addEventListener("click", function () { that.switchEditModeToCreate(); });
    $('<div><input type="radio" id="insert" name="editRadio">插入</div>').appendTo('#editMode');
    $('#insert').get(0).addEventListener("click", function () { that.switchEditModeToInsert(); });
    $('<div><input type="radio" id="delete" name="editRadio">删除</div>').appendTo('#editMode');
    $('#delete').get(0).addEventListener("click", function () { that.switchEditModeToDelete(); });
    $('<div><input type="radio" id="merge" name="editRadio">合并</div>').appendTo('#editMode');
    $('#merge').get(0).addEventListener("click", function () { that.switchEditModeToMerge(); });
    $('<hr />').appendTo('#toolBar');
    $('#create').get(0).checked = true;

    $('<button id="return" class="button">首页</button>').appendTo('#toolBar');
    $('#return').click(function () { that.enterEditHome(); });
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.viewSwitch = function () {
    "use strict";
    if ($('#viewSwitch').text() === '2D') {
        REAL3D.InnerSpaceDesignEdit.EditWallState.switchControlState(REAL3D.InnerSpaceDesignEdit.EditWallState.CONTROLSTATE.WALK);
        $('#viewSwitch').text('3D');
        $('#create').get(0).disabled = true;
        $('#insert').get(0).disabled = true;
        $('#delete').get(0).disabled = true;
        $('#merge').get(0).disabled = true;
    } else {
        REAL3D.InnerSpaceDesignEdit.EditWallState.switchControlState(REAL3D.InnerSpaceDesignEdit.EditWallState.CONTROLSTATE.EDIT);
        $('#viewSwitch').text('2D');
        $('#create').get(0).disabled = false;
        $('#insert').get(0).disabled = false;
        $('#delete').get(0).disabled = false;
        $('#merge').get(0).disabled = false;
    }
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.enterEditHome = function () {
    "use strict";
    this.exit();
    REAL3D.InnerSpaceDesignEdit.EditHomeUI.enter();
    REAL3D.InnerSpaceDesignEdit.enterState(REAL3D.InnerSpaceDesignEdit.EditHomeState);
};
