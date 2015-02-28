/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.FrameUI = {
    canvasElement: null,
    winW: null,
    winH: null
};

REAL3D.InnerSpaceDesignEdit.FrameUI.init = function () {
    "use strict";
    //init ui data
    $('#newDesign').click(REAL3D.InnerSpaceDesignEdit.FrameUI.newWorkSpace);
    $('#saveDesign').click(REAL3D.InnerSpaceDesignEdit.FrameUI.saveWorkSpace);
    $('#back').click(REAL3D.InnerSpaceDesignEdit.FrameUI.back);
    $('<div id = "designspace" onselectstart="return false"></div>').appendTo('#mainContainer');
    REAL3D.InnerSpaceDesignEdit.EditHomeUI.enter();

    var canvContainer;
    this.winW = $(window).width() - 240;
    this.winW = (this.winW < 1024) ? 1024 : this.winW;
    this.winH = $(window).height() - 90;
    this.winH = (this.winH < 640) ? 640 : this.winH;
    this.canvasElement = REAL3D.RenderManager.init(this.winW, this.winH);
    canvContainer = document.getElementById("designspace");
    canvContainer.appendChild(this.canvasElement);
    console.log("winW: ", this.winW, " winH: ", this.winH, " canvasElement: ", this.canvasElement);
};

REAL3D.InnerSpaceDesignEdit.FrameUI.updateFrameUIData = function () {
    "use strict";
    $('#designName').val(REAL3D.InnerSpaceDesignEdit.SceneData.designName);
};

REAL3D.InnerSpaceDesignEdit.FrameUI.newWorkSpace = function () {
    "use strict";
    // REAL3D.InnerSpaceDesignEdit.initUserData(null);
    // updateUIData();
};

REAL3D.InnerSpaceDesignEdit.FrameUI.saveWorkSpace = function () {
    "use strict";
    // var designName, postData;
    // designName = $("#designName").val();
    // if (designName === null || designName === '') {
    //     alert("请输入设计名字");
    // } else if (designName === REAL3D.InnerSpaceDesignEdit.SceneData.designName) {
    //     REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData();
    // } else {
    //     $.get("/InnerSpaceDesign/edit/findName", {designName: designName}, function (data) {
    //         console.log("  findName:", data);
    //         if (data.success === 1) {
    //             alert("设计", designName, "已经存在,不能覆盖");
    //         } else {
    //             //rename and save
    //             if (REAL3D.InnerSpaceDesignEdit.SceneData.designName === null || REAL3D.InnerSpaceDesignEdit.SceneData.designName === '') {
    //                 REAL3D.InnerSpaceDesignEdit.SceneData.designName = designName;
    //                 REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData();
    //             } else {
    //                 postData = {
    //                     originDesignName: REAL3D.InnerSpaceDesignEdit.SceneData.designName,
    //                     newDesignName: designName
    //                 };
    //                 $.post("/InnerSpaceDesign/edit/rename", $.param(postData, true), function (data) {
    //                     console.log("  rename result:", data);
    //                     if (data.success === 1) {
    //                         REAL3D.InnerSpaceDesignEdit.SceneData.designName = designName;
    //                         REAL3D.InnerSpaceDesignEdit.SceneData.saveUserData();
    //                     } else {
    //                         alert("保存失败");
    //                     }
    //                 }, "json");
    //             }
    //         }
    //     }, "json");
    // }
};

REAL3D.InnerSpaceDesignEdit.FrameUI.back = function () {
    "use strict";
    window.location.href = "/InnerSpaceDesign";
};

$(document).ready(function () {
    "use strict";
    console.log("document is ready...");

    REAL3D.InnerSpaceDesignEdit.FrameUI.init();

    REAL3D.InnerSpaceDesignEdit.init(REAL3D.InnerSpaceDesignEdit.FrameUI.winW, 
        REAL3D.InnerSpaceDesignEdit.FrameUI.winH, 
        REAL3D.InnerSpaceDesignEdit.FrameUI.canvasElement);
    REAL3D.InnerSpaceDesignEdit.run();
    REAL3D.InnerSpaceDesignEdit.enterState(REAL3D.InnerSpaceDesignEdit.EditHomeState);

    //load user data
    // console.log("load user data");
    // var designName = $('#designName').val();
    // console.log("designName: ", designName);
    // if (designName !== '') {
    //     console.log("designName is ", designName);
    //     REAL3D.InnerSpaceDesignEdit.SceneData.designName = designName;
    //     REAL3D.InnerSpaceDesignEdit.SceneData.loadUserData(updateUIData);
    // } else {
    //     console.log("designName is space");
    // }
});
