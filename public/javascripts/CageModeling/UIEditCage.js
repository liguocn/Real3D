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
    $('<div><input type="radio" id="editParm" name="editRadio">编辑</div>').appendTo('#editMode');
    $('#editParm').get(0).addEventListener("click", function () { that.switchEditModeToEditParm(); });
    $('<div><input type="radio" id="extrude" name="editRadio">挤出</div>').appendTo('#editMode');
    $('#extrude').get(0).addEventListener("click", function () { that.switchEditModeToExtrude(); });
    $('<div><input type="radio" id="split" name="editRadio">分割</div>').appendTo('#editMode');
    $('#split').get(0).addEventListener("click", function () { that.switchEditModeToSplit(); });
    $('<div><input type="radio" id="remove" name="editRadio">删除</div>').appendTo('#editMode');
    $('#remove').get(0).addEventListener("click", function () { that.switchEditModeToRemove(); });
    $('<div><input type="radio" id="merge" name="editRadio">融合</div>').appendTo('#editMode');
    $('#merge').get(0).addEventListener("click", function () { that.switchEditModeToMerge(); });
    $('<div><input type="radio" id="connect" name="editRadio">连接</div>').appendTo('#editMode');
    $('#connect').get(0).addEventListener("click", function () { that.switchEditModeToConnect(); });
    $('<hr />').appendTo('#toolBar');
    $('#editParm').get(0).checked = true;

    $('<div id="editOption"></div>').appendTo('#toolBar');
    this.switchEditModeToEditParm();
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
    $('<div">光滑值<input id="smoothValue" class="parmNumCtl" type="number" min="0" max="1" step="0.1"></div>').appendTo('#editOption');
    $('#smoothValue').get(0).addEventListener("input", function () { that.changeSmoothValue(); }, false);
    $('#smoothValue').val(0.5);
    $('<hr />').appendTo('#editOption');

    $('<div>平移值</div>').appendTo('#editOption');
    $('<div">X<input id="translateX" class="parmNumCtl" type="number" min="-1000" max="1000" step="1"></div>').appendTo('#editOption');
    $('#translateX').get(0).addEventListener("input", function () { that.translateX(); }, false);
    $('#translateX').val(0);
    $('<br>').appendTo('#editOption');

    $('<div">Y<input id="translateY" class="parmNumCtl" type="number" min="-1000" max="500" step="1"></div>').appendTo('#editOption');
    $('#translateY').get(0).addEventListener("input", function () { that.translateY(); }, false);
    $('#translateY').val(0);
    $('<br>').appendTo('#editOption');

    $('<div">Z<input id="translateZ" class="parmNumCtl" type="number" min="-1000" max="500" step="1"></div>').appendTo('#editOption');
    $('#translateZ').get(0).addEventListener("input", function () { that.translateZ(); }, false);
    $('#translateZ').val(0);
    $('<hr />').appendTo('#editOption');

    $('<div>放缩值</div>').appendTo('#editOption');
    $('<div">X<input id="ScaleX" class="parmNumCtl" type="number" min="0.01" max="100" step="0.01"></div>').appendTo('#editOption');
    $('#ScaleX').get(0).addEventListener("input", function () { that.scaleX(); }, false);
    $('#ScaleX').val(1);
    $('<br>').appendTo('#editOption');

    $('<div">Y<input id="ScaleY" class="parmNumCtl" type="number" min="0.001" max="1000" step="0.01"></div>').appendTo('#editOption');
    $('#ScaleY').get(0).addEventListener("input", function () { that.scaleY(); }, false);
    $('#ScaleY').val(1);
    $('<br>').appendTo('#editOption');

    $('<div">Z<input id="ScaleZ" class="parmNumCtl" type="number" min="0.001" max="1000" step="0.01"></div>').appendTo('#editOption');
    $('#ScaleZ').get(0).addEventListener("input", function () { that.scaleZ(); }, false);
    $('#ScaleZ').val(1);
    $('<hr />').appendTo('#editOption');

    $('<div>旋转值</div>').appendTo('#editOption');
    $('<div">X<input id="RotateX" class="parmNumCtl" type="number" min="-180" max="180" step="1"></div>').appendTo('#editOption');
    $('#RotateX').get(0).addEventListener("input", function () { that.rotateX(); }, false);
    $('#RotateX').val(1);
    $('<br>').appendTo('#editOption');

    $('<div">Y<input id="RotateY" class="parmNumCtl" type="number" min="-180" max="180" step="1"></div>').appendTo('#editOption');
    $('#RotateY').get(0).addEventListener("input", function () { that.rotateY(); }, false);
    $('#RotateY').val(1);
    $('<br>').appendTo('#editOption');

    $('<div">Z<input id="RotateZ" class="parmNumCtl" type="number" min="-180" max="180" step="1"></div>').appendTo('#editOption');
    $('#RotateZ').get(0).addEventListener("input", function () { that.rotateZ(); }, false);
    $('#RotateZ').val(1);
    $('<hr />').appendTo('#editOption');

    REAL3D.CageModeling.EditCageState.switchEditMode(REAL3D.CageModeling.EditMode.EDIT);
    REAL3D.CageModeling.CageData.generateOperation(false);
    REAL3D.CageModeling.EditCageControl.switchEditState(REAL3D.CageModeling.EditState.NONE);
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
};

REAL3D.CageModeling.EditCageUI.translateX = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.translateY = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.translateZ = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.scaleX = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.scaleY = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.scaleZ = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.rotateX = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.rotateY = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.rotateZ = function () {
    "use strict";
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
