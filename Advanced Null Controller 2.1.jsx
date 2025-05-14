// Advanced Null Controller 2.1
// Version: 2024.03.27
// Author: 烟囱
// Repository: https://github.com/Tyc-github/Advanced-Null-Controller

// 定义仓库链接
var GITHUB_URL = "https://github.com/Tyc-github/Advanced-Null-Controller";
var GITEE_URL = "https://gitee.com/itycon/Advanced-Null-Controller";

// 创建主面板
var win = new Window("dialog", "Advanced Null Controller by 烟囱");
win.orientation = "column";
win.alignChildren = "fill";
win.spacing = 12; // 增加整体间距
win.margins = [12, 16, 12, 16]; // 优化边距

// 添加自定义绘制事件
win.graphics.onDraw = function() {
    var g = this;
    var bounds = [0, 0, win.size[0], win.size[1]];
    g.newPath();
    g.rectPath(bounds[0], bounds[1], bounds[2], bounds[3], 14); // 增加圆角
    g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [0.18, 0.18, 0.18, 1]));
    
    // 添加顶部渐变效果
    g.newPath();
    g.moveTo(bounds[0], bounds[1]);
    g.lineTo(bounds[2], bounds[1]);
    g.strokePath(g.newPen(g.PenType.SOLID_COLOR, [0.25, 0.25, 0.25, 0.8], 2));
}

// 修改面板样式函数
function createStyledPanel(parent, title) {
    var panel = parent.add("panel", undefined, title);
    panel.margins = [14, 14, 14, 14];
    panel.spacing = 16;
    
    // 设置面板标题样式
    panel.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.BOLD, 13);
    panel.graphics.foregroundColor = panel.graphics.newPen(panel.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    
    // 添加自定义绘制事件
    panel.graphics.onDraw = function() {
        var g = this;
        var bounds = [0, 0, panel.size[0], panel.size[1]];
        g.newPath();
        g.rectPath(bounds[0], bounds[1], bounds[2], bounds[3], 8);
        g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [0.22, 0.22, 0.22, 1]));
        
        // 添加边框效果
        g.newPath();
        g.rectPath(bounds[0], bounds[1], bounds[2], bounds[3], 8);
        g.strokePath(g.newPen(g.PenType.SOLID_COLOR, [0.28, 0.28, 0.28, 1], 1));
    }
    
    return panel;
}

// 添加顶部标题
var titleGroup = win.add("group");
titleGroup.alignment = "center";
titleGroup.margins = [0, 6, 0, 10];
var titleText = titleGroup.add("statictext", undefined, "高级空对象控制器 2.1");
titleText.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.BOLD, 16);
titleText.graphics.foregroundColor = titleText.graphics.newPen(titleText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);

// 创建主选项容器
var mainOptionsGroup = win.add("group");
mainOptionsGroup.orientation = "column";
mainOptionsGroup.alignChildren = "fill";
mainOptionsGroup.spacing = 10; // 调整面板间距
mainOptionsGroup.margins = [0, 2, 0, 2];

// 创建「选择要添加的控制」面板
var optionsGroup = createStyledPanel(mainOptionsGroup, "选择要添加的控制");
optionsGroup.orientation = "row";
optionsGroup.alignChildren = ["center", "center"];
optionsGroup.margins = [12, 20, 12, 16]; // 调整上边距，让复选框偏下
optionsGroup.spacing = 20;

// 添加主控制复选框
var checkboxGroup = optionsGroup.add("group");
checkboxGroup.orientation = "row";
checkboxGroup.alignChildren = ["center", "center"]; // 确保复选框水平和垂直都居中
checkboxGroup.spacing = 20;
checkboxGroup.margins = [0, 4, 0, 0]; // 微调复选框的垂直位置

var rotateCheck = createStyledCheckbox(checkboxGroup, "旋转");
var scaleCheck = createStyledCheckbox(checkboxGroup, "缩放");
var opacityCheck = createStyledCheckbox(checkboxGroup, "不透明度");

rotateCheck.value = true;
scaleCheck.value = true;
opacityCheck.value = true;

// 新增「高级控制」组
var advancedGroup = createStyledPanel(mainOptionsGroup, "高级控制");
advancedGroup.orientation = "row";
advancedGroup.alignChildren = ["center", "center"];
advancedGroup.margins = [10, 12, 10, 12]; // 增加内边距

// 在高级控制组内创建masterGroup，确保居中对齐
var masterGroup = advancedGroup.add("group");
masterGroup.orientation = "row";
masterGroup.alignment = "center";
masterGroup.alignChildren = ["center", "center"]; // 确保子元素居中对齐
masterGroup.spacing = 30; // 增加选项间距，使两个按钮更加分散

// 总控制文本标签
var masterText = createStyledText(masterGroup, "总控制", 70, true);
masterText.helpTip = "再套一层控制作为总控\n右键点击切换激活状态";

// 子控制文本标签
var childText = createStyledText(masterGroup, "子控制", 70, true);
childText.helpTip = "再套一层控制子级的属性\n右键点击切换激活状态";

// 新增「高级工具」组
var advancedToolsGroup = createStyledPanel(mainOptionsGroup, "高级工具");
advancedToolsGroup.orientation = "row";
advancedToolsGroup.alignChildren = ["center", "center"];
advancedToolsGroup.margins = [10, 12, 10, 12]; // 增加内边距

// 在高级工具组内创建toolsGroup
var toolsGroup = advancedToolsGroup.add("group");
toolsGroup.orientation = "row";
toolsGroup.alignment = "center";
toolsGroup.spacing = 15; // 增加选项间距

// 添加整体控制按钮到高级工具组
var globalControlBtn = createStyledText(toolsGroup, "整体控制", 70, true);
globalControlBtn.helpTip = "查找未控制图层，选中图层时创建整体控制器";

// 新增「层层空」按钮到高级工具组
var layerByLayerNullBtn = createStyledText(toolsGroup, "层层空", 70, true);
layerByLayerNullBtn.helpTip = "为每个选定图层分别创建一个父级空对象";

// 添加变量跟踪激活状态
var masterActive = false;
var childActive = false;

// 添加整体控制按钮事件
globalControlBtn.addEventListener('mouseover', function() {
    this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7, 1], 1);
});
globalControlBtn.addEventListener('mouseout', function() {
    this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
});
globalControlBtn.addEventListener('mousedown', function() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("请选择合成！");
        return;
    }

    // 检查是否已经选中了图层
    var selectedLayers = comp.selectedLayers;
    
    // 如果已经选中了图层，为它们创建一个共同的空对象控制器
    if (selectedLayers.length > 0) {
        app.beginUndoGroup("创建整体控制器");
        
        // 检查锁定图层
        var lockedLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].locked) {
                lockedLayers.push(selectedLayers[i]);
            }
        }

        // 如果有锁定图层，询问用户是否继续
        if (lockedLayers.length > 0) {
            var confirmLocked = confirm("检测到" + lockedLayers.length + "个锁定图层，是否临时解锁这些图层以创建控制器？\n解锁后会自动恢复锁定状态。");
            if (!confirmLocked) {
                alert("操作已取消");
                return;
            }
            // 临时解锁图层
            for (var i = 0; i < lockedLayers.length; i++) {
                lockedLayers[i].locked = false;
            }
        }

        // 过滤掉已经有父级的图层
        var validLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].parent === null) {
                validLayers.push(selectedLayers[i]);
            }
        }

        if (validLayers.length === 0) {
            alert("请选择至少一个没有父级的图层！");
            // 恢复锁定状态
            if (lockedLayers.length > 0) {
                for (var i = 0; i < lockedLayers.length; i++) {
                    lockedLayers[i].locked = true;
                }
            }
            return;
        }

        selectedLayers = validLayers; // 更新选中图层列表
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
        
        // 创建基础空对象
        var nullLayerName = "整体控制器";
        var ctrl = createNullObject(comp, nullLayerName, nullSize, centerPosition, topMostLayer);
        
        // 将所有有效图层设置为空对象的子级
        for (var i = 0; i < validLayers.length; i++) {
            validLayers[i].parent = ctrl;
        }
        
        app.endUndoGroup();
        alert("已为选中的 " + validLayers.length + " 个图层创建整体控制器");
    } else {
        // 如果没有选中图层，则查找未设置控制器的图层
        var layersWithoutController = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            // 修改逻辑：只有同时没有父级和没有控制器表达式的图层才被选中
            if (layer.parent === null && !hasControllerExpressions(layer)) {
                layersWithoutController.push(layer);
            }
        }

        // 如果找到未设置控制器的图层，选中它们
        if (layersWithoutController.length > 0) {
            // 取消所有图层的选择
            for (var i = 1; i <= comp.numLayers; i++) {
                comp.layer(i).selected = false;
            }
            // 选中未设置控制器的图层
            for (var i = 0; i < layersWithoutController.length; i++) {
                layersWithoutController[i].selected = true;
            }
            alert("已选中 " + layersWithoutController.length + " 个未设置控制器的图层");
        } else {
            alert("所有图层都已设置控制器！");
        }
    }
});
// 修改右键点击事件处理
masterText.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        masterActive = !masterActive;
        childActive = false;  // 互斥逻辑
        
        // 更新视觉反馈
        masterText.setActive(masterActive);
        childText.setActive(false);
        
        e.preventDefault();
    }
});

childText.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        childActive = !childActive;
        masterActive = false;  // 互斥逻辑
        
        // 更新视觉反馈
        childText.setActive(childActive);
        masterText.setActive(false);
        
        e.preventDefault();
    }
});

// 修改按钮组样式
var btnGroup = win.add("group");
btnGroup.orientation = "row";
btnGroup.alignment = "center";
btnGroup.margins = [0, 12, 0, 8]; // 调整按钮组边距
btnGroup.spacing = 15;

// 创建按钮
var mainBtn = createStyledButton(btnGroup, "开搞", [90, 32], true);
var cancelBtn = createStyledButton(btnGroup, "取消", [90, 32], false);
var helpBtn = createStyledButton(btnGroup, "?", [32, 32], false);

// 添加按钮提示
mainBtn.helpTip = "左键点击：创建控制器\n右键点击：切换到仅添加表达式模式";
cancelBtn.helpTip = "左键点击：关闭窗口\n右键点击：切换到清除控制器模式";
helpBtn.helpTip = "查看使用说明";

// 修改帮助按钮点击事件
helpBtn.onClick = showHelpPanel;

// 统一按钮文字颜色为白色
mainBtn.textPen = cancelBtn.textPen = helpBtn.textPen = mainBtn.graphics.newPen(mainBtn.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);

// 添加全局变量跟踪模式状态
var isExpressionMode = false;
var isClearMode = false;

// 修改主按钮右键菜单事件
mainBtn.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        isExpressionMode = !isExpressionMode;
        isClearMode = false;  // 互斥逻辑
        mainBtn.text = isExpressionMode ? "仅表达式" : "开搞";
        cancelBtn.text = "取消";  // 重置取消按钮文本
        e.preventDefault();
    }
});

// 修改取消按钮右键菜单事件
cancelBtn.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        isClearMode = !isClearMode;
        isExpressionMode = false;  // 互斥逻辑
        cancelBtn.text = isClearMode ? "清除" : "取消";
        mainBtn.text = "开搞";  // 重置开搞按钮文本
        e.preventDefault();
    }
});

// 修改按钮点击事件
mainBtn.onClick = function() {
    if (isExpressionMode) {
        addExpressionsOnly();
    } else {
        createNullControl();
    }
    win.close();
}

cancelBtn.onClick = function() {
    if (isClearMode) {
        clearNullControl();
    } else {
        win.close();
    }
}

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
    
    // 设置不透明度为100
    nullLayer.opacity.setValue(100);
    
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
    try {
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

        // 检查锁定图层
        var lockedLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].locked) {
                lockedLayers.push(selectedLayers[i]);
            }
        }

        // 如果有锁定图层，询问用户是否继续
        if (lockedLayers.length > 0) {
            var confirmLocked = confirm("检测到" + lockedLayers.length + "个锁定图层，是否临时解锁这些图层以创建控制器？\n解锁后会自动恢复锁定状态。");
            if (!confirmLocked) {
                alert("操作已取消");
                return;
            }
            // 临时解锁图层
            for (var i = 0; i < lockedLayers.length; i++) {
                lockedLayers[i].locked = false;
            }
        }

        // 过滤掉已经有父级的图层
        var validLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].parent === null) {
                validLayers.push(selectedLayers[i]);
            }
        }

        if (validLayers.length === 0) {
            alert("请选择至少一个没有父级的图层！");
            // 恢复锁定状态
            if (lockedLayers.length > 0) {
                for (var i = 0; i < lockedLayers.length; i++) {
                    lockedLayers[i].locked = true;
                }
            }
            return;
        }

        selectedLayers = validLayers; // 更新选中图层列表
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
        // 创建基础空对象（第一个空对象）
        var nullLayerName = selectedLayers[0].name + "_控制器";
        var base_ctrl = createNullObject(comp, nullLayerName, nullSize, centerPosition, topMostLayer);
        
        // 创建Master控制器（最大的空对象）
        var master_ctrl = null;
        if (masterActive) {
            var masterNullName = selectedLayers[0].name + "_Master控制";
            master_ctrl = createNullObject(comp, masterNullName, nullSize * 1.5, centerPosition, base_ctrl);
        }
        // 创建子控制器（中等尺寸）
        var child_ctrl = null;
        if (childActive) {
            var childNullName = selectedLayers[0].name + "_子控制";
            child_ctrl = createNullObject(comp, childNullName, nullSize * 1.2, centerPosition, base_ctrl);
        }
        
        // 建立层级关系
        if (childActive) {
            if (masterActive) {
                child_ctrl.parent = master_ctrl;
            }
            base_ctrl.parent = child_ctrl;
            // 始终为第一个控制器添加表达式
            if (rotateCheck.value) {
                base_ctrl.rotation.expression = 'value - parent.transform.rotation';
            }
            if (scaleCheck.value) {
                base_ctrl.scale.expression = 's = [];\n' +
                    'parentScale = parent.transform.scale.value;\n' +
                    'for (i = 0; i < parentScale.length; i++){\n' +
                    's[i] = (parentScale[i]== 0) ? 0 : value[i]*100/parentScale[i];\n' +
                    '}\n' +
                    's';
            }
            if (opacityCheck.value) {
                base_ctrl.opacity.expression = 'hasParent?parent.transform.opacity*parent.enabled:value';
            }
        } else if (masterActive) {
            base_ctrl.parent = master_ctrl;
        } else if (master_ctrl) {
            base_ctrl.parent = master_ctrl;
        }
        // 建立完整的层级链
        var currentParent = base_ctrl;
        if (child_ctrl) currentParent = child_ctrl;
        if (master_ctrl) currentParent = master_ctrl;
        // 恢复父级关系
        if (originalParents.length > 0) {
            currentParent.parent = originalParents[0];
        }
        // 将所有选中的图层绑定到基础控制器
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            layer.parent = base_ctrl;  // 始终绑定到基础控制器
            
            // 添加表达式控制，不检查父级关系
            if (rotateCheck.value) {
                layer.rotation.expression = 'value - parent.transform.rotation';
            }
            
            if (scaleCheck.value) {
                layer.scale.expression = 's = [];\n' +
                    'parentScale = parent.transform.scale.value;\n' +
                    'for (i = 0; i < parentScale.length; i++){\n' +
                    's[i] = (parentScale[i]== 0) ? 0 : value[i]*100/parentScale[i];\n' +
                    '}\n' +
                    's';
            }
            
            if (opacityCheck.value) {
                layer.opacity.expression = 'hasParent?parent.transform.opacity*parent.enabled:value';
            }
        }

        // 恢复父级关系时使用最顶层的控制器
        if (originalParents.length > 0) {
            var topController = child_ctrl || (master_ctrl || base_ctrl);
            topController.parent = originalParents[0];
        }
        
        app.endUndoGroup();
        return true;
    } catch (err) {
        alert("发生错误：" + err.toString());
        return false;
    }
}
// 检查图层是否有控制器表达式
function hasControllerExpressions(layer) {
    var hasExpressions = false;
    
    try {
        if (layer.rotation.expression) {
            hasExpressions = hasExpressions || layer.rotation.expression.indexOf('value - parent.transform.rotation') !== -1;
        }
        
        if (layer.scale.expression) {
            hasExpressions = hasExpressions || layer.scale.expression.indexOf('parentScale = parent.transform.scale.value') !== -1;
        }
        
        if (layer.opacity.expression) {
            hasExpressions = hasExpressions || layer.opacity.expression.indexOf('hasParent?parent.transform.opacity*parent.enabled:value') !== -1;
        }
    } catch (err) {
        return false;
    }
    
    return hasExpressions;
}

// 清除控制器功能
function clearNullControl() {
    try {
        app.beginUndoGroup("清除表达式");
        
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

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            
            // 保存当前变换值
            var currentRotation = layer.rotation.value;
            var currentScale = layer.scale.value;
            var currentOpacity = layer.opacity.value;
            
            // 清除表达式
            try {
                if (layer.rotation.expression) {
                    layer.rotation.expression = '';
                }
                if (layer.scale.expression) {
                    layer.scale.expression = '';
                }
                if (layer.opacity.expression) {
                    layer.opacity.expression = '';
                }
            } catch (err) {
                // 忽略表达式清除错误
            }
            
            // 恢复变换值
            layer.rotation.setValue(currentRotation);
            layer.scale.setValue(currentScale);
            layer.opacity.setValue(currentOpacity);
        }
        
        app.endUndoGroup();
        return true;
    } catch (err) {
        alert("清除时发生错误：" + err.toString());
        return false;
    }
}

// 添加仅表达式功能
function addExpressionsOnly() {
    try {
        app.beginUndoGroup("添加表达式控制");
        
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

        // 检查是否选择了至少一个属性
        if (!rotateCheck.value && !scaleCheck.value && !opacityCheck.value) {
            alert("请选择至少一个要添加表达式的属性！");
            return;
        }

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            
            // 添加表达式，不检查父级关系
            if (rotateCheck.value) {
                try {
                    layer.rotation.expression = 'value - parent.transform.rotation';
                } catch (err) {
                    alert("添加旋转表达式时出错: " + err.toString());
                }
            }
            
            if (scaleCheck.value) {
                try {
                    layer.scale.expression = 's = [];\n' +
                        'parentScale = parent.transform.scale.value;\n' +
                        'for (i = 0; i < parentScale.length; i++){\n' +
                        's[i] = (parentScale[i]== 0) ? 0 : value[i]*100/parentScale[i];\n' +
                        '}\n' +
                        's';
                } catch (err) {
                    alert("添加缩放表达式时出错: " + err.toString());
                }
            }
            
            if (opacityCheck.value) {
                try {
                    layer.opacity.expression = 'hasParent?parent.transform.opacity*parent.enabled:value';
                } catch (err) {
                    alert("添加不透明度表达式时出错: " + err.toString());
                }
            }
        }
        
        app.endUndoGroup();
        return true;
    } catch (err) {
        alert("添加表达式时发生错误：" + err.toString());
        return false;
    }
}

// 创建帮助面板函数
function showHelpPanel() {
    var helpDialog = new Window("dialog", "使用说明");
    helpDialog.orientation = "column";
    helpDialog.alignChildren = "fill";
    helpDialog.margins = 14;
    helpDialog.spacing = 8;
    
    // 添加标题样式
    function addTitle(text) {
        var title = helpDialog.add("statictext", undefined, text);
        title.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.BOLD, 13);
        title.graphics.foregroundColor = title.graphics.newPen(title.graphics.PenType.SOLID_COLOR, [0.3, 0.6, 0.9, 1], 1);
        return title;
    }
    
    // 添加内容样式
    function addContent(text) {
        var content = helpDialog.add("statictext", undefined, text);
        content.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 12);
        content.graphics.foregroundColor = content.graphics.newPen(content.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
        content.margins = [10, 0, 0, 0];
        return content;
    }
    
    // 添加分隔线
    function addSeparator() {
        var separator = helpDialog.add("panel");
        separator.alignment = "fill";
        separator.height = 1;
        return separator;
    }

    // 创建链接按钮样式
    function createLinkButton(parent, text, icon, url) {
        var btnGroup = parent.add("group");
        btnGroup.orientation = "row";
        btnGroup.spacing = 5;
        btnGroup.alignChildren = ["left", "center"];
        
        // 添加图标
        var iconText = btnGroup.add("statictext", undefined, icon);
        iconText.graphics.font = ScriptUI.newFont("Arial", ScriptUI.FontStyle.REGULAR, 13);
        iconText.graphics.foregroundColor = iconText.graphics.newPen(iconText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
        
        // 添加链接文本
        var linkText = btnGroup.add("statictext", undefined, text);
        linkText.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 12);
        linkText.graphics.foregroundColor = linkText.graphics.newPen(linkText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
        
        // 鼠标事件
        var isHovered = false;
        var isClicked = false;
        
        // 为图标和文本分别添加事件
        function addHoverEvents(element) {
            element.addEventListener('mouseover', function() {
                if (!isHovered) {
                    linkText.graphics.foregroundColor = linkText.graphics.newPen(linkText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
                    iconText.graphics.foregroundColor = iconText.graphics.newPen(iconText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
                    linkText.text = text;
                    iconText.text = icon;
                    isHovered = true;
                }
            });
            
            element.addEventListener('mouseout', function() {
                if (isHovered) {
                    linkText.graphics.foregroundColor = linkText.graphics.newPen(linkText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
                    iconText.graphics.foregroundColor = iconText.graphics.newPen(iconText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
                    linkText.text = text;
                    iconText.text = icon;
                    isHovered = false;
                }
            });
        }
        
        // 为图标和文本分别添加点击事件
        function addClickEvent(element) {
            element.addEventListener('mousedown', function() {
                if (!isClicked) {
                    isClicked = true;
                    system.callSystem('cmd.exe /c start "" "' + url + '"');
                    $.sleep(500);
                    isClicked = false;
                }
            });
        }
        
        // 添加事件监听
        addHoverEvents(iconText);
        addHoverEvents(linkText);
        addClickEvent(linkText);  // 只在文本上添加点击事件
        
        return btnGroup;
    }
    
    addTitle("基本操作：");
    addContent("1. 选择要控制的图层");
    addContent("2. 勾选需要添加的控制属性");
    addContent("3. 点击'开搞'创建控制器");
    
    addSeparator();
    
    addTitle("高级选项：");
    addContent("- 总控制：右键点击激活，添加一个总控制器");
    addContent("- 子控制：右键点击激活，添加一个子级控制器");
    addContent("- 整体选中：查找未控制图层，选中图层时创建整体控制器");
    
    addSeparator();
    
    addTitle("按钮功能：");
    addContent("- 开搞（左键）：创建控制器");
    addContent("- 开搞（右键）：仅添加表达式");
    addContent("- 取消（右键）：清除控制器");
    
    addSeparator();
    
    addTitle("相关：");

    // 添加说明文本
    var descGroup = helpDialog.add("group");
    descGroup.orientation = "column";
    descGroup.alignChildren = "left";
    descGroup.margins = [10, 4, 10, 0]; // 减小底部边距

    var descText = descGroup.add("statictext", undefined, "本脚本已经开源，可以去GitHub或Gitee查看项目，可以的话求求去爱发电支持下我！获取更新和提交bug", {multiline: true});
    descText.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 12);
    descText.graphics.foregroundColor = descText.graphics.newPen(descText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
    descText.preferredSize.width = 380;

    // 添加链接按钮组
    var linksGroup = helpDialog.add("group");
    linksGroup.orientation = "row";
    linksGroup.alignChildren = ["left", "center"];
    linksGroup.margins = [10, 2, 0, 4]; // 减小顶部边距

    // 使用更通用的ASCII字符作为图标
    createLinkButton(linksGroup, "Bilibili", "₪", "https://space.bilibili.com/100881808");
    createLinkButton(linksGroup, "资持下我", "₪", "https://afdian.com/item/2c972f4608a411f09e8e52540025c377");
    createLinkButton(linksGroup, "小红书", "₪", "https://www.xiaohongshu.com/user/profile/5c009931f7e8b962bb328c6d");
    createLinkButton(linksGroup, "Gitee", "₪", GITEE_URL);
    createLinkButton(linksGroup, "GitHub", "₪", GITHUB_URL);

    addSeparator();

    // 添加按钮组
    var btnGroup = helpDialog.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignment = "center";
    btnGroup.margins = [0, 12, 0, 0];
    btnGroup.spacing = 8;
    
    var closeBtn = createStyledButton(btnGroup, "关闭", [75, 28], true);
    closeBtn.onClick = function() {
        helpDialog.close();
    };
    
    helpDialog.center();
    helpDialog.show();
}

// 修改按钮样式函数
function createStyledButton(parent, text, size, isPrimary) {
    var btn = parent.add("button", [0, 0, size[0], size[1]], text);
    btn.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 13);
    
    // 设置基础样式
    var normalColor = isPrimary ? [0.25, 0.25, 0.25, 1] : [0.22, 0.22, 0.22, 1];
    var hoverColor = isPrimary ? [0.3, 0.3, 0.3, 1] : [0.27, 0.27, 0.27, 1];
    var activeColor = isPrimary ? [0.2, 0.2, 0.2, 1] : [0.18, 0.18, 0.18, 1];
    
    // 设置按钮背景色
    btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, normalColor);
    
    // 添加鼠标事件
    btn.addEventListener('mouseover', function() {
        this.fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, hoverColor);
        this.notify("onDraw");
    });
    
    btn.addEventListener('mouseout', function() {
        this.fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, normalColor);
        this.notify("onDraw");
    });
    
    btn.addEventListener('mousedown', function() {
        this.fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, activeColor);
        this.notify("onDraw");
    });
    
    btn.addEventListener('mouseup', function() {
        this.fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, hoverColor);
        this.notify("onDraw");
    });
    
    // 设置按钮文字颜色为白色
    btn.graphics.foregroundColor = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    
    return btn;
}

// 修改复选框样式
function createStyledCheckbox(parent, text) {
    var checkbox = parent.add("checkbox", undefined, text);
    checkbox.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 13);
    
    var normalColor = [0.9, 0.9, 0.9, 1];
    var hoverColor = [1, 1, 1, 1];
    var activeColor = [1, 1, 1, 1];
    
    checkbox.graphics.foregroundColor = checkbox.graphics.newPen(checkbox.graphics.PenType.SOLID_COLOR, normalColor, 1);
    
    // 添加鼠标事件
    checkbox.addEventListener('mouseover', function() {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, hoverColor, 1);
    });
    
    checkbox.addEventListener('mouseout', function() {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, 
            this.value ? activeColor : normalColor, 1);
    });
    
    checkbox.addEventListener('click', function() {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR,
            this.value ? activeColor : normalColor, 1);
    });
    
    return checkbox;
}

// 创建带样式的文本标签
function createStyledText(parent, text, width, isClickable) {
    var textLabel = parent.add("statictext", undefined, text);
    textLabel.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 13);
    textLabel.graphics.foregroundColor = textLabel.graphics.newPen(textLabel.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    
    if (width) {
        textLabel.preferredSize.width = width;
    }
    
    if (isClickable) {
        // 添加鼠标事件
        textLabel.addEventListener('mouseover', function() {
            if (!this.isActive) {  // 只在非激活状态下改变颜色
                this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7, 1], 1);
            }
        });
        
        textLabel.addEventListener('mouseout', function() {
            if (!this.isActive) {  // 只在非激活状态下恢复颜色
                this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
            }
        });

        // 添加设置激活状态的方法
        textLabel.setActive = function(active) {
            this.isActive = active;
            this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, 
                active ? [0.3, 0.8, 0.3, 1] : [1, 1, 1, 1], 1);
        };
    }
    
    return textLabel;
}

// 显示面板
win.center();
win.show();

// 为「层层空」按钮添加鼠标悬停和移开事件
layerByLayerNullBtn.addEventListener('mouseover', function() {
    this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7, 1], 1);
});
layerByLayerNullBtn.addEventListener('mouseout', function() {
    this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
});

// 「层层空」按钮点击事件
layerByLayerNullBtn.addEventListener('mousedown', function() {
    alert("层层空按钮被点击！"); // 调试信息
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

    app.beginUndoGroup("创建层层空");

    var createdCount = 0;
    var nullSize = 100; // 可以根据需要调整空对象大小

    for (var i = 0; i < selectedLayers.length; i++) {
        var targetLayer = selectedLayers[i];

        if (targetLayer.locked) {
            var confirmUnlock = confirm("图层 \"" + targetLayer.name + "\" 已锁定，是否临时解锁以创建控制器？\n解锁后会自动恢复锁定状态。");
            if (confirmUnlock) {
                targetLayer.locked = false;
            } else {
                alert("已跳过锁定的图层: " + targetLayer.name);
                continue; 
            }
        }
        
        // 记录原始父级，如果需要稍后恢复或有其他复杂逻辑
        // var originalParent = targetLayer.parent;

        // 创建空对象
        var nullLayerName = targetLayer.name + "_层层空";
        // 将空对象创建在目标图层的正上方
        var newNull = comp.layers.addNull(comp.duration);
        newNull.name = nullLayerName;
        newNull.source.name = nullLayerName; // 确保源名称也更改
        newNull.moveBefore(targetLayer);

        // 设置空对象属性
        newNull.property("Position").setValue(targetLayer.property("Position").value);
        newNull.property("Anchor Point").setValue(targetLayer.property("Anchor Point").value);
        // 如果图层是3D的，也复制3D属性
        if (targetLayer.threeDLayer) {
            newNull.threeDLayer = true;
            newNull.property("Orientation").setValue(targetLayer.property("Orientation").value);
            newNull.property("X Rotation").setValue(targetLayer.property("X Rotation").value);
            newNull.property("Y Rotation").setValue(targetLayer.property("Y Rotation").value);
        }
        newNull.source.width = nullSize;
        newNull.source.height = nullSize;
        newNull.opacity.setValue(100);


        // 将目标图层链接到新的空对象
        targetLayer.parent = newNull;
        
        // 如果之前临时解锁了，现在恢复锁定
        if (confirmUnlock && targetLayer.locked === false) { // 确保只在之前解锁过且现在未锁定的情况下才锁定
             targetLayer.locked = true;
        }

        createdCount++;
    }

    app.endUndoGroup();
    if (createdCount > 0) {
        alert("已为 " + createdCount + " 个选定图层创建了层层空。");
    } else {
        alert("没有为任何图层创建层层空。");
    }
});
