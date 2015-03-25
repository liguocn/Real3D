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
    $('<div><input type="radio" id="editParm" name="editRadio">参数编辑</div>').appendTo('#editMode');
    $('#editParm').get(0).addEventListener("click", function () { that.switchEditModeToEditParm(); });
    $('<div><input type="radio" id="extrude" name="editRadio">挤出</div>').appendTo('#editMode');
    $('#extrude').get(0).addEventListener("click", function () { that.switchEditModeToExtrude(); });
    $('<div><input type="radio" id="transform" name="editRadio">移动</div>').appendTo('#editMode');
    $('#transform').get(0).addEventListener("click", function () { that.switchEditModeToTransform(); });
    $('<div><input type="radio" id="split" name="editRadio">分割</div>').appendTo('#editMode');
    $('#split').get(0).addEventListener("click", function () { that.switchEditModeToSplit(); });
    $('<div><input type="radio" id="remove" name="editRadio">删除</div>').appendTo('#editMode');
    $('#remove').get(0).addEventListener("click", function () { that.switchEditModeToRemove(); });
    $('<div><input type="radio" id="merge" name="editRadio">合并</div>').appendTo('#editMode');
    $('#merge').get(0).addEventListener("click", function () { that.switchEditModeToMerge(); });
    $('<div><input type="radio" id="connect" name="editRadio">连接</div>').appendTo('#editMode');
    $('#connect').get(0).addEventListener("click", function () { that.switchEditModeToConnect(); });
    $('<hr />').appendTo('#toolBar');
    $('#editParm').get(0).checked = true;
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

REAL3D.CageModeling.EditCageUI.switchEditModeToEditParm = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.switchEditModeToExtrude = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.switchEditModeToTransform = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.switchEditModeToSplit = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.switchEditModeToRemove = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.switchEditModeToMerge = function () {
    "use strict";
};

REAL3D.CageModeling.EditCageUI.switchEditModeToConnect = function () {
    "use strict";
};
