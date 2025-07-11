(function run() {
    // 添加调试辅助函数
    function logDebug(message) {
        $.writeln("[DEBUG] " + message);
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
                var zPos = position[2] || 0; // 默认Z轴为0
                zmin = Math.min(zmin, zPos);
                zmax = Math.max(zmax, zPos);
            }
        });

        var xpos = (xmin + xmax) / 2;
        var ypos = (ymin + ymax) / 2;
        var zpos = allLayersAre3d ? (zmin + zmax) / 2 : 0;

        return allLayersAre3d ? [xpos, ypos, zpos] : [xpos, ypos];
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

    // 创建空对象
    function createNullObject(comp, name, size, position) {
        try {
            logDebug("尝试创建空对象 '" + name + "'");
            
            // 创建新的空对象
            var nullLayer = comp.layers.addNull();
            if (!nullLayer) {
                logDebug("创建空对象失败!");
                return null;
            }
            
            logDebug("成功创建空对象，准备设置名称和属性");

            // 设置空对象的名字
            nullLayer.name = name;
            nullLayer.source.name = name;

            // 设置空对象的宽高及位置
            nullLayer.source.width = size;
            nullLayer.source.height = size;
            
            try {
                if (position && position.length >= 2) {
                    logDebug("设置空对象位置为: [" + position.join(", ") + "]");
                    nullLayer.property("Position").setValue(position);
                } else {
                    logDebug("未提供有效的位置信息或位置信息不完整");
                }
            } catch (posErr) {
                logDebug("设置位置时出错: " + posErr.toString());
            }
            
            try {
                nullLayer.anchorPoint.setValue([size / 2, size / 2]);
            } catch (anchorErr) {
                logDebug("设置锚点时出错: " + anchorErr.toString());
            }

            logDebug("空对象 '" + name + "' 创建并设置完成");
            return nullLayer;
        } catch (err) {
            logDebug("在createNullObject函数中发生错误: " + err.toString());
            return null;
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
            return;
        }
        
        logDebug("当前合成: " + composition.name);
        
        // 使用原生confirm对话框询问用户
        var dialogResult = confirm("空对象放置模式：\n\n● 确定：保持在原图层上一层\n● 取消：全部创建在合成顶部");
        
        // 如果用户点击X关闭对话框，confirm会返回false，我们将其视为取消操作
        if (dialogResult === null || dialogResult === undefined) {
            logDebug("用户关闭了对话框，退出脚本执行");
            return; // 立即退出脚本
        }
        
        var placeMode = dialogResult;
        
        app.beginUndoGroup("层层空 - " + (placeMode ? "原图层上一层" : "合成顶部"));
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
            return;
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
    } catch (mainErr) {
        alert("脚本执行时发生错误: " + mainErr.toString());
        logDebug("主脚本执行时发生错误: " + mainErr.toString());
        app.endUndoGroup();
    }
})();
