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

    $('<div id="editMode">编辑模式</div>').appendTo('#toolBar');
    $('<div><input type="radio" id="extrude" name="editRadio">挤出</div>').appendTo('#editMode');
    $('#extrude').get(0).addEventListener("click", function () { that.switchEditModeToExtrude(); });
    $('<div><input type="radio" id="editParm" name="editRadio">编辑</div>').appendTo('#editMode');
    $('#editParm').get(0).addEventListener("click", function () { that.switchEditModeToEditParm(); });
    $('<div><input type="radio" id="split" name="editRadio">分割</div>').appendTo('#editMode');
    $('#split').get(0).addEventListener("click", function () { that.switchEditModeToSplit(); });
    $('<div><input type="radio" id="remove" name="editRadio">删除</div>').appendTo('#editMode');
    $('#remove').get(0).addEventListener("click", function () { that.switchEditModeToRemove(); });
    $('<div><input type="radio" id="merge" name="editRadio">融合</div>').appendTo('#editMode');
    $('#merge').get(0).addEventListener("click", function () { that.switchEditModeToMerge(); });
    $('<div><input type="radio" id="connect" name="editRadio">连接</div>').appendTo('#editMode');
    $('#connect').get(0).addEventListener("click", function () { that.switchEditModeToConnect(); });
    $('<hr />').appendTo('#toolBar');
    $('#extrude').get(0).checked = true;

    $('<div id="editOption"></div>').appendTo('#toolBar');
    this.switchEditModeToExtrude();
};

REAL3D.CageModeling.EditCageUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.CageModeling.EditCageUI.translateControl = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.TRANSLATE);
};

REAL3D.CageModeling.EditCageUI.rotateControl = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.ROTATE);
};

REAL3D.CageModeling.EditCageUI.scaleControl = function () {
    "use strict";
    REAL3D.CageModeling.EditCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.SCALE);
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

REAL3D.CageModeling.EditCageUI.switchEditModeToEditParm = function () {
    "use strict";
    $('#editOption').remove();

    var that = this;
    $('<div id="editOption"></div>').appendTo('#toolBar');
    $('<div">光滑值<input id="smoothValue" class="parmNumCtl" type="number" min="0" max="1" step="1"></div>').appendTo('#editOption');
    $('#smoothValue').get(0).addEventListener("input", function () { that.changeSmoothValue(); }, false);
    $('#smoothValue').val(1);
    $('<hr />').appendTo('#editOption');

    $('<div">平移值<input id="translateValue" class="parmNumCtl" type="number" min="-1000" max="1000" step="1"></div>').appendTo('#editOption');
    $('#translateValue').get(0).addEventListener("input", function () { that.changeTranslateValue(); }, false);
    $('#translateValue').val(0);
    $('<hr />').appendTo('#editOption');

    $('<div">放缩值<input id="scaleValue" class="parmNumCtl" type="number" min="0.01" max="100" step="0.01"></div>').appendTo('#editOption');
    $('#scaleValue').get(0).addEventListener("input", function () { that.changeScaleValue(); }, false);
    $('#scaleValue').val(1);
    $('<hr />').appendTo('#editOption');

    //this.configTransformUI(true, false, false);

    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.EDIT);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
    this.configTransformUI(true, true);
};

REAL3D.CageModeling.EditCageUI.switchEditModeToExtrude = function () {
    "use strict";
    $('#editOption').remove();

    var that = this;
    $('<div id="editOption"></div>').appendTo('#toolBar');

    $('<div">距离<input id="extrudeDistance" class="parmNumCtl" type="number" min="0" max="1000" step="1"></div>').appendTo('#editOption');
    $('#extrudeDistance').get(0).addEventListener("input", function () { that.changeExtrudeDistance(); }, false);
    $('#extrudeDistance').val(0);

    $('<button id="applyExtrude" class="applyButton">确认</button>').appendTo('#editOption');
    $('#applyExtrude').click(function () { that.applyExtrude(); });
    $('<hr />').appendTo('#editOption');

    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.EXTRUDE);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
};

REAL3D.CageModeling.EditCageUI.switchEditModeToSplit = function () {
    "use strict";
    $('#editOption').remove();

    var that = this;
    $('<div id="editOption"></div>').appendTo('#toolBar');

    $('<div">权重<input id="splitFaceWeight" class="parmNumCtl" type="number" min="0" max="1" step="0.1"></div>').appendTo('#editOption');
    $('#splitFaceWeight').get(0).addEventListener("input", function () { that.changeSplitFaceWeight(); }, false);
    $('#splitFaceWeight').val(0.5);
    $('<hr />').appendTo('#editOption');

    $('<div">边数<input id="splitEdgeCount" class="parmNumCtl" type="number" min="1" max="10" step="1"></div>').appendTo('#editOption');
    $('#splitEdgeCount').get(0).addEventListener("input", function () { that.changeSplitEdgeCount(); }, false);
    $('#splitEdgeCount').val(2);
    $('<hr />').appendTo('#editOption');

    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.SPLIT);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
};

REAL3D.CageModeling.EditCageUI.switchEditModeToRemove = function () {
    "use strict";
    $('#editOption').remove();
    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.DELETE);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
};

REAL3D.CageModeling.EditCageUI.switchEditModeToMerge = function () {
    "use strict";
    $('#editOption').remove();
    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.MERGE);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
};

REAL3D.CageModeling.EditCageUI.switchEditModeToConnect = function () {
    "use strict";
    $('#editOption').remove();

    var that = this;
    $('<div id="editOption"></div>').appendTo('#toolBar');

    $('<div"><input id="checkFillHole" type="checkbox" checked="false">补洞</div>').appendTo('#editOption');
    $('#checkFillHole').click(function () { that.checkFillHole(); });

    $('<hr />').appendTo('#editOption');
    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.CONNECT);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
};

REAL3D.CageModeling.EditCageUI.changeSmoothValue = function () {
    "use strict";
    var uiSmoothValue;
    uiSmoothValue = parseFloat($('#smoothValue').val());
    REAL3D.CageModeling.EditCageState.changeSmoothValue(uiSmoothValue);
};

REAL3D.CageModeling.EditCageUI.setSmoothValue = function (value) {
    "use strict";
    $('#smoothValue').val(value);
};

REAL3D.CageModeling.EditCageUI.changeTranslateValue = function () {
    "use strict";
    var curOp = REAL3D.CageModeling.CageData.getCurOperation();
    if (curOp !== null) {
        curOp.setValue(parseFloat($('#translateValue').val()));
        REAL3D.CageModeling.CageData.previewOperation();
        REAL3D.CageModeling.EditCageControl.updateTransformRefFramePosition();
    }
};

REAL3D.CageModeling.EditCageUI.setTranslateValue = function (value) {
    "use strict";
    $('#translateValue').val(value);
};

REAL3D.CageModeling.EditCageUI.changeScaleValue = function () {
    "use strict";
    var curOp = REAL3D.CageModeling.CageData.getCurOperation();
    if (curOp !== null) {
        curOp.setScaleValue(parseFloat($('#scaleValue').val()));
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.EditCageUI.setScaleValue = function (value) {
    "use strict";
    $('#scaleValue').val(value);
};

REAL3D.CageModeling.EditCageUI.configTransformUI = function (disableTranslate, disableScale) {
    "use strict";
    $('#translateValue').attr("disabled", disableTranslate);
    $('#scaleValue').attr("disabled", disableScale);
};

REAL3D.CageModeling.EditCageUI.changeExtrudeDistance = function () {
    "use strict";
    var curOp = REAL3D.CageModeling.CageData.getCurOperation();
    if (curOp !== null) {
        curOp.setDistance(parseFloat($('#extrudeDistance').val()));
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.EditCageUI.setExtrudeDistance = function (dist) {
    "use strict";
    //console.log(" setExtrudeDistance: ", dist);
    $('#extrudeDistance').val(dist);
};

REAL3D.CageModeling.EditCageUI.applyExtrude = function () {
    "use strict";
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
    this.setExtrudeDistance(0);
};

REAL3D.CageModeling.EditCageUI.changeSplitFaceWeight = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.changeSplitEdgeCount = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.checkFillHole = function () {
    "use strict";
    console.log("    checkFillHole: ", $('#checkFillHole').get(0).checked);
};
