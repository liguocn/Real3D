/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditWallUI = {

};

REAL3D.InnerSpaceDesignEdit.EditWallUI.changeWallThick = function () {
    "use strict";
    //REAL3D.InnerSpaceDesignEdit.SceneData.updateWallThick($('#wallThick').val());
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.changeWallHeight = function () {
    "use strict";
    //REAL3D.InnerSpaceDesignEdit.SceneData.updateWallHeight($('#wallHeight').val());
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.enter = function () {
    "use strict";

    $('<div id="toolBar" class="wall"></div>').appendTo('#leftContainer');
    $('<div class="text">墙</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;
    $('<div">墙厚(cm)<input id="wallThick" class="parmNumCtl" type="number" min="1" max="50"></div>').appendTo('#toolBar');
    $('#wallThick').get(0).addEventListener("input", function () { that.changeWallThick(); }, false);
    //$('#wallThick').val(REAL3D.InnerSpaceDesignEdit.SceneData.wallThick);
    $('#wallThick').val(90);

    $('<div>墙高(cm)<input id="wallHeight" class="parmNumCtl" type="number" min="100" max="500"></div>').appendTo('#toolBar');
    $('#wallHeight').get(0).addEventListener("input", function () { that.changeWallHeight(); }, false);
    //$('#wallHeight').val(REAL3D.InnerSpaceDesignEdit.SceneData.wallHeight);
    $('#wallHeight').val(250);
    $('<hr />').appendTo('#toolBar');

    $('<div>视角切换<button id="viewSwitch" class="button">2D</button></div>').appendTo('#toolBar');
    $('#viewSwitch').click(function () { that.viewSwitch(); });
    $('<hr />').appendTo('#toolBar');

    $('<div>模式切换<button id="editModeSwitch" class="button">删除</button></div>').appendTo('#toolBar');
    $('#editModeSwitch').click(function () { that.editModeSwitch(); });
    $('<hr />').appendTo('#toolBar');

    $('<button id="return" class="button">首页</button>').appendTo('#toolBar');
    $('#return').click(function () { that.enterEditHome(); });
}

REAL3D.InnerSpaceDesignEdit.EditWallUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.viewSwitch = function () {
    "use strict";
    // if ($('#viewSwitch').text() === '2D') {
    //     REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.FreeWalkView);
    //     REAL3D.InnerSpaceDesignEdit.SceneData.switchTo3DContent();
    //     $('#viewSwitch').text('3D');
    // } else if ($('#viewSwitch').text() === '3D') {
    //     REAL3D.InnerSpaceDesignEdit.switchControlState(REAL3D.InnerSpaceDesignEdit.EditWallView);
    //     REAL3D.InnerSpaceDesignEdit.SceneData.switchTo2DContent();
    //     $('#viewSwitch').text('编辑');
    // } else {
    //     REAL3D.InnerSpaceDesignEdit.switchControlState(null);
    //     REAL3D.InnerSpaceDesignEdit.SceneData.switchTo2DContent();
    //     $('#viewSwitch').text('2D');
    // }
}

REAL3D.InnerSpaceDesignEdit.EditWallUI.editModeSwitch = function () {
    "use strict";
    // if ($('#editModeSwitch').text() === '删除') {
    //     $('#editModeSwitch').text('编辑');
    //     REAL3D.InnerSpaceDesignEdit.EditWallView.switchRemoveState(true);
    //     console.log("remove mode");
    // } else {
    //     $('#editModeSwitch').text('删除');
    //     REAL3D.InnerSpaceDesignEdit.EditWallView.switchRemoveState(false);
    // }
};

REAL3D.InnerSpaceDesignEdit.EditWallUI.enterEditHome = function () {
    "use strict";
    this.exit();
    REAL3D.InnerSpaceDesignEdit.EditHomeUI.enter();
};
