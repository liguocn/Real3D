/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.GeneralDesignEdit.EditCurveUI = {
};

REAL3D.GeneralDesignEdit.EditCurveUI.enter = function () {
    "use strict";
    $('<div id="toolBar" class="curve"></div>').appendTo('#leftContainer');
    $('<div id="title" class="text">曲线</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;
    $('<div">光滑值<input id="smoothValue" class="parmNumCtl" type="number" min="0" max="1" step="0.1"></div>').appendTo('#toolBar');
    $('#smoothValue').get(0).addEventListener("input", function () { that.changeSmoothValue(); }, false);
    $('#smoothValue').val(REAL3D.GeneralDesignEdit.currentSmoothValue);
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

    this.addReturnButton();
};

REAL3D.GeneralDesignEdit.EditCurveUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.GeneralDesignEdit.EditCurveUI.enterEditHome = function () {
    "use strict";
    this.exit();
    REAL3D.GeneralDesignEdit.enterState(REAL3D.GeneralDesignEdit.EditHomeState);
    REAL3D.GeneralDesignEdit.EditHomeUI.enter();
};

REAL3D.GeneralDesignEdit.EditCurveUI.addReturnButton = function () {
    "use strict";
    var that = this;
    $('<button id="return" class="button">首页</button>').appendTo('#toolBar');
    $('#return').click(function () { that.enterEditHome(); });
};

REAL3D.GeneralDesignEdit.EditCurveUI.removeReturnButton = function () {
    "use strict";
    $('#return').remove();
};

REAL3D.GeneralDesignEdit.EditCurveUI.switchEditModeToCreate = function () {
    "use strict";
    //REAL3D.GeneralDesignEdit.EditCurveState.switchEditState(REAL3D.GeneralDesignEdit.EditCurveState.EDITSTATE.CREATE);
};

REAL3D.GeneralDesignEdit.EditCurveUI.switchEditModeToInsert = function () {
    "use strict";
    //REAL3D.GeneralDesignEdit.EditCurveState.switchEditState(REAL3D.GeneralDesignEdit.EditCurveState.EDITSTATE.INSERT);
};

REAL3D.GeneralDesignEdit.EditCurveUI.switchEditModeToDelete = function () {
    "use strict";
    //REAL3D.GeneralDesignEdit.EditCurveState.switchEditState(REAL3D.GeneralDesignEdit.EditCurveState.EDITSTATE.DELETE);
};

REAL3D.GeneralDesignEdit.EditCurveUI.switchEditModeToMerge = function () {
    "use strict";
    //REAL3D.GeneralDesignEdit.EditCurveState.switchEditState(REAL3D.GeneralDesignEdit.EditCurveState.EDITSTATE.MERGE);
};
