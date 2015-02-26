/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

function enterInnerSpaceDesignEdit() {
    "use strict";
    var canvasElement, canvContainer, winW, winH;
    winW = $(window).width() - 240;
    winW = (winW < 1024) ? 1024 : winW;
    winH = $(window).height() - 90;
    winH = (winH < 640) ? 640 : winH;
    canvasElement = REAL3D.RenderManager.init(winW, winH);
    canvContainer = document.getElementById("designspace");
    canvContainer.appendChild(canvasElement);
    REAL3D.InnerSpaceDesignEdit.init(winW, winH, canvasElement);
    REAL3D.InnerSpaceDesignEdit.run();
}

function updateUIData() {
    "use strict";
    $('#designName').val(REAL3D.InnerSpaceDesignEdit.SceneData.designName);
    // $('#wallThick').val(REAL3D.InnerSpaceDesignEdit.SceneData.wallThick);
    // $('#wallHeight').val(REAL3D.InnerSpaceDesignEdit.SceneData.wallHeight);
}

function newWorkSpace() {
    "use strict";
    REAL3D.InnerSpaceDesignEdit.initUserData(null);
    updateUIData();
    //console.log("New Work Space");
}

function saveWorkSpace() {
    "use strict";
    var designName, postData;
    designName = $("#designName").val();
    if (designName === null || designName === '') {
        alert("请输入设计名字");
    } else if (designName === REAL3D.InnerSpaceDesignEdit.SceneData.designName) {
        REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData();
    } else {
        $.get("/InnerSpaceDesign/edit/findName", {designName: designName}, function (data) {
            console.log("  findName:", data);
            if (data.success === 1) {
                alert("设计", designName, "已经存在,不能覆盖");
            } else {
                //rename and save
                if (REAL3D.InnerSpaceDesignEdit.SceneData.designName === null || REAL3D.InnerSpaceDesignEdit.SceneData.designName === '') {
                    REAL3D.InnerSpaceDesignEdit.SceneData.designName = designName;
                    REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData();
                } else {
                    postData = {
                        originDesignName: REAL3D.InnerSpaceDesignEdit.SceneData.designName,
                        newDesignName: designName
                    };
                    $.post("/InnerSpaceDesign/edit/rename", $.param(postData, true), function (data) {
                        console.log("  rename result:", data);
                        if (data.success === 1) {
                            REAL3D.InnerSpaceDesignEdit.SceneData.designName = designName;
                            REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData();
                        } else {
                            alert("保存失败");
                        }
                    }, "json");
                }
            }
        }, "json");
    }
    console.log("Save Work Space");
}

function viewSwitch() {
    "use strict";
    if ($('#viewSwitch').text() === '2D') {
        $('#viewSwitch').text('3D');
        REAL3D.RenderManager.switchCamera(REAL3D.InnerSpaceDesignEdit.cameraOrthoName);
        REAL3D.InnerSpaceDesignEdit.viewState = REAL3D.InnerSpaceDesignEdit.EditWallView;
        REAL3D.InnerSpaceDesignEdit.SceneData.switchTo2DContent();
    } else {
        $('#viewSwitch').text('2D');
        REAL3D.RenderManager.switchCamera(REAL3D.InnerSpaceDesignEdit.cameraPerspName);
        REAL3D.InnerSpaceDesignEdit.viewState = REAL3D.InnerSpaceDesignEdit.FreeWalkView;
        REAL3D.InnerSpaceDesignEdit.SceneData.switchTo3DContent();
    }
}

function editModeSwitch() {
    "use strict";
    if ($('#editModeSwitch').text() === '删除') {
        $('#editModeSwitch').text('编辑');
        REAL3D.InnerSpaceDesignEdit.EditWallView.switchRemoveState(true);
        console.log("remove mode");
    } else {
        $('#editModeSwitch').text('删除');
        REAL3D.InnerSpaceDesignEdit.EditWallView.switchRemoveState(false);
    }
}

function enterToolWall() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar" class="wall"></div>').appendTo('#leftContainer');
    $('<div class="text">墙</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    $('<div">墙厚(cm)<input id="wallThick" class="parmNumCtl" type="number" min="1" max="50"></div>').appendTo('#toolBar');
    $('#wallThick').get(0).addEventListener("input", changeWallThick, false);
    $('#wallThick').val(REAL3D.InnerSpaceDesignEdit.SceneData.wallThick);
    
    $('<div>墙高(cm)<input id="wallHeight" class="parmNumCtl" type="number" min="100" max="500"></div>').appendTo('#toolBar');
    $('#wallHeight').get(0).addEventListener("input", changeWallHeight, false);
    $('#wallHeight').val(REAL3D.InnerSpaceDesignEdit.SceneData.wallHeight);
    $('<hr />').appendTo('#toolBar');
    
    $('<div>视角切换<button id="viewSwitch" class="button">3D</button></div>').appendTo('#toolBar');
    $('#viewSwitch').click(viewSwitch);
    $('<hr />').appendTo('#toolBar');

    $('<div>模式切换<button id="editModeSwitch" class="button">删除</button></div>').appendTo('#toolBar');
    $('#editModeSwitch').click(editModeSwitch);
    $('<hr />').appendTo('#toolBar');

    
    $('<button id="return" class="button">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolFurniture() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div>家具</div>').appendTo('#toolBar');

    $('<button id="return">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolLight() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div>灯光</div>').appendTo('#toolBar');

    $('<button id="return">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolMaterial() {
    "use strict";
    $('#toolBar').remove();

    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div>材质</div>').appendTo('#toolBar');

    $('<button id="return">返回</button>').appendTo('#toolBar');
    $('#return').click(function () {
        $('#toolBar').remove();
        enterToolHome();
    });
}

function enterToolHome() {
    "use strict";
    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div class="text">工具栏</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');
    
    $('<button id="wallBut" class="button">墙</button>').appendTo('#toolBar');
    $('#wallBut').click(enterToolWall);
    $('<br>').appendTo('#toolBar');
    
    $('<button id="furnitureBut" class="button">家具</button>').appendTo('#toolBar');
    $('#furnitureBut').click(enterToolFurniture);
    $('<br>').appendTo('#toolBar');

    $('<button id="lightBut" class="button">灯光</button>').appendTo('#toolBar');
    $('#lightBut').click(enterToolLight);
    $('<br>').appendTo('#toolBar');

    $('<button id="materialBut" class="button">材质</button>').appendTo('#toolBar');
    $('#materialBut').click(enterToolMaterial);
    $('<br>').appendTo('#toolBar');
    
    $('<button id="return" class="button">返回</button>').appendTo('#toolBar');
    $('#return').click(backToHome);
    $('<br>').appendTo('#toolBar');
}

function backToHome() {
    "use strict";
    window.location.href = "/InnerSpaceDesign";
}

function changeWallThick() {
    "use strict";
    //console.log("changeWallThick: ", $('#wallThick').val());
    REAL3D.InnerSpaceDesignEdit.SceneData.updateWallThick($('#wallThick').val());
}

function changeWallHeight() {
    "use strict";
    //console.log("changeWallHeight: ", $('#wallHeight').val());
    REAL3D.InnerSpaceDesignEdit.SceneData.updateWallHeight($('#wallHeight').val());
}

$(document).ready(function () {
    console.log("document is ready...");
    //init ui data
    enterToolHome();
    $('#newDesign').click(newWorkSpace);
    $('#saveDesign').click(saveWorkSpace);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');

    //init state
    enterInnerSpaceDesignEdit();

    //load user data
    console.log("load user data");
    var designName = $('#designName').val();
    console.log("designName: ", designName);
    if (designName !== '') {
        console.log("designName is ", designName);
        REAL3D.InnerSpaceDesignEdit.SceneData.designName = designName;
        REAL3D.InnerSpaceDesignEdit.SceneData.loadUserData(updateUIData);
    } else {
        console.log("designName is space");
    }
});
