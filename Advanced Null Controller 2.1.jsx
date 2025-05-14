// Advanced Null Controller 2.1
// Version: 2024.03.27
// Author: 烟囱
// Repository: https://github.com/Tyc-github/Advanced-Null-Controller

// 定义仓库链接
var GITHUB_URL = "https://github.com/Tyc-github/Advanced-Null-Controller";
var GITEE_URL = "https://gitee.com/itycon/Advanced-Null-Controller";

// --- 全局变量 ---
var masterActive = false;
var childActive = false;
var isExpressionMode = false;
var isClearMode = false;

// --- 辅助函数定义 ---

// UI 创建相关函数

/**
 * 创建一个带有自定义样式的 Panel 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} title 面板标题。
 * @returns {Panel} 创建的 Panel 对象。
 */
function createStyledPanel(parent, title) {
    var panel = parent.add("panel", undefined, title);
    panel.margins = [14, 14, 14, 14];
    panel.spacing = 16;
    panel.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.BOLD, 13);
    panel.graphics.foregroundColor = panel.graphics.newPen(panel.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    panel.graphics.onDraw = function() {
        var g = this;
        var bounds = [0, 0, panel.size[0], panel.size[1]];
        g.newPath();
        g.rectPath(bounds[0], bounds[1], bounds[2], bounds[3], 8);
        g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [0.22, 0.22, 0.22, 1]));
        g.newPath();
        g.rectPath(bounds[0], bounds[1], bounds[2], bounds[3], 8);
        g.strokePath(g.newPen(g.PenType.SOLID_COLOR, [0.28, 0.28, 0.28, 1], 1));
    };
    return panel;
}

/**
 * 创建一个带有自定义样式的 Button 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} text 按钮显示的文本。
 * @param {Array<Number>} size 按钮的尺寸 [width, height]。
 * @param {Boolean} isPrimary 是否为主按钮样式。
 * @returns {Button} 创建的 Button 对象。
 */
function createStyledButton(parent, text, size, isPrimary) {
    var btn = parent.add("button", [0, 0, size[0], size[1]], text);
    btn.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 13);
    var normalColor = isPrimary ? [0.25, 0.25, 0.25, 1] : [0.22, 0.22, 0.22, 1];
    var hoverColor = isPrimary ? [0.3, 0.3, 0.3, 1] : [0.27, 0.27, 0.27, 1];
    var activeColor = isPrimary ? [0.2, 0.2, 0.2, 1] : [0.18, 0.18, 0.18, 1];
    btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, normalColor);
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
    btn.graphics.foregroundColor = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    return btn;
}

/**
 * 创建一个带有自定义样式的 Checkbox 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} text Checkbox 标签文本。
 * @returns {Checkbox} 创建的 Checkbox 对象。
 */
function createStyledCheckbox(parent, text) {
    var checkbox = parent.add("checkbox", undefined, text);
    checkbox.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 13);
    var normalColor = [0.9, 0.9, 0.9, 1];
    var hoverColor = [1, 1, 1, 1];
    var activeColor = [1, 1, 1, 1];
    checkbox.graphics.foregroundColor = checkbox.graphics.newPen(checkbox.graphics.PenType.SOLID_COLOR, normalColor, 1);
    checkbox.addEventListener('mouseover', function() {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, hoverColor, 1);
    });
    checkbox.addEventListener('mouseout', function() {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, this.value ? activeColor : normalColor, 1);
    });
    checkbox.addEventListener('click', function() {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, this.value ? activeColor : normalColor, 1);
    });
    return checkbox;
}

/**
 * 创建一个带有自定义样式的 StaticText 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} text 静态文本内容。
 * @param {Number} [width] 可选，文本控件的期望宽度。
 * @param {Boolean} [isClickable] 可选，文本是否可点击并具有激活状态。
 * @returns {StaticText} 创建的 StaticText 对象。
 */
function createStyledText(parent, text, width, isClickable) {
    var textLabel = parent.add("statictext", undefined, text);
    textLabel.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 13);
    textLabel.graphics.foregroundColor = textLabel.graphics.newPen(textLabel.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    if (width) {
        textLabel.preferredSize.width = width;
    }
    if (isClickable) {
        textLabel.addEventListener('mouseover', function() {
            if (!this.isActive) {
    this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7, 1], 1);
            }
});
        textLabel.addEventListener('mouseout', function() {
            if (!this.isActive) {
    this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
            }
        });
        textLabel.setActive = function(active) {
            this.isActive = active;
            this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, active ? [0.3, 0.8, 0.3, 1] : [1, 1, 1, 1], 1);
        };
    }
    return textLabel;
}

// 逻辑辅助函数

/**
 * 获取当前活动的合成 (Composition)。
 * 如果没有活动合成或活动项不是合成，则提示用户并返回 null。
 * @returns {CompItem|null} 当前活动的合成对象，或 null。
 */
function getActiveComp() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("请选择合成！");
        return null;
    }
    return comp;
    }

/**
 * 获取选中的图层，并进行有效性验证。
 * @param {CompItem} comp 要从中获取图层的合成对象。
 * @returns {Array<Layer>|null} 选中的图层数组，如果无选中图层或 comp 为 null 则返回 null。
 */
function getSelectedLayersWithValidation(comp) {
    if (!comp) return null;
    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("请选择至少一个图层！");
        return null;
    }
    return selectedLayers;
}

/**
 * 处理选定图层中的锁定图层。
 * 如果检测到锁定图层，会提示用户是否临时解锁。
 * @param {Array<Layer>} layers 要检查的图层数组。
 * @returns {{cancel: Boolean, layersToRestoreLock: Array<Layer>}}
 *      一个对象，包含:
 *      - cancel: (Boolean) 用户是否取消了操作。
 *      - layersToRestoreLock: (Array<Layer>) 被临时解锁的图层数组，用于后续恢复锁定状态。
 */
function handleLockedLayers(layers) {
        var lockedLayers = [];
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].locked) {
            lockedLayers.push(layers[i]);
            }
        }
        if (lockedLayers.length > 0) {
            var confirmLocked = confirm("检测到" + lockedLayers.length + "个锁定图层，是否临时解锁这些图层以创建控制器？\n解锁后会自动恢复锁定状态。");
            if (!confirmLocked) {
                alert("操作已取消");
            return { cancel: true, layersToRestoreLock: [] };
            }
            for (var i = 0; i < lockedLayers.length; i++) {
                lockedLayers[i].locked = false;
            }
        return { cancel: false, layersToRestoreLock: lockedLayers };
    }
    return { cancel: false, layersToRestoreLock: [] };
        }

/**
 * 从图层数组中筛选出没有父级的图层。
 * @param {Array<Layer>} layers 要筛选的图层数组。
 * @returns {Array<Layer>|null} 没有父级的图层数组，如果所有图层都有父级或输入为空则返回 null。
 */
function filterLayersWithoutParent(layers) {
        var validLayers = [];
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].parent === null) {
            validLayers.push(layers[i]);
            }
        }
        if (validLayers.length === 0) {
        // alert("请选择至少一个没有父级的图层！"); // 提示信息可以根据上下文调整或移除 (保留此注释供开发者参考)
        return null;
            }
    return validLayers;
}

/**
 * 计算并返回所选图层集合的中心位置。
 * 支持2D和3D图层。对于3D图层，会计算X, Y, Z的中心；对于2D图层，Z轴默认为0。
 * @param {Array<Layer>} layers 图层数组。
 * @returns {Array<Number>} 包含中心位置坐标的数组 ([x, y] 或 [x, y, z])。
 */
function calculateCenterPosition(layers) {
    var xmin, xmax, ymin, ymax, zmin = Infinity, zmax = -Infinity;
    var allLayersAre3d = layers.every(function(layer) { return layer.threeDLayer; });
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

/**
 * 创建一个新的空对象 (Null Layer)。
 * @param {CompItem} comp 要在其中创建空对象的合成。
 * @param {String} name 空对象的名称。
 * @param {Number} size 空对象的尺寸 (source.width 和 source.height)。
 * @param {Array<Number>} [position] 可选，空对象的位置 [x, y] 或 [x, y, z]。
 * @param {Layer} [insertLayer] 可选，空对象将插入到此图层之前。
 * @returns {Layer} 创建的空对象图层。
 */
function createNullObject(comp, name, size, position, insertLayer) {
    var nullLayer = comp.layers.addNull();
    if (insertLayer && insertLayer.isValid) nullLayer.moveBefore(insertLayer);
    nullLayer.name = name;
    nullLayer.source.name = name;
    nullLayer.source.width = size;
    nullLayer.source.height = size;
    if (position) {
        nullLayer.property("Position").setValue(position);
    }
    nullLayer.anchorPoint.setValue([size / 2, size / 2]);
    nullLayer.opacity.setValue(100);
    return nullLayer;
}

/**
 * 解除指定图层数组中所有图层的父子关系。
 * @param {Array<Layer>} layers 要解除父子关系的图层数组。
 * @returns {Array<{layer: Layer, parent: Layer}>} 包含原始父级信息的对象数组。
 *          每个对象有 'layer' (子图层) 和 'parent' (原始父图层) 属性。
 */
function unlinkParents(layers) {
    var originalParentsInfo = [];
    layers.forEach(function(layer) {
        if (layer.parent !== null) {
            originalParentsInfo.push({ layer: layer, parent: layer.parent });
            layer.parent = null;
        }
    });
    return originalParentsInfo;
}

/**
 * 为指定图层应用反向控制表达式。
 * 根据传入的布尔参数决定为旋转、缩放、不透明度属性添加表达式。
 * 表达式用于抵消父级图层的对应变换。
 * @param {Layer} layer 要应用表达式的图层。
 * @param {Boolean} applyRotate 是否应用旋转表达式。
 * @param {Boolean} applyScale 是否应用缩放表达式。
 * @param {Boolean} applyOpacity 是否应用不透明度表达式。
 */
function applyExpressionsToLayer(layer, applyRotate, applyScale, applyOpacity) {
    if (!layer || !layer.isValid) return;

    try {
        var rProp = layer.property("Rotation") || layer.property("Z Rotation");
        if (applyRotate && rProp && rProp.canSetExpression) {
             if (layer.threeDLayer && layer.property("Z Rotation")) {
                rProp.expression = 'value - parent.transform.zRotation';
            } else if (!layer.threeDLayer && layer.property("Rotation")){
                rProp.expression = 'value - parent.transform.rotation';
            }
        }

        if (applyScale && layer.property("Scale") && layer.property("Scale").canSetExpression) {
            layer.property("Scale").expression = 's = [];\n' +
                'parentScale = parent.transform.scale.value;\n' +
                'for (i = 0; i < parentScale.length; i++){\n' +
                's[i] = (parentScale[i]== 0) ? 0 : value[i]*100/parentScale[i];\n' +
                '}\n' +
                's';
        }
        if (applyOpacity && layer.property("Opacity") && layer.property("Opacity").canSetExpression) {
            layer.property("Opacity").expression = 'hasParent?parent.transform.opacity*parent.enabled:value';
        }
    } catch (e) {
        // Error handling for expression application can be added here if needed
            }
        }

/**
 * 检查图层是否已应用了此脚本创建的特定控制器表达式。
 * @param {Layer} layer 要检查的图层。
 * @returns {Boolean} 如果图层包含任一匹配的控制器表达式则返回 true，否则返回 false。
 */
function hasControllerExpressions(layer) {
    if (!layer || !layer.isValid) return false;
    var hasExpressions = false;
    try {
        var rProp = layer.property("Rotation") || layer.property("Z Rotation");
        if (rProp && rProp.expression) {
            hasExpressions = hasExpressions || rProp.expression.indexOf('parent.transform.rotation') !== -1 || rProp.expression.indexOf('parent.transform.zRotation') !== -1;
        }
        if (layer.property("Scale") && layer.property("Scale").expression) {
            hasExpressions = hasExpressions || layer.property("Scale").expression.indexOf('parent.transform.scale.value') !== -1;
        }
        if (layer.property("Opacity") && layer.property("Opacity").expression) {
            hasExpressions = hasExpressions || layer.property("Opacity").expression.indexOf('parent.transform.opacity') !== -1;
        }
    } catch (err) {
        return false;
            }
    return hasExpressions;
}

/**
 * 恢复之前被临时解锁的图层的锁定状态。
 * @param {Array<Layer>} layersToRestore 需要恢复锁定状态的图层数组。
 */
function restoreLockedLayers(layersToRestore) {
    if (layersToRestore && layersToRestore.length > 0) {
        for (var i = 0; i < layersToRestore.length; i++) {
            if (layersToRestore[i] && layersToRestore[i].isValid) {
                layersToRestore[i].locked = true;
            }
        }
            }
        }

// --- 主要功能函数 ---

/**
 * 主要功能：创建空对象控制器。
 * - 获取活动合成和选中图层。
 * - 处理锁定图层和无父级图层。
 * - 计算中心位置，创建基础、总控制（可选）、子控制（可选）空对象。
 * - 建立层级关系，并将选中图层链接到基础控制器。
 * - 为相关图层应用反向表达式。
 * - 尝试恢复原始父级关系到最顶层控制器。
 * @returns {Boolean} 操作是否成功（主要基于是否中途因用户取消或错误退出）。
 */
function createNullControl() {
    var comp = getActiveComp();
    if (!comp) return false;

    var selectedLayers = getSelectedLayersWithValidation(comp);
    if (!selectedLayers) return false;

    app.beginUndoGroup("创建空对象控制器");
    var layersToRestoreLock = [];

    try {
        var lockResult = handleLockedLayers(selectedLayers);
        if (lockResult.cancel) {
            app.endUndoGroup();
            return false;
        }
        layersToRestoreLock = lockResult.layersToRestoreLock;

        var validLayers = filterLayersWithoutParent(selectedLayers);
        if (!validLayers) {
            restoreLockedLayers(layersToRestoreLock);
            app.endUndoGroup();
            return false;
        }
        selectedLayers = validLayers;

        var nullSize = 100;
        var originalParentsInfo = unlinkParents(selectedLayers);
        var centerPosition = calculateCenterPosition(selectedLayers);
        
        var topMostLayer = selectedLayers[0];
        selectedLayers.forEach(function(layer) {
            if (layer.index < topMostLayer.index) {
                topMostLayer = layer;
            }
        });
        
        var base_ctrl_name = selectedLayers.length > 0 ? selectedLayers[0].name + "_控制器" : "控制器";
        var base_ctrl = createNullObject(comp, base_ctrl_name, nullSize, centerPosition, topMostLayer);
        
        var master_ctrl = null;
        if (masterActive) {
            var masterNullName = (selectedLayers.length > 0 ? selectedLayers[0].name : "Master") + "_Master控制";
            master_ctrl = createNullObject(comp, masterNullName, nullSize * 1.5, centerPosition, base_ctrl);
        }

        var child_ctrl = null;
        if (childActive) {
            var childNullName = (selectedLayers.length > 0 ? selectedLayers[0].name : "Child") + "_子控制";
            child_ctrl = createNullObject(comp, childNullName, nullSize * 1.2, centerPosition, base_ctrl);
        }
        
        var topController = base_ctrl;

        if (child_ctrl) {
            base_ctrl.parent = child_ctrl;
            topController = child_ctrl;
            applyExpressionsToLayer(base_ctrl, rotateCheck.value, scaleCheck.value, opacityCheck.value);
            }

        if (master_ctrl) {
            (child_ctrl || base_ctrl).parent = master_ctrl;
            topController = master_ctrl;
        }
        
        if (originalParentsInfo.length > 0) {
            var firstValidOriginalParent = null;
            for(var i=0; i < originalParentsInfo.length; i++){
                if(originalParentsInfo[i].parent && originalParentsInfo[i].parent.isValid){
                    firstValidOriginalParent = originalParentsInfo[i].parent;
                    break;
            }
            }
            if(firstValidOriginalParent){
                topController.parent = firstValidOriginalParent;
            }
        }

        for (var i = 0; i < selectedLayers.length; i++) {
            selectedLayers[i].parent = base_ctrl;
            applyExpressionsToLayer(selectedLayers[i], rotateCheck.value, scaleCheck.value, opacityCheck.value);
        }
        
        restoreLockedLayers(layersToRestoreLock);
        app.endUndoGroup();
        return true;

    } catch (err) {
        alert("创建控制器时发生错误：" + err.toString());
        restoreLockedLayers(layersToRestoreLock);
        app.endUndoGroup();
        return false;
    }
}

/**
 * 清除选中图层的控制器表达式和父子关系。
 * - 保存当前变换值（如果属性没有关键帧）。
 * - 清除旋转、缩放、不透明度属性的表达式。
 * - 恢复保存的变换值（如果之前已保存）。
 * - 解除图层的父级链接。
 * @returns {Boolean} 操作是否成功。
 */
function clearNullControl() {
    var comp = getActiveComp();
    if (!comp) return false;

    var selectedLayers = getSelectedLayersWithValidation(comp);
    if (!selectedLayers) return false;

    app.beginUndoGroup("清除表达式和父级");
    try {
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            if (!layer || !layer.isValid) continue;

            var transform = layer.property("Transform");
            var savedValues = {};

            if (transform) {
                if (transform.property("Rotation") && transform.property("Rotation").numKeys === 0) savedValues.rotation = transform.property("Rotation").value;
                if (transform.property("X Rotation") && transform.property("X Rotation").numKeys === 0) savedValues.xRotation = transform.property("X Rotation").value;
                if (transform.property("Y Rotation") && transform.property("Y Rotation").numKeys === 0) savedValues.yRotation = transform.property("Y Rotation").value;
                if (transform.property("Z Rotation") && transform.property("Z Rotation").numKeys === 0) savedValues.zRotation = transform.property("Z Rotation").value;
                if (transform.property("Orientation") && transform.property("Orientation").numKeys === 0) savedValues.orientation = transform.property("Orientation").value;
                if (transform.property("Scale") && transform.property("Scale").numKeys === 0) savedValues.scale = transform.property("Scale").value;
                if (transform.property("Opacity") && transform.property("Opacity").numKeys === 0) savedValues.opacity = transform.property("Opacity").value;
        }
        
            if (transform) {
                if (transform.property("Rotation") && transform.property("Rotation").canSetExpression) transform.property("Rotation").expression = '';
                if (transform.property("X Rotation") && transform.property("X Rotation").canSetExpression) transform.property("X Rotation").expression = '';
                if (transform.property("Y Rotation") && transform.property("Y Rotation").canSetExpression) transform.property("Y Rotation").expression = '';
                if (transform.property("Z Rotation") && transform.property("Z Rotation").canSetExpression) transform.property("Z Rotation").expression = '';
                if (transform.property("Orientation") && transform.property("Orientation").canSetExpression) transform.property("Orientation").expression = '';
                if (transform.property("Scale") && transform.property("Scale").canSetExpression) transform.property("Scale").expression = '';
                if (transform.property("Opacity") && transform.property("Opacity").canSetExpression) transform.property("Opacity").expression = '';
            }
            
             if (transform) {
                if (savedValues.rotation !== undefined && transform.property("Rotation")) transform.property("Rotation").setValue(savedValues.rotation);
                if (savedValues.xRotation !== undefined && transform.property("X Rotation")) transform.property("X Rotation").setValue(savedValues.xRotation);
                if (savedValues.yRotation !== undefined && transform.property("Y Rotation")) transform.property("Y Rotation").setValue(savedValues.yRotation);
                if (savedValues.zRotation !== undefined && transform.property("Z Rotation")) transform.property("Z Rotation").setValue(savedValues.zRotation);
                if (savedValues.orientation !== undefined && transform.property("Orientation")) transform.property("Orientation").setValue(savedValues.orientation);
                if (savedValues.scale !== undefined && transform.property("Scale")) transform.property("Scale").setValue(savedValues.scale);
                if (savedValues.opacity !== undefined && transform.property("Opacity")) transform.property("Opacity").setValue(savedValues.opacity);
            }

            if (layer.parent !== null) {
                layer.parent = null;
        }
        }
        app.endUndoGroup();
        return true;
    } catch (err) {
        alert("清除时发生错误：" + err.toString());
        app.endUndoGroup();
        return false;
    }
}

/**
 * 仅为选中的图层添加反向控制表达式。
 * 图层必须有父级才能应用这些表达式。
 * - 检查是否选择了至少一个控制属性（旋转、缩放、不透明度）。
 * - 遍历选中图层，如果图层有效且有父级，则应用所选表达式。
 * @returns {Boolean} 操作是否成功。
 */
function addExpressionsOnly() {
    var comp = getActiveComp();
    if (!comp) return false;

    var selectedLayers = getSelectedLayersWithValidation(comp);
    if (!selectedLayers) return false;

    if (!rotateCheck.value && !scaleCheck.value && !opacityCheck.value) {
        alert("请选择至少一个要添加表达式的属性！");
        return false;
        }

    app.beginUndoGroup("仅添加表达式");
    var appliedToAtLeastOne = false;
    try {
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            if (!layer || !layer.isValid || layer.parent === null) {
                continue;
            }
            applyExpressionsToLayer(layer, rotateCheck.value, scaleCheck.value, opacityCheck.value);
            appliedToAtLeastOne = true;
        }
        if (!appliedToAtLeastOne && selectedLayers.length > 0) {
            alert("选中的图层均无父级，未添加表达式。");
        }
        app.endUndoGroup();
        return true;
    } catch (err) {
        alert("添加表达式时发生错误：" + err.toString());
        app.endUndoGroup();
        return false;
    }
}

/**
 * 处理"整体控制"按钮的点击事件。
 * - 如果当前选中了图层：为选中的、无父级的图层创建一个共享的"整体控制器"空对象，
 *   并将这些图层父级链接到该控制器。会处理锁定图层和已存在父级的情况。
 *   计算中心点时使用所有选中的（已解锁）图层，但仅为其中无父级的图层设置父级。
 *   解除父级关系也只针对这些无父级的图层（虽然它们已经没有父级，但这是为了获取 originalParentsInfo，尽管在这里可能为空）。
 * - 如果当前未选中图层：查找并选中合成中所有无父级且未应用控制器表达式的图层。
 */
function handleGlobalControlButtonClick() {
    var comp = getActiveComp();
    if (!comp) return;

    app.beginUndoGroup("整体控制操作");
    var layersToRestoreLock = [];
    try {
        var selectedLayers = comp.selectedLayers;

        if (selectedLayers.length > 0) {
            var lockResult = handleLockedLayers(selectedLayers);
            if (lockResult.cancel) {
                app.endUndoGroup();
            return;
        }
            layersToRestoreLock = lockResult.layersToRestoreLock;

            var validLayersForParenting = filterLayersWithoutParent(selectedLayers);
            if (!validLayersForParenting || validLayersForParenting.length === 0) {
                 alert("选中的图层都已有父级或没有有效图层，无法创建整体控制器。");
                restoreLockedLayers(layersToRestoreLock);
                app.endUndoGroup();
            return;
        }
            var centerPosition = calculateCenterPosition(selectedLayers); 

            var topMostLayerForPlacingNull = validLayersForParenting[0];
            validLayersForParenting.forEach(function(layer) {
                if (layer.index < topMostLayerForPlacingNull.index) {
                    topMostLayerForPlacingNull = layer;
                }
            });
            
            var originalParentsInfo = unlinkParents(validLayersForParenting);

            var nullLayerName = "整体控制器";
            var ctrl = createNullObject(comp, nullLayerName, 100, centerPosition, topMostLayerForPlacingNull);

            if (originalParentsInfo.length > 0) {
                var firstValidOriginalParent = null;
                for(var i=0; i < originalParentsInfo.length; i++){
                    if(originalParentsInfo[i].parent && originalParentsInfo[i].parent.isValid){
                        firstValidOriginalParent = originalParentsInfo[i].parent;
                        break;
                    }
                }
                 // if(firstValidOriginalParent){ // 决定是否将整体控制器本身也链接到某个原有父级, 当前脚本逻辑是不链接
                 //    ctrl.parent = firstValidOriginalParent;
                 // }
            }

            for (var i = 0; i < validLayersForParenting.length; i++) {
                validLayersForParenting[i].parent = ctrl;
            }
            
            restoreLockedLayers(layersToRestoreLock);
            alert("已为选中的 " + validLayersForParenting.length + " 个无父级图层创建整体控制器");

        } else {
            var layersWithoutControllerOrParent = [];
            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);
                if (layer.parent === null && !hasControllerExpressions(layer)) {
                    layersWithoutControllerOrParent.push(layer);
                }
            }
            
            if (layersWithoutControllerOrParent.length > 0) {
                for (var i = 1; i <= comp.numLayers; i++) {
                    comp.layer(i).selected = false;
                }
                for (var i = 0; i < layersWithoutControllerOrParent.length; i++) {
                    layersWithoutControllerOrParent[i].selected = true;
                }
                alert("已选中 " + layersWithoutControllerOrParent.length + " 个未设置控制器且无父级的图层");
            } else {
                alert("所有图层都已设置控制器或已有父级！");
            }
        }
        app.endUndoGroup();
    } catch (err) {
        alert("整体控制操作时发生错误: " + err.toString());
        restoreLockedLayers(layersToRestoreLock);
        app.endUndoGroup();
    }
}

/**
 * [层层空] 为每个选定的图层添加一个单独的父级空对象。
 * 将选中图层的父级链接更改为新创建的空对象。
 * 每个图层创建独立的父级空对象，与整体控制不同。
 * - 获取当前选中的图层并处理3D状态。
 * - 根据放置模式决定空对象在图层上方或合成顶部。
 * - 保留原始父级关系链（如果原图层有父级）。
 * - 自动选中所有新创建的空对象。
 * @param {Boolean} placeMode 空对象放置模式，true=保持在原图层上一层, false=合成顶部
 * @returns {Boolean} 操作是否成功。
 */
function createLayeredNulls_modular(placeMode) {
    // 添加调试辅助函数
    function logDebug(message) {
        $.writeln("[DEBUG] " + message);
    }

    // 确保图层有效性并获取其名称
    function getLayerNameSafely(layer) {
        if (!layer) return "未知图层";
        try {
            return layer.name || "未命名图层";
        } catch (e) {
            return "无法获取名称的图层";
        }
    }

    // 获取图层的位置信息（针对单个图层）
    function getLayerPosition(layer) {
        try {
            if (!layer) {
                logDebug("getLayerPosition: 图层为空!");
                return null;
            }
            
            logDebug("尝试获取图层 '" + getLayerNameSafely(layer) + "' 的位置");
            
            try {
                var position = layer.property("Position").value;
                var is3D = layer.threeDLayer;
                
                logDebug("图层位置: " + position.toString() + ", 是否3D: " + is3D);
                
                if (is3D) {
                    return [position[0], position[1], position[2] || 0];
                } else {
                    return [position[0], position[1]];
                }
            } catch (propErr) {
                logDebug("访问图层属性时出错: " + propErr.toString());
                return null;
            }
        } catch (err) {
            logDebug("在getLayerPosition函数中发生错误: " + err.toString());
            return null;
        }
    }

    try {
        logDebug("=== 开始执行层层空脚本 ===");
        
        var composition = app.project.activeItem;
        if (!(composition && composition instanceof CompItem)) {
            alert("先选择一个合成!");
            return false;
        }
        
        logDebug("当前合成: " + composition.name);
        
        // 设置默认放置模式
        if (placeMode === undefined) {
            placeMode = true; // 默认为原图层上一层
        }
        
        logDebug("使用放置模式: " + (placeMode ? "原图层上一层" : "合成顶部"));
        
        app.beginUndoGroup("层层空");
        var nullSize = 100;
        var createdCount = 0;
        // 存储创建的所有空对象，以便于后续选择
        var createdNulls = [];

        // 获取当前选中的图层
        var selectedLayers = composition.selectedLayers;
        logDebug("选中的图层数量: " + selectedLayers.length);

        if (selectedLayers.length === 0) {
            alert("请先选择至少一个图层!");
            app.endUndoGroup();
            return false;
        }
        
        // 如果选择了保持在原图层旁边，我们需要先按照图层在合成中的顺序排序
        // 这样可以避免由于图层顺序变化而导致的问题
        if (placeMode) {
            selectedLayers.sort(function(a, b) {
                return a.index - b.index; // 按照图层索引排序（小的索引对应着更上面的图层）
            });
            logDebug("已按图层索引排序选中图层");
        }

        // 为每个选中的图层分别创建父级空对象
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            
            if (!layer) {
                logDebug("图层 #" + i + " 为空!");
                continue;
            }
            
            try {
                var layerName = getLayerNameSafely(layer);
                var layerIndex = layer.index;
                logDebug("处理图层 #" + i + ": '" + layerName + "', 索引: " + layerIndex);
                
                // 获取图层的原始父级
                var originalParent = null;
                try {
                    originalParent = layer.parent;
                    if (originalParent) {
                        logDebug("图层的原始父级: '" + getLayerNameSafely(originalParent) + "'");
                    } else {
                        logDebug("图层没有原始父级");
                    }
                } catch (parentErr) {
                    logDebug("获取图层的原始父级时出错: " + parentErr.toString());
                }
                
                // 获取图层的位置
                var layerPosition = getLayerPosition(layer);
                if (!layerPosition) {
                    logDebug("未能获取图层位置，使用默认位置 [0,0]");
                    layerPosition = [0, 0];
                }
                
                // 获取图层的3D状态
                var is3D = false;
                try {
                    is3D = layer.threeDLayer;
                    logDebug("图层的3D状态: " + is3D);
                } catch (threeDErr) {
                    logDebug("获取图层的3D状态时出错: " + threeDErr.toString());
                }
                
                // 为当前图层创建一个父级空对象
                var nullLayerName = layerName + "_父空";
                logDebug("准备创建父级空对象: '" + nullLayerName + "'");
                
                var newNull = createNullObject(composition, nullLayerName, nullSize, layerPosition);
                if (!newNull) {
                    logDebug("创建空对象失败，跳过当前图层");
                    continue;
                }
                
                // 存储创建的空对象 (确保记录在数组中)
                createdNulls.push(newNull);
                logDebug("添加到createdNulls数组，当前数量: " + createdNulls.length);
                
                // 设置新空对象的3D属性与图层一致
                try {
                    newNull.threeDLayer = is3D;
                    logDebug("设置空对象的3D状态为: " + is3D);
                } catch (setThreeDErr) {
                    logDebug("设置空对象的3D状态时出错: " + setThreeDErr.toString());
                }
                
                // 根据选择的模式放置空对象
                if (placeMode) {
                    try {
                        // 将空对象移动到与原图层相邻的位置
                        // Adobe After Effects 中，较小的索引对应较上层的图层
                        // 为了保持在原图层旁边，我们将空对象放在原图层之前
                        newNull.moveBefore(layer);
                        logDebug("成功将空对象放置在原图层之前，索引: " + newNull.index);
                    } catch (moveErr) {
                        logDebug("移动空对象时出错: " + moveErr.toString());
                    }
                }
                
                // 如果图层有原始父级，将新空对象设置为该原始父级的子级
                if (originalParent) {
                    try {
                        newNull.parent = originalParent;
                        logDebug("设置空对象的父级为原图层的父级: '" + getLayerNameSafely(originalParent) + "'");
                    } catch (setParentErr) {
                        logDebug("设置空对象的父级时出错: " + setParentErr.toString());
                    }
                }
                
                // 将当前图层设置为新空对象的子级
                try {
                    layer.parent = newNull;
                    logDebug("成功将图层 '" + layerName + "' 设置为空对象 '" + nullLayerName + "' 的子级");
                    createdCount++;
                } catch (setChildErr) {
                    logDebug("设置图层为空对象的子级时出错: " + setChildErr.toString());
                }
                
            } catch (layerErr) {
                logDebug("处理图层时发生未预期错误: " + layerErr.toString());
            }
        }

        logDebug("循环处理完成，成功创建了 " + createdCount + " 个父级空对象");
        
        // 取消现有选择并选中所有创建的空对象
        logDebug("准备选中新创建的空对象，数量: " + createdNulls.length);
        if (createdNulls.length > 0) {
            try {
                // 先取消所有图层的选择
                for (var j = 1; j <= composition.numLayers; j++) {
                    try {
                        composition.layer(j).selected = false;
                    } catch (e) {
                        logDebug("取消选择图层 #" + j + " 时出错: " + e.toString());
                    }
                }
                logDebug("已取消所有图层选择");
                
                // 选中所有创建的空对象
                var selectedCount = 0;
                for (var k = 0; k < createdNulls.length; k++) {
                    try {
                        if (createdNulls[k] && createdNulls[k].isValid !== false) {
                            // 有些对象可能已经被删除或无效，尝试验证它们是否仍然存在
                            var nullName = createdNulls[k].name;
                            createdNulls[k].selected = true;
                            selectedCount++;
                            logDebug("已选中空对象 #" + k + ": '" + nullName + "'");
                        }
                    } catch (e) {
                        logDebug("选中空对象时出错，索引 " + k + ": " + e.toString());
                    }
                }
                
                // 强制更新UI
                app.activeViewer.setActive();
                
                logDebug("最终选中了 " + selectedCount + " 个新创建的空对象");
            } catch (selectionErr) {
                logDebug("选择空对象过程中发生错误: " + selectionErr.toString());
            }
        } else {
            logDebug("没有创建任何空对象，无需选择");
        }
        
        app.endUndoGroup();
        logDebug("=== 层层空脚本执行完毕 ===");
        return true;
    } catch (mainErr) {
        alert("脚本执行时发生错误: " + mainErr.toString());
        logDebug("主脚本执行时发生错误: " + mainErr.toString());
        app.endUndoGroup();
        return false;
    }
}

/**
 * 显示帮助和使用说明面板。
 * 面板包含脚本的基本操作、高级选项、按钮功能说明以及相关链接。
 */
function showHelpPanel() {
    var helpDialog = new Window("dialog", "使用说明");
    helpDialog.orientation = "column";
    helpDialog.alignChildren = "fill";
    helpDialog.margins = 14;
    helpDialog.spacing = 8;
    
    function addTitle(text) {
        var title = helpDialog.add("statictext", undefined, text);
        title.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.BOLD, 13);
        title.graphics.foregroundColor = title.graphics.newPen(title.graphics.PenType.SOLID_COLOR, [0.3, 0.6, 0.9, 1], 1);
        return title;
    }
    
    function addContent(text) {
        var content = helpDialog.add("statictext", undefined, text);
        content.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 12);
        content.graphics.foregroundColor = content.graphics.newPen(content.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
        content.margins = [10, 0, 0, 0];
        return content;
    }
    
    function addSeparator() {
        var separator = helpDialog.add("panel");
        separator.alignment = "fill";
        separator.height = 1;
        return separator;
    }

    /**
     * 内部辅助函数：创建带图标和链接的文本按钮。
     * @param {Group|Panel} parent 父容器。
     * @param {String} text 显示的链接文本。
     * @param {String} icon 显示的图标字符 (例如 '₪')。
     * @param {String} url 点击后要打开的URL。
     * @returns {Group} 创建的包含图标和文本的 Group 对象。
     */
    function createLinkButton(parent, text, icon, url) {
        var btnGroup = parent.add("group");
        btnGroup.orientation = "row";
        btnGroup.spacing = 5;
        btnGroup.alignChildren = ["left", "center"];
        
        var iconText = btnGroup.add("statictext", undefined, icon);
        iconText.graphics.font = ScriptUI.newFont("Arial", ScriptUI.FontStyle.REGULAR, 13);
        iconText.graphics.foregroundColor = iconText.graphics.newPen(iconText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
        
        var linkText = btnGroup.add("statictext", undefined, text);
        linkText.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 12);
        linkText.graphics.foregroundColor = linkText.graphics.newPen(linkText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
        
        var isHovered = false;
        
        function addHoverEvents(element) {
            element.addEventListener('mouseover', function() {
                    linkText.graphics.foregroundColor = linkText.graphics.newPen(linkText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
                    iconText.graphics.foregroundColor = iconText.graphics.newPen(iconText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
                    isHovered = true;
            });
            
            element.addEventListener('mouseout', function() {
                    linkText.graphics.foregroundColor = linkText.graphics.newPen(linkText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
                    iconText.graphics.foregroundColor = iconText.graphics.newPen(iconText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
                    isHovered = false;
            });
        }
        
        function addClickEvent(element) {
            element.addEventListener('mousedown', function() {
                try {
                    var cmd = '';
                    if (Folder.fs === "Windows") {
                        // Correctly escape single quotes within the URL for cmd.exe
                        var escapedUrl = url.replace(/'/g, "'\\\\''"); // Escape single quotes for cmd.exe
                        cmd = 'cmd.exe /c start "" "' + escapedUrl + '"';
                    } else if (Folder.fs === "Macintosh") {
                        cmd = 'open "' + url + '"';
                    } else {
                         alert("请手动复制链接并在浏览器中打开:\n" + url);
                         return;
                    }
                    system.callSystem(cmd);
                } catch (e) { alert("无法打开链接: " + url + "\n" + e.toString()); }
            });
        }
        
        addHoverEvents(iconText);
        addHoverEvents(linkText);
        addClickEvent(linkText);
        addClickEvent(iconText);
        
        return btnGroup;
    }
    
    addTitle("基本操作：");
    addContent("1. 选择要控制的图层");
    addContent("2. 勾选需要添加的控制属性（旋转、缩放、不透明度）");
    addContent("3. 点击\"开搞\"创建控制器及对应表达式");
    addSeparator();
    addTitle("高级选项：");
    addContent("- 总控制：右键点击激活。若勾选，会在基础控制器之上再添加一个总控制器");
    addContent("- 子控制：右键点击激活。若勾选，会在基础控制器之上添加一个子控制器（若总控制也激活，则子控制在总控制之下）");
    addContent("- 整体控制：");
    addContent("  - 若未选中图层：点击会查找并选中所有无父级且未应用控制器表达式的图层");
    addContent("  - 若已选中图层：点击会为选中的无父级图层创建一个共享的\"整体控制器\"");
    addSeparator();
    addTitle("按钮功能：");
    addContent("- 开搞 (左键)：根据上述选项创建控制器和表达式");
    addContent("- 开搞 (右键)：切换到\"仅表达式\"模式。此模式下，左键点击\"仅表达式\"按钮，会为选中且已有父级的图层添加反向表达式");
    addContent("- 取消 (左键)：关闭脚本窗口");
    addContent("- 取消 (右键)：切换到\"清除\"模式。此模式下，左键点击\"清除\"按钮，会移除选中图层的控制器表达式和父子关系");
    addContent("- ?：显示此帮助说明");
    addSeparator();
    addTitle("相关链接：");
    var descGroup = helpDialog.add("group");
    descGroup.orientation = "column";
    descGroup.alignChildren = "left";
    descGroup.margins = [10, 4, 10, 0];
    var descText = descGroup.add("statictext", undefined, "本脚本已在GitHub和Gitee开源。如果觉得好用，可以考虑在爱发电支持一下作者！", {multiline: true});
    descText.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.REGULAR, 12);
    descText.graphics.foregroundColor = descText.graphics.newPen(descText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 1);
    descText.preferredSize.width = 380;

    var linksGroup = helpDialog.add("group");
    linksGroup.orientation = "row";
    linksGroup.alignChildren = ["left", "center"];
    linksGroup.margins = [10, 2, 0, 4];
    linksGroup.spacing = 10;

    createLinkButton(linksGroup, "Bilibili", "₪", "https://space.bilibili.com/100881808");
    createLinkButton(linksGroup, "爱发电", "₪", "https://afdian.com/item/2c972f4608a411f09e8e52540025c377");
    createLinkButton(linksGroup, "Gitee", "₪", GITEE_URL);
    createLinkButton(linksGroup, "GitHub", "₪", GITHUB_URL);

    addSeparator();
    var helpBtnGroup = helpDialog.add("group");
    helpBtnGroup.orientation = "row";
    helpBtnGroup.alignment = "center";
    helpBtnGroup.margins = [0, 12, 0, 0];
    helpBtnGroup.spacing = 8;
    var closeBtn = createStyledButton(helpBtnGroup, "关闭", [75, 28], true);
    closeBtn.onClick = function() {
        helpDialog.close();
    };
    helpDialog.center();
    helpDialog.show();
}

/**
 * 选择指定图层的子级图层。
 * 查找选中图层的直接子级，并将其选中。
 * 按住Shift键可以保留当前选择并添加子级。
 * @returns {Boolean} 操作是否成功。
 */
function selectChildrenLayers() {
    function logDebug(message) {
        $.writeln("[选择子级] " + message);
    }

    try {
        // 获取当前活动合成
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("请先选择一个合成!");
            return false;
        }

        logDebug("当前合成: " + comp.name);

        // 获取当前选中的图层
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("请先选择至少一个图层!");
            return false;
        }

        logDebug("选中的图层数量: " + selectedLayers.length);

        // 创建一个对象，用于存储选中图层的索引，便于快速查找
        var selectedLayersMap = {};
        for (var i = 0; i < selectedLayers.length; i++) {
            selectedLayersMap[selectedLayers[i].index] = true;
        }

        // 查找所有子级图层
        var childrenLayers = [];
        var foundCount = 0;

        // 遍历合成中的所有图层
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            
            // 检查该图层是否有父级，且父级是否在选中图层中
            if (layer.parent !== null && selectedLayersMap[layer.parent.index]) {
                childrenLayers.push(layer);
                foundCount++;
                logDebug("找到子级图层: " + layer.name + " (父级: " + layer.parent.name + ")");
            }
        }

        // 如果没有找到任何子级
        if (foundCount === 0) {
            alert("选中的图层没有子级!");
            return false;
        }

        // 选择所有找到的子级图层
        app.beginUndoGroup("选择子级图层");
        
        // 如果按住Shift键，则保持当前选择
        var keepCurrentSelection = ScriptUI.environment.keyboardState.shiftKey;
        
        if (!keepCurrentSelection) {
            // 先取消所有图层的选择
            for (var i = 1; i <= comp.numLayers; i++) {
                comp.layer(i).selected = false;
            }
        }
        
        // 选中所有子级图层
        for (var i = 0; i < childrenLayers.length; i++) {
            childrenLayers[i].selected = true;
        }
        
        app.endUndoGroup();
        
        // 记录到日志
        logDebug("已选中 " + foundCount + " 个子级图层");
        return true;
        
    } catch (err) {
        alert("执行脚本时发生错误: " + err.toString());
        logDebug("执行脚本时发生错误: " + err.toString());
        return false;
    }
}

// --- 主面板创建和UI布局 ---
var win = new Window("dialog", "Advanced Null Controller by 烟囱");
win.orientation = "column";
win.alignChildren = "fill";
win.spacing = 12;
win.margins = [12, 16, 12, 16];

win.graphics.onDraw = function() {
    var g = this;
    var bounds = [0, 0, win.size[0], win.size[1]];
    g.newPath();
    g.rectPath(bounds[0], bounds[1], bounds[2], bounds[3], 14);
    g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [0.18, 0.18, 0.18, 1]));
    g.newPath();
    g.moveTo(bounds[0], bounds[1]);
    g.lineTo(bounds[2], bounds[1]);
    g.strokePath(g.newPen(g.PenType.SOLID_COLOR, [0.25, 0.25, 0.25, 0.8], 2));
};

var titleGroup = win.add("group");
titleGroup.alignment = "center";
titleGroup.margins = [0, 6, 0, 10];
var titleText = titleGroup.add("statictext", undefined, "高级空对象控制器 2.1");
titleText.graphics.font = ScriptUI.newFont("微软雅黑", ScriptUI.FontStyle.BOLD, 16);
titleText.graphics.foregroundColor = titleText.graphics.newPen(titleText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);

var mainOptionsGroup = win.add("group");
mainOptionsGroup.orientation = "column";
mainOptionsGroup.alignChildren = "fill";
mainOptionsGroup.spacing = 10;
mainOptionsGroup.margins = [0, 2, 0, 2];

var optionsGroup = createStyledPanel(mainOptionsGroup, "选择要添加的控制");
optionsGroup.orientation = "row";
optionsGroup.alignChildren = ["center", "center"];
optionsGroup.margins = [12, 20, 12, 16];
optionsGroup.spacing = 20;

var checkboxGroup = optionsGroup.add("group");
checkboxGroup.orientation = "row";
checkboxGroup.alignChildren = ["center", "center"];
checkboxGroup.spacing = 20;
checkboxGroup.margins = [0, 4, 0, 0];

var rotateCheck = createStyledCheckbox(checkboxGroup, "旋转");
var scaleCheck = createStyledCheckbox(checkboxGroup, "缩放");
var opacityCheck = createStyledCheckbox(checkboxGroup, "不透明度");
rotateCheck.value = true;
scaleCheck.value = true;
opacityCheck.value = true;

var advancedGroup = createStyledPanel(mainOptionsGroup, "高级控制");
advancedGroup.orientation = "row";
advancedGroup.alignChildren = ["center", "center"];
advancedGroup.margins = [10, 12, 10, 12];

var masterGroup = advancedGroup.add("group");
masterGroup.orientation = "row";
masterGroup.alignment = "center";
masterGroup.alignChildren = ["center", "center"];
masterGroup.spacing = 30;

var masterText = createStyledText(masterGroup, "总控制", 70, true);
masterText.helpTip = "再套一层控制作为总控\n右键点击切换激活状态";
var childText = createStyledText(masterGroup, "子控制", 70, true);
childText.helpTip = "再套一层控制子级的属性\n右键点击切换激活状态";

var advancedToolsGroup = createStyledPanel(mainOptionsGroup, "高级工具");
advancedToolsGroup.orientation = "row";
advancedToolsGroup.alignChildren = ["center", "center"];
advancedToolsGroup.margins = [10, 12, 10, 12];

var toolsGroup = advancedToolsGroup.add("group");
toolsGroup.orientation = "row";
toolsGroup.alignment = "center";
toolsGroup.spacing = 15;

var globalControlBtn = createStyledText(toolsGroup, "整体控制", 70, true);
globalControlBtn.helpTip = "未选中:查找未控图层 | 选中时:创建整体控制器";

var layeredNullsBtn = createStyledText(toolsGroup, "层层空", 70, true);
layeredNullsBtn.helpTip = "每个选中层都创建一个空对象\n默认空对象位于原图层上方\nCTRL+点击：空对象位于合成顶部";

var selectChildrenBtn = createStyledText(toolsGroup, "选择子级", 70, true);
selectChildrenBtn.helpTip = "选择当前选中图层的所有子级\nShift+点击：保留当前选择并添加子级";

// --- 事件监听器绑定 ---
globalControlBtn.addEventListener('mousedown', function(e) {
    if (e.button == 0 || e.button == undefined) {
        handleGlobalControlButtonClick();
    }
});
globalControlBtn.addEventListener('mouseover', function() {
    if (!this.isActive) {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7, 1], 1);
    }
    });
globalControlBtn.addEventListener('mouseout', function() {
     if (!this.isActive) {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    }
});

layeredNullsBtn.addEventListener('mousedown', function(e) {
    if (e.button == 0 || e.button == undefined) { // Left click
        // 检测Ctrl键是否按下
        var ctrlKey = (ScriptUI.environment.keyboardState.ctrlKey === true);
        // 如果按下Ctrl键，则传递false作为placeMode参数（空对象位于合成顶部）
        // 否则使用默认的true（空对象位于原图层上方）
        createLayeredNulls_modular(!ctrlKey);
    }
});

selectChildrenBtn.addEventListener('mousedown', function(e) {
    if (e.button == 0 || e.button == undefined) { // Left click
        selectChildrenLayers();
    }
});
selectChildrenBtn.addEventListener('mouseover', function() {
    if (!this.isActive) {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7, 1], 1);
    }
});
selectChildrenBtn.addEventListener('mouseout', function() {
    if (!this.isActive) {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    }
});

masterText.addEventListener('mousedown', function(e) {
    if (e.button == 2) {
        masterActive = !masterActive;
        if (masterActive) childActive = false;
        masterText.setActive(masterActive);
        childText.setActive(childActive);
        e.preventDefault();
    }
});

childText.addEventListener('mousedown', function(e) {
    if (e.button == 2) {
        childActive = !childActive;
        if (childActive) masterActive = false;
        childText.setActive(childActive);
        masterText.setActive(masterActive);
        e.preventDefault();
    }
});

var btnGroup = win.add("group");
btnGroup.orientation = "row";
btnGroup.alignment = "center";
btnGroup.margins = [0, 12, 0, 8];
btnGroup.spacing = 15;

var mainBtn = createStyledButton(btnGroup, "开搞", [90, 32], true);
var cancelBtn = createStyledButton(btnGroup, "取消", [90, 32], false);
var helpBtn = createStyledButton(btnGroup, "?", [32, 32], false);

mainBtn.helpTip = "左键点击：创建控制器\n右键点击：切换到仅添加表达式模式";
cancelBtn.helpTip = "左键点击：关闭窗口\n右键点击：切换到清除控制器模式";
helpBtn.helpTip = "查看使用说明";

mainBtn.addEventListener('mousedown', function(e) {
    if (e.button == 2) {
        isExpressionMode = !isExpressionMode;
        if (isExpressionMode) isClearMode = false;
        mainBtn.text = isExpressionMode ? "仅表达式" : "开搞";
        cancelBtn.text = "取消";
        e.preventDefault();
            }
        });
        
cancelBtn.addEventListener('mousedown', function(e) {
    if (e.button == 2) {
        isClearMode = !isClearMode;
        if (isClearMode) isExpressionMode = false;
        cancelBtn.text = isClearMode ? "清除" : "取消";
        mainBtn.text = "开搞";
        e.preventDefault();
            }
        });

mainBtn.onClick = function() {
    var success = false;
    if (isExpressionMode) {
        success = addExpressionsOnly();
    } else {
        success = createNullControl();
    }
    if (success) win.close();
};

cancelBtn.onClick = function() {
    var success = false;
    if (isClearMode) {
        success = clearNullControl();
        if (success) win.close();
    } else {
        win.close();
    }
};

helpBtn.onClick = showHelpPanel;

// --- 显示面板 ---
win.center();
win.show();
