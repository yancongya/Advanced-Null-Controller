// 选择子级
// 版本: 1.0
// 功能: 选择当前选中图层的所有子级图层

(function selectChildren() {
    // 添加调试辅助函数
    function logDebug(message) {
        $.writeln("[选择子级] " + message);
    }

    try {
        // 获取当前活动合成
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("请先选择一个合成!");
            return;
        }

        logDebug("当前合成: " + comp.name);

        // 获取当前选中的图层
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("请先选择至少一个图层!");
            return;
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
            return;
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
        
        // 显示结果，除非找到的数量太多
        // if (foundCount <= 20) {
        //     alert("已选中 " + foundCount + " 个子级图层");
        // } else {
        //     // 如果子级太多，显示简略信息
        //     alert("已选中 " + foundCount + " 个子级图层\n(数量较多，不显示详细列表)");
        // }
        
        // 记录到日志而不是弹窗
        logDebug("已选中 " + foundCount + " 个子级图层");
        
    } catch (err) {
        alert("执行脚本时发生错误: " + err.toString());
        logDebug("执行脚本时发生错误: " + err.toString());
    }
})(); 