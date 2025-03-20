// Advanced Null Controller
// Version: 2024.03.21
// Author: 烟囱
// Repository: https://github.com/Tyc-github/Advanced-Null-Controller
// 版本相关常量
var CURRENT_VERSION = "2024.03.21";
var VERSION_URL = "https://raw.githubusercontent.com/Tyc-github/Advanced-Null-Controller/main/version.txt";
var GITHUB_URL = "https://github.com/Tyc-github/Advanced-Null-Controller";
var GITEE_URL = "https://gitee.com/tyc-github/Advanced-Null-Controller";

// 创建主面板
var win = new Window("dialog", "Advanced Null Controller by 烟囱");
win.orientation = "column";
win.alignChildren = "fill";

// 添加顶部标题
var titleGroup = win.add("group");
titleGroup.alignment = "center";
titleGroup.margins = 5;
var titleText = titleGroup.add("statictext", undefined, "高级空对象控制器 v2024.03.21");
titleText.graphics.font = ScriptUI.newFont("Tahoma", ScriptUI.FontStyle.BOLD, 16);
titleText.graphics.foregroundColor = titleText.graphics.newPen(titleText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
titleText.helpTip = "按住CTRL点击检查更新";

// 添加标题点击事件
titleText.addEventListener('mousedown', function(e) {
    if (e.ctrlKey) {
        checkForUpdates();
    }
});

// 创建帮助面板函数
function showHelpPanel() {
    var helpDialog = new Window("dialog", "使用说明");
    helpDialog.orientation = "column";
    helpDialog.alignChildren = "left";
    helpDialog.margins = 20;
    
    helpDialog.add("statictext", undefined, "基本操作：");
    helpDialog.add("statictext", undefined, "1. 选择要控制的图层");
    helpDialog.add("statictext", undefined, "2. 勾选需要添加的控制属性");
    helpDialog.add("statictext", undefined, "3. 点击'开搞'创建控制器");
    
    helpDialog.add("statictext", undefined, "\n高级选项：");
    helpDialog.add("statictext", undefined, "- 总控制：右键点击激活，添加一个总控制器");
    helpDialog.add("statictext", undefined, "- 子控制：右键点击激活，添加一个子级控制器");
    helpDialog.add("statictext", undefined, "- 整体控制：选中图层时创建整体控制器，未选中时查找未控制图层");
    
    helpDialog.add("statictext", undefined, "\n按钮功能：");
    helpDialog.add("statictext", undefined, "- 开搞（左键）：创建控制器");
    helpDialog.add("statictext", undefined, "- 开搞（右键）：仅添加表达式");
    helpDialog.add("statictext", undefined, "- 取消（右键）：清除控制器");
    
    var closeBtn = helpDialog.add("button", undefined, "关闭");
    closeBtn.onClick = function() {
        helpDialog.close();
    };
    
    helpDialog.center();
    helpDialog.show();
}

// 创建主选项容器
var mainOptionsGroup = win.add("group");
mainOptionsGroup.orientation = "column";
mainOptionsGroup.alignChildren = "fill";
mainOptionsGroup.spacing = 10;
mainOptionsGroup.spacing = 15;

// 创建「选择要添加的控制」面板
var optionsGroup = mainOptionsGroup.add("panel", undefined, "选择要添加的控制");
optionsGroup.orientation = "row";
optionsGroup.alignChildren = "left";
optionsGroup.margins = 15;
optionsGroup.spacing = 15;

// 添加主控制复选框
var rotateCheck = optionsGroup.add("checkbox", undefined, "旋转");
var scaleCheck = optionsGroup.add("checkbox", undefined, "缩放");
var opacityCheck = optionsGroup.add("checkbox", undefined, "不透明度");
rotateCheck.value = true;
scaleCheck.value = true;
opacityCheck.value = true;

// 新增「高级选项」组
var advancedGroup = mainOptionsGroup.add("panel", undefined, "高级选项");
advancedGroup.orientation = "row";
advancedGroup.alignChildren = "left";
advancedGroup.margins = 15;
advancedGroup.spacing = 15;

// 在高级选项组内创建masterGroup
var masterGroup = advancedGroup.add("group");
masterGroup.orientation = "row";
masterGroup.alignment = "left";
masterGroup.spacing = 10;

// 总控制文本标签
var masterText = masterGroup.add("statictext", undefined, "总控制");
masterText.helpTip = "再套一层控制作为总控\n右键点击切换激活状态";
masterText.preferredSize.width = 80;
masterText.graphics.foregroundColor = masterText.graphics.newPen(masterText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);

// 子控制文本标签
var childText = masterGroup.add("statictext", undefined, "子控制"); 
childText.helpTip = "再套一层控制子级的属性\n右键点击切换激活状态";
childText.preferredSize.width = 80;
childText.graphics.foregroundColor = childText.graphics.newPen(childText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);

// 添加变量跟踪激活状态
var masterActive = false;
var childActive = false;

// 添加整体控制按钮
var globalControlBtn = masterGroup.add("statictext", undefined, "整体控制");
globalControlBtn.helpTip = "选中图层时创建整体控制器，未选中时查找未控制图层";
globalControlBtn.preferredSize.width = 80;
globalControlBtn.graphics.foregroundColor = globalControlBtn.graphics.newPen(globalControlBtn.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
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
        
        // 过滤掉已经有父级的图层
        var validLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].parent === null) {
                validLayers.push(selectedLayers[i]);
            }
        }
        
        if (validLayers.length === 0) {
            alert("请选择至少一个没有父级的图层！");
            app.endUndoGroup();
            return;
        }
        
        // 计算中心位置
        var centerPosition = calculateCenterPosition(validLayers);
        
        // 获取最上层的图层
        var topMostLayer = validLayers[0];
        validLayers.forEach(function(layer) {
            if (layer.index < topMostLayer.index) {
                topMostLayer = layer;
            }
        });
        
        // 创建基础空对象
        var nullSize = 100;
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
// 添加右键点击事件处理
masterText.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        masterActive = !masterActive;
        childActive = false;  // 互斥逻辑
        
        // 更新视觉反馈
        masterText.graphics.foregroundColor = masterActive ? 
            masterText.graphics.newPen(masterText.graphics.PenType.SOLID_COLOR, [0.3, 0.8, 0.3, 1], 1) : 
            masterText.graphics.newPen(masterText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
        childText.graphics.foregroundColor = childText.graphics.newPen(childText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
        
        e.preventDefault();
    }
});

childText.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        childActive = !childActive;
        masterActive = false;  // 互斥逻辑
        
        // 更新视觉反馈
        childText.graphics.foregroundColor = childActive ? 
            childText.graphics.newPen(childText.graphics.PenType.SOLID_COLOR, [0.3, 0.8, 0.3, 1], 1) : 
            childText.graphics.newPen(childText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
        masterText.graphics.foregroundColor = masterText.graphics.newPen(masterText.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
        
        e.preventDefault();
    }
});

// 创建按钮组
var btnGroup = win.add("group");
btnGroup.orientation = "row";
btnGroup.alignment = "center";
btnGroup.spacing = 10;
btnGroup.margins = 15;
btnGroup.spacing = 10;

// 创建可切换的主按钮
var mainBtn = btnGroup.add("button", [0, 0, 80, 30], "开搞", {name: "ok"});
mainBtn.helpTip = "左键点击执行\n右键点击切换模式";
var isExpressionMode = false;

// 创建可切换的取消按钮
var cancelBtn = btnGroup.add("button", [0, 0, 80, 30], "取消", {name: "cancel"});
cancelBtn.helpTip = "左键点击执行\n右键点击切换模式";
var isClearMode = false;

// 创建帮助按钮
var helpBtn = btnGroup.add("button", [0, 0, 30, 30], "?", {name: "help"});
helpBtn.helpTip = "点击查看使用说明";

// 添加版本比较函数
function compareVersions(current, latest) {
    var currentParts = current.split('.');
    var latestParts = latest.split('.');
    
    for (var i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
        var currentPart = parseInt(currentParts[i] || 0, 10);
        var latestPart = parseInt(latestParts[i] || 0, 10);
        
        if (currentPart < latestPart) return true;
        if (currentPart > latestPart) return false;
    }
    return false;
}

// 添加版本检查功能
function checkForUpdates() {
    try {
        var host = "raw.githubusercontent.com";
        var path = "/Tyc-github/Advanced-Null-Controller/main/version.txt";
        
        var socket = new Socket();
        if (socket.open(host + ":443", "binary")) {
            var request = "GET " + path + " HTTP/1.1\r\n" +
                         "Host: " + host + "\r\n" +
                         "Connection: close\r\n\r\n";
            
            socket.write(request);
            var response = "";
            while (!socket.eof) {
                response += socket.read();
            }
            socket.close();
            
            // 解析响应内容
            var responseLines = response.split("\r\n");
            var latestVersion = responseLines[responseLines.length - 1].trim();
            
            if (compareVersions(CURRENT_VERSION, latestVersion)) {
                var updateDialog = new Window("dialog", "发现新版本");
                updateDialog.orientation = "column";
                updateDialog.add("statictext", undefined, "当前版本: " + CURRENT_VERSION + "\n最新版本: " + latestVersion + "\n是否前往下载更新？");
                
                var btnGroup = updateDialog.add("group");
                var githubBtn = btnGroup.add("button", undefined, "GitHub仓库");
                var giteeBtn = btnGroup.add("button", undefined, "Gitee仓库");
                var cancelBtn = btnGroup.add("button", undefined, "取消");
                
                githubBtn.onClick = function() {
                    system.callSystem('cmd.exe /c start "" "' + GITHUB_URL + '"');
                    updateDialog.close();
                }
                
                giteeBtn.onClick = function() {
                    system.callSystem('cmd.exe /c start "" "' + GITEE_URL + '"');
                    updateDialog.close();
                }
                
                cancelBtn.onClick = function() {
                    updateDialog.close();
                }
                
                updateDialog.center();
                updateDialog.show();
            } else {
                alert("当前已是最新版本 (" + CURRENT_VERSION + ")");
            }
        } else {
            alert("无法连接到更新服务器，请手动访问仓库查看\nGitHub: " + GITHUB_URL + "\nGitee: " + GITEE_URL);
        }
    } catch (err) {
        alert("更新检查失败: " + err.toString());
    }
}

// 修改帮助按钮点击事件
helpBtn.onClick = showHelpPanel;

// 统一按钮文字颜色为白色
mainBtn.textPen = cancelBtn.textPen = helpBtn.textPen = mainBtn.graphics.newPen(mainBtn.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);

// 添加主按钮右键菜单事件
mainBtn.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        isExpressionMode = !isExpressionMode;
        mainBtn.text = isExpressionMode ? "仅表达式" : "开搞";
        e.preventDefault();
    }
});

// 添加取消按钮右键菜单事件
cancelBtn.addEventListener('mousedown', function(e) {
    if (e.button == 2) {  // 右键点击
        isClearMode = !isClearMode;
        cancelBtn.text = isClearMode ? "清除" : "取消";
        e.preventDefault();
    }
});



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

        // 过滤掉已经有父级的图层
        var validLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].parent === null) {
                validLayers.push(selectedLayers[i]);
            }
        }

        if (validLayers.length === 0) {
            alert("请选择至少一个没有父级的图层！");
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
        app.beginUndoGroup("清除空对象控制器");
        
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
            if (layer.parent && hasControllerExpressions(layer)) {
                // 保存当前变换值
                var currentRotation = layer.rotation.value;
                var currentScale = layer.scale.value;
                var currentOpacity = layer.opacity.value;
                
                // 清除表达式
                if (layer.rotation.expression.indexOf('value - parent.transform.rotation') !== -1) {
                    layer.rotation.expression = '';
                }
                if (layer.scale.expression.indexOf('parentScale = parent.transform.scale.value') !== -1) {
                    layer.scale.expression = '';
                }
                if (layer.opacity.expression.indexOf('hasParent?parent.transform.opacity*parent.enabled:value') !== -1) {
                    layer.opacity.expression = '';
                }
                
                // 移除父级关系
                layer.parent = null;
                
                // 恢复变换值
                layer.rotation.setValue(currentRotation);
                layer.scale.setValue(currentScale);
                layer.opacity.setValue(currentOpacity);
            }
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
    }
    win.close();
}

// 显示面板
win.center();
win.show();
