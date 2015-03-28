/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.CageModeling.CreateCageUI = {
    cenPosX: 0,
    cenPosY: 0,
    cenPosZ: 0,
    boxLenX: 100,
    boxLenY: 100,
    boxLenZ: 100,
    torusInnerRadius: 50,
    torusOuterRadius: 100,
    torusRadialSegments: 1,
    torusCircularSegments: 6
};

REAL3D.CageModeling.CreateCageUI.enter = function () {
    "use strict";
    var that = this;
    $('<div id="toolBar" class="createCage"></div>').appendTo('#leftContainer');

    $('<button id="editBut" class="button">编辑</button>').appendTo('#toolBar');
    $('#editBut').click(function () { that.enterEditCageUI(); });
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

    $('<div class="text">创建类型</div>').appendTo('#toolBar');
    $('<select id="createType" class="selectType"></select>').appendTo('#toolBar');
    $('#createType').change(function() { that.changeCreateType(); });
    $('<option id="boxType" selected>长方体</option>').appendTo('#createType');
    $('#boxType').val(REAL3D.CageModeling.CreateCageUI.CreateType.BOX);
    $('<option id="torusType">环体</option>').appendTo('#createType');
    $('#torusType').val(REAL3D.CageModeling.CreateCageUI.CreateType.TORUS);
    $('<option id="sweepType">扫略面</option>').appendTo('#createType');
    $('#sweepType').val(REAL3D.CageModeling.CreateCageUI.CreateType.SWEEP);
    $('<option id="templateType">模板</option>').appendTo('#createType');
    $('#templateType').val(REAL3D.CageModeling.CreateCageUI.CreateType.TEMPLATE);
    $('<hr />').appendTo('#toolBar');
    $('<div id="parameters"></div>').appendTo('#toolBar');
    this.switchToBoxType();
};

REAL3D.CageModeling.CreateCageUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.CageModeling.CreateCageUI.translateControl = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.TRANSLATE);
};

REAL3D.CageModeling.CreateCageUI.rotateControl = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.ROTATE);
};

REAL3D.CageModeling.CreateCageUI.scaleControl = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.switchViewMode(REAL3D.CageModeling.ViewMode.SCALE);
};

REAL3D.CageModeling.CreateCageUI.normalizeView = function () {
    "use strict";
    REAL3D.CageModeling.CreateCageControl.resetView();
};

REAL3D.CageModeling.CreateCageUI.enterEditCageUI = function () {
    "use strict";
    REAL3D.CageModeling.CageData.generateOperation();
    this.exit();
    REAL3D.CageModeling.enterState(REAL3D.CageModeling.EditCageState);
    REAL3D.CageModeling.EditCageUI.enter();
};

REAL3D.CageModeling.CreateCageUI.changeCreateType = function () {
    "use strict";
    if ($('#createType').val() == REAL3D.CageModeling.CreateCageUI.CreateType.BOX) {
        this.switchToBoxType();
    } else if ($('#createType').val() == REAL3D.CageModeling.CreateCageUI.CreateType.TORUS) {
        this.switchToTorusType();
    } else if ($('#createType').val() == REAL3D.CageModeling.CreateCageUI.CreateType.SWEEP) {
        this.switchToSweepType();
    } else if ($('#createType').val() == REAL3D.CageModeling.CreateCageUI.CreateType.TEMPLATE) {
        this.switchToTemplateType();
    }
};

REAL3D.CageModeling.CreateCageUI.switchToBoxType = function () {
    "use strict";
    var that;
    that = this;
    $('#parameters').remove();
    $('<div id="parameters"></div>').appendTo('#toolBar');

    $('<div>中心位置</div>').appendTo('#parameters');
    $('<div">X<input id="boxPositionX" class="parmNumCtl" type="number" min="-500" max="1000" step="1"></div>').appendTo('#parameters');
    $('#boxPositionX').get(0).addEventListener("input", function () { that.changeBoxPositionX(); }, false);
    $('#boxPositionX').val(this.cenPosX);
    $('<br>').appendTo('#parameters');

    $('<div">Y<input id="boxPositionY" class="parmNumCtl" type="number" min="-500" max="500" step="1"></div>').appendTo('#parameters');
    $('#boxPositionY').get(0).addEventListener("input", function () { that.changeBoxPositionY(); }, false);
    $('#boxPositionY').val(this.cenPosY);
    $('<br>').appendTo('#parameters');

    $('<div">Z<input id="boxPositionZ" class="parmNumCtl" type="number" min="-500" max="500" step="1"></div>').appendTo('#parameters');
    $('#boxPositionZ').get(0).addEventListener("input", function () { that.changeBoxPositionZ(); }, false);
    $('#boxPositionZ').val(this.cenPosZ);
    $('<hr />').appendTo('#parameters');


    $('<div>大小</div>').appendTo('#parameters');
    $('<div">长(cm)<input id="boxLengthX" class="parmNumCtl" type="number" min="10" max="1000" step="1"></div>').appendTo('#parameters');
    $('#boxLengthX').get(0).addEventListener("input", function () { that.changeBoxLengthX(); }, false);
    $('#boxLengthX').val(this.boxLenX);
    $('<br>').appendTo('#parameters');

    $('<div">宽(cm)<input id="boxLengthZ" class="parmNumCtl" type="number" min="10" max="1000" step="1"></div>').appendTo('#parameters');
    $('#boxLengthZ').get(0).addEventListener("input", function () { that.changeBoxLengthZ(); }, false);
    $('#boxLengthZ').val(this.boxLenY);
    $('<br>').appendTo('#parameters');

    $('<div">高(cm)<input id="boxLengthY" class="parmNumCtl" type="number" min="10" max="1000" step="1"></div>').appendTo('#parameters');
    $('#boxLengthY').get(0).addEventListener("input", function () { that.changeBoxLengthY(); }, false);
    $('#boxLengthY').val(this.boxLenZ);
    $('<hr />').appendTo('#parameters');

    REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.CreateBox(this.cenPosX, this.cenPosY, this.cenPosZ, this.boxLenX, this.boxLenY, this.boxLenZ));
    REAL3D.CageModeling.CageData.previewOperation();

    // $('<div>分段数</div>').appendTo('#parameters');
    // $('<div">长<input id="boxSegmentsX" class="parmNumCtl" type="number" min="1" max="10"></div>').appendTo('#parameters');
    // $('#boxSegmentsX').get(0).addEventListener("input", function () { that.changeBoxSegmentsX(); }, false);
    // $('#boxSegmentsX').val(1);
    // $('<br>').appendTo('#parameters');

    // $('<div">宽<input id="boxSegmentsY" class="parmNumCtl" type="number" min="1" max="10"></div>').appendTo('#parameters');
    // $('#boxSegmentsY').get(0).addEventListener("input", function () { that.changeBoxSegmentsY(); }, false);
    // $('#boxSegmentsY').val(1);
    // $('<br>').appendTo('#parameters');

    // $('<div">高<input id="boxSegmentsZ" class="parmNumCtl" type="number" min="1" max="10"></div>').appendTo('#parameters');
    // $('#boxSegmentsZ').get(0).addEventListener("input", function () { that.changeBoxSegmentsZ(); }, false);
    // $('#boxSegmentsZ').val(1);
    // $('<hr />').appendTo('#parameters');
};

REAL3D.CageModeling.CreateCageUI.switchToTorusType = function () {
    "use strict";
    var that = this;
    $('#parameters').remove();
    $('<div id="parameters"></div>').appendTo('#toolBar');

    $('<div>中心位置</div>').appendTo('#parameters');
    $('<div">X<input id="torusPositionX" class="parmNumCtl" type="number" min="-1000" max="1000"></div>').appendTo('#parameters');
    $('#torusPositionX').get(0).addEventListener("input", function () { that.changeTorusPositionX(); }, false);
    $('#torusPositionX').val(0);
    $('<br>').appendTo('#parameters');

    $('<div">Y<input id="torusPositionY" class="parmNumCtl" type="number" min="-1000" max="1000"></div>').appendTo('#parameters');
    $('#torusPositionY').get(0).addEventListener("input", function () { that.changeTorusPositionY(); }, false);
    $('#torusPositionY').val(0);
    $('<br>').appendTo('#parameters');

    $('<div">Z<input id="torusPositionZ" class="parmNumCtl" type="number" min="-1000" max="1000"></div>').appendTo('#parameters');
    $('#torusPositionZ').get(0).addEventListener("input", function () { that.changeTorusPositionZ(); }, false);
    $('#torusPositionZ').val(0);
    $('<hr />').appendTo('#parameters');


    $('<div>大小</div>').appendTo('#parameters');
    $('<div">内半径(cm)<input id="torusInnerRadius" class="parmNumCtl" type="number" min="1" max="1000"></div>').appendTo('#parameters');
    $('#torusInnerRadius').get(0).addEventListener("input", function () { that.changeTorusInnerRadius(); }, false);
    $('#torusInnerRadius').val(50);
    $('<br>').appendTo('#parameters');

    $('<div">外半径(cm)<input id="torusOuterRadius" class="parmNumCtl" type="number" min="1" max="1000"></div>').appendTo('#parameters');
    $('#torusOuterRadius').get(0).addEventListener("input", function () { that.changeTorusOuterRadius(); }, false);
    $('#torusOuterRadius').val(100);
    $('<hr />').appendTo('#parameters');


    $('<div>分段数</div>').appendTo('#parameters');
    $('<div">半径<input id="torusRadialSegments" class="parmNumCtl" type="number" min="1" max="1000"></div>').appendTo('#parameters');
    $('#torusRadialSegments').get(0).addEventListener("input", function () { that.changeTorusRadialSegments(); }, false);
    $('#torusRadialSegments').val(1);
    $('<br>').appendTo('#parameters');

    $('<div">圆环<input id="torusCircularSegments" class="parmNumCtl" type="number" min="1" max="1000"></div>').appendTo('#parameters');
    $('#torusCircularSegments').get(0).addEventListener("input", function () { that.TorusCircularSegments(); }, false);
    $('#torusCircularSegments').val(6);
    $('<hr />').appendTo('#parameters');
};

REAL3D.CageModeling.CreateCageUI.switchToSweepType = function () {
    "use strict";
    var that = this;
    $('#parameters').remove();
    $('<div id="parameters"></div>').appendTo('#toolBar');
};

REAL3D.CageModeling.CreateCageUI.switchToTemplateType = function () {
    "use strict";
    var that = this;
    $('#parameters').remove();
    $('<div id="parameters"></div>').appendTo('#toolBar');
};

REAL3D.CageModeling.CreateCageUI.changeBoxPositionX = function () {
    "use strict";
    var curOperation = REAL3D.CageModeling.CageData.getOperation();
    if (curOperation !== null) {
        curOperation.cenPosX = parseFloat($('#boxPositionX').val());
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.CreateCageUI.changeBoxPositionY = function () {
    "use strict";
    var curOperation = REAL3D.CageModeling.CageData.getOperation();
    if (curOperation !== null) {
        curOperation.cenPosY = parseFloat($('#boxPositionY').val());
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.CreateCageUI.changeBoxPositionZ = function () {
    "use strict";
    var curOperation = REAL3D.CageModeling.CageData.getOperation();
    if (curOperation !== null) {
        curOperation.cenPosZ = parseFloat($('#boxPositionZ').val());
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.CreateCageUI.changeBoxLengthX = function () {
    "use strict";
    var curOperation = REAL3D.CageModeling.CageData.getOperation();
    if (curOperation !== null) {
        curOperation.lenX = parseFloat($('#boxLengthX').val());
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.CreateCageUI.changeBoxLengthY = function () {
    "use strict";
    var curOperation = REAL3D.CageModeling.CageData.getOperation();
    if (curOperation !== null) {
        curOperation.lenY = parseFloat($('#boxLengthY').val());
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

REAL3D.CageModeling.CreateCageUI.changeBoxLengthZ = function () {
    "use strict";
    var curOperation = REAL3D.CageModeling.CageData.getOperation();
    if (curOperation !== null) {
        curOperation.lenZ = parseFloat($('#boxLengthZ').val());
        REAL3D.CageModeling.CageData.previewOperation();
    }
};

// REAL3D.CageModeling.CreateCageUI.changeBoxSegmentsX = function () {
//     "use strict";
// };

// REAL3D.CageModeling.CreateCageUI.changeBoxSegmentsY = function () {
//     "use strict";
// };

// REAL3D.CageModeling.CreateCageUI.changeBoxSegmentsZ = function () {
//     "use strict";
// };

REAL3D.CageModeling.CreateCageUI.changeTorusPositionX = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.changeTorusPositionY = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.changeTorusPositionZ = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.changeTorusInnerRadius = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.changeTorusOuterRadius = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.changeTorusRadialSegments = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.changeTorusCircularSegments = function () {
    "use strict";
};

REAL3D.CageModeling.CreateCageUI.CreateType = {
    BOX: 0,
    TORUS: 1,
    SWEEP: 2,
    TEMPLATE: 3
};
