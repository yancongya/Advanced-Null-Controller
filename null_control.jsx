// 创建主面板
var win = new Window("dialog", "空对象控制器");
win.orientation = "column";
win.alignChildren = "fill";

// 创建选项组
var optionsGroup = win.add("panel", undefined, "选择要添加的控制");
optionsGroup.orientation = "column";
optionsGroup.alignChildren = "left";
optionsGroup.margins = 20;

// 添加复选框
var rotateCheck = optionsGroup.add("checkbox", undefined, "旋转");
var scaleCheck = optionsGroup.add("checkbox", undefined, "缩放");
var opacityCheck = optionsGroup.add("checkbox", undefined, "不透明度");

// 创建按钮组
var btnGroup = win.add("group");
btnGroup.orientation = "row";
btnGroup.alignment = "center";

var okBtn = btnGroup.add("button", undefined, "开搞", {name: "ok"});
var cancelBtn = btnGroup.add("button", undefined, "取消", {name: "cancel"});

// 计算所选图层的中心位置
function calculateCenterPosition(layers) {
    var xmin, xmax, ymin, ymax, zmin = Infinity, zmax = -Infinity;
    var allLayersAre3d = layers.every(function(layer) {
        return layer.threeDLayer;
    });

    layers.forEach(function(layer) {
        var position = layer.property("Position").value;
        xmin = xmin === undefined ? position[0] : Math.min(xmin, position[0]);
        xmax = xmax === undefined ? position[0] : Math.max(xmax, position[0]);
        ymin = ymin === undefined ? position[1] : Math.min(ymin, position[1]);
        ymax = ymax === undefined ? position[1] : Math.max(ymax, position[1]);
        if (allLayersAre3d) {
            var zPos = position[2] || 0;
            zmin = Math.min(zmin, zPos);
            zmax = Math.max(zmax, zPos);
        }
    });

    var xpos = (xmin + xmax) / 2;
    var ypos = (ymin + ymax) / 2;
    var zpos = allLayersAre3d ? (zmin + zmax) / 2 : 0;

    return allLayersAre3d ? [xpos, ypos, zpos] : [xpos, ypos];
}

// 创建空对象，并插入到指定图层的上方
function createNullObject(comp, name, size, position, insertLayer) {
    var nullLayer = comp.layers.addNull();
    nullLayer.moveBefore(insertLayer);
    nullLayer.name = name;
    nullLayer.source.name = name;
    nullLayer.source.width = size;
    nullLayer.source.height = size;
    if (position) {
        nullLayer.property("Position").setValue(position);
    }
    nullLayer.anchorPoint.setValue([size / 2, size / 2]);
    return nullLayer;
}

// 取消选中图层的父子级链接，返回原父级数组
function unlinkParents(layers) {
    var originalParents = [];
    layers.forEach(function(layer) {
        if (layer.parent !== null) {
            originalParents.push(layer.parent);
            layer.parent = null;
        }
    });
    return originalParents;
}

// 主要功能函数
function createNullControl() {
    app.beginUndoGroup("创建空对象控制器");
    
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("请选择合成！");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("请选择至少一个图层！");
        return;
    }

    var nullSize = 100;
    
    // 解除原有父子关系
    var originalParents = unlinkParents(selectedLayers);
    
    // 计算中心位置
    var centerPosition = calculateCenterPosition(selectedLayers);
    
    // 获取最上层的图层
    var topMostLayer = selectedLayers[0];
    selectedLayers.forEach(function(layer) {
        if (layer.index < topMostLayer.index) {
            topMostLayer = layer;
        }
    });

    // 创建空对象
    var nullLayerName = selectedLayers[0].name + "_控制器";
    var null_ctrl = createNullObject(comp, nullLayerName, nullSize, centerPosition, topMostLayer);

    // 将所有选中的图层设为空对象的子级
    selectedLayers.forEach(function(layer) {
        layer.parent = null_ctrl;
        
        // 添加表达式控制
        if (rotateCheck.value) {
            // 旋转表达式：补偿父级旋转
            layer.rotation.expression = 'value - parent.transform.rotation';
        }
        
        if (scaleCheck.value) {
            // 缩放表达式：补偿父级缩放
            layer.scale.expression = 's = [];\n' +
                'parentScale = parent.transform.scale.value;\n' +
                'for (i = 0; i < parentScale.length; i++){\n' +
                's[i] = (parentScale[i]== 0) ? 0 : value[i]*100/parentScale[i];\n' +
                '}\n' +
                's';
        }
        
        if (opacityCheck.value) {
            // 不透明度表达式：考虑父级不透明度和启用状态
            layer.opacity.expression = 'hasParent?parent.transform.opacity*parent.enabled:value';
        }
    });

    // 恢复原有父级关系
    if (originalParents.length > 0) {
        null_ctrl.parent = originalParents[0];
    }
    
    app.endUndoGroup();
}

// 按钮点击事件
okBtn.onClick = function() {
    createNullControl();
    win.close();
}

cancelBtn.onClick = function() {
    win.close();
}

// 显示面板
win.center();
win.show();
