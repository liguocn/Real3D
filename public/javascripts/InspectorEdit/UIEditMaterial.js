
REAL3D.InspectorEdit.EditMaterialUI = {

};

REAL3D.InspectorEdit.EditMaterialUI.getMaterials = function () {
    "use strict";
    return REAL3D.Inspector.MaterialDataManager.getAllMaterials();
};

REAL3D.InspectorEdit.EditMaterialUI.updateMaterials = function () {
    "use strict";
    var that = this;
    var materials = this.getMaterials();
    var restr = '';
    var i = 0, isSelected = false;
    var titles = ["序号", "当前", "name", "类型"];
    restr += '<tr>';
    for (i = 0; i < titles.length; ++i) {
        restr += ('<th><a>' + titles[i] + '</a></th>\n');
    }
    restr += '</tr>';

    for (i = 0; i < materials.length; ++i) {
        restr += '<tr>';
        restr += ('<td>' + (i+1) + '</td><td>');
        if (materials[i].isCurrent)
            restr += '<input type="radio" name="isSelected" checked="checked" value= ' + materials[i].name + '></input>';
        else
            restr += '<input type="radio" name="isSelected" value= ' + materials[i].name + '></input>';
        restr += ('</td>');

        restr += ('<td>' + materials[i].name + '</td><td>' + materials[i].type + '</td>');
        restr += '</tr>\n';
    }

    $('#materials').find('tbody').html(restr);
    $('input[name="isSelected"]').click( function (value) { that.switchMaterial(this.value); } );
}

REAL3D.InspectorEdit.EditMaterialUI.nodeSelected = function (event, data) {
    "use strict";
    console.log("Node selected: ", data, event);
};

REAL3D.InspectorEdit.EditMaterialUI.toggleMaterials = function () {
    "use strict";
    this.updateMaterials();
    $('#materials').toggle(100);
};

REAL3D.InspectorEdit.EditMaterialUI.switchMaterial = function (newMaterial) {
    "use strict";
    var newMaterialName = newMaterial;
    REAL3D.InspectorEdit.StateMaterial.switchMaterial(newMaterialName);
};

REAL3D.InspectorEdit.EditMaterialUI.enter = function () {
    "use strict";
    var that = this;
    //$('<div id="tree" class="viewtree"></div>').appendTo('#leftContainer');
    //$('#tree').treeview({data: this.getMaterials()});
    //$('#tree').on('nodeSelected', function(event, data) {that.nodeSelected(event, data);});

    //$('<button id="showMaterials" class="button">显示材质</div>').appendTo('#tree');
    //$('<hr />').appendTo('#tree');
    $('<div id = "btn_showMaterials" class = "button">显示材质</div>').appendTo('#leftContainer');
    $('#btn_showMaterials').click( function () { that.toggleMaterials(); } );
    $('<table id="materials" border="1" />').appendTo('#leftContainer');
    $('<tbody></tbody>').appendTo('#materials');
    $('#materials').hide();
};
