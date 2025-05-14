# 高级空对象控制器 - 函数文档

本文档详细介绍了 `Advanced Null Controller 2.1.jsx` 脚本中使用的各个函数。

## UI 创建函数

### `createStyledPanel(parent, title)`
/**
 * 创建一个带有自定义样式的 Panel 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} title 面板标题。
 * @returns {Panel} 创建的 Panel 对象。
 */

### `createStyledButton(parent, text, size, isPrimary)`
/**
 * 创建一个带有自定义样式的 Button 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} text 按钮显示的文本。
 * @param {Array<Number>} size 按钮的尺寸 [width, height]。
 * @param {Boolean} isPrimary 是否为主按钮样式。
 * @returns {Button} 创建的 Button 对象。
 */

### `createStyledCheckbox(parent, text)`
/**
 * 创建一个带有自定义样式的 Checkbox 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} text Checkbox 标签文本。
 * @returns {Checkbox} 创建的 Checkbox 对象。
 */

### `createStyledText(parent, text, width, isClickable)`
/**
 * 创建一个带有自定义样式的 StaticText 控件。
 * @param {Group|Panel|Window} parent 父容器。
 * @param {String} text 静态文本内容。
 * @param {Number} [width] 可选，文本控件的期望宽度。
 * @param {Boolean} [isClickable] 可选，文本是否可点击并具有激活状态。
 * @returns {StaticText} 创建的 StaticText 对象。
 */

## 逻辑辅助函数

### `getActiveComp()`
/**
 * 获取当前活动的合成 (Composition)。
 * 如果没有活动合成或活动项不是合成，则提示用户并返回 null。
 * @returns {CompItem|null} 当前活动的合成对象，或 null。
 */

### `getSelectedLayersWithValidation(comp)`
/**
 * 获取选中的图层，并进行有效性验证。
 * @param {CompItem} comp 要从中获取图层的合成对象。
 * @returns {Array<Layer>|null} 选中的图层数组，如果无选中图层或 comp 为 null 则返回 null。
 */

### `handleLockedLayers(layers)`
/**
 * 处理选定图层中的锁定图层。
 * 如果检测到锁定图层，会提示用户是否临时解锁。
 * @param {Array<Layer>} layers 要检查的图层数组。
 * @returns {{cancel: Boolean, layersToRestoreLock: Array<Layer>}}
 *      一个对象，包含:
 *      - cancel: (Boolean) 用户是否取消了操作。
 *      - layersToRestoreLock: (Array<Layer>) 被临时解锁的图层数组，用于后续恢复锁定状态。
 */

### `filterLayersWithoutParent(layers)`
/**
 * 从图层数组中筛选出没有父级的图层。
 * @param {Array<Layer>} layers 要筛选的图层数组。
 * @returns {Array<Layer>|null} 没有父级的图层数组，如果所有图层都有父级或输入为空则返回 null。
 */

### `calculateCenterPosition(layers)`
/**
 * 计算并返回所选图层集合的中心位置。
 * 支持2D和3D图层。对于3D图层，会计算X, Y, Z的中心；对于2D图层，Z轴默认为0。
 * @param {Array<Layer>} layers 图层数组。
 * @returns {Array<Number>} 包含中心位置坐标的数组 ([x, y] 或 [x, y, z])。
 */

### `createNullObject(comp, name, size, position, insertLayer)`
/**
 * 创建一个新的空对象 (Null Layer)。
 * @param {CompItem} comp 要在其中创建空对象的合成。
 * @param {String} name 空对象的名称。
 * @param {Number} size 空对象的尺寸 (source.width 和 source.height)。
 * @param {Array<Number>} [position] 可选，空对象的位置 [x, y] 或 [x, y, z]。
 * @param {Layer} [insertLayer] 可选，空对象将插入到此图层之前。
 * @returns {Layer} 创建的空对象图层。
 */

### `unlinkParents(layers)`
/**
 * 解除指定图层数组中所有图层的父子关系。
 * @param {Array<Layer>} layers 要解除父子关系的图层数组。
 * @returns {Array<{layer: Layer, parent: Layer}>} 包含原始父级信息的对象数组。
 *          每个对象有 'layer' (子图层) 和 'parent' (原始父图层) 属性。
 */

### `applyExpressionsToLayer(layer, applyRotate, applyScale, applyOpacity)`
/**
 * 为指定图层应用反向控制表达式。
 * 根据传入的布尔参数决定为旋转、缩放、不透明度属性添加表达式。
 * 表达式用于抵消父级图层的对应变换。
 * @param {Layer} layer 要应用表达式的图层。
 * @param {Boolean} applyRotate 是否应用旋转表达式。
 * @param {Boolean} applyScale 是否应用缩放表达式。
 * @param {Boolean} applyOpacity 是否应用不透明度表达式。
 */

### `hasControllerExpressions(layer)`
/**
 * 检查图层是否已应用了此脚本创建的特定控制器表达式。
 * @param {Layer} layer 要检查的图层。
 * @returns {Boolean} 如果图层包含任一匹配的控制器表达式则返回 true，否则返回 false。
 */

### `restoreLockedLayers(layersToRestore)`
/**
 * 恢复之前被临时解锁的图层的锁定状态。
 * @param {Array<Layer>} layersToRestore 需要恢复锁定状态的图层数组。
 */

## 主要功能函数

### `createNullControl()`
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

### `clearNullControl()`
/**
 * 清除选中图层的控制器表达式和父子关系。
 * - 保存当前变换值（如果属性没有关键帧）。
 * - 清除旋转、缩放、不透明度属性的表达式。
 * - 恢复保存的变换值（如果之前已保存）。
 * - 解除图层的父级链接。
 * @returns {Boolean} 操作是否成功。
 */

### `addExpressionsOnly()`
/**
 * 仅为选中的图层添加反向控制表达式。
 * 图层必须有父级才能应用这些表达式。
 * - 检查是否选择了至少一个控制属性（旋转、缩放、不透明度）。
 * - 遍历选中图层，如果图层有效且有父级，则应用所选表达式。
 * @returns {Boolean} 操作是否成功。
 */

### `handleGlobalControlButtonClick()`
/**
 * 处理"整体控制"按钮的点击事件。
 * - 如果当前选中了图层：为选中的、无父级的图层创建一个共享的"整体控制器"空对象，
 *   并将这些图层父级链接到该控制器。会处理锁定图层和已存在父级的情况。
 *   计算中心点时使用所有选中的（已解锁）图层，但仅为其中无父级的图层设置父级。
 *   解除父级关系也只针对这些无父级的图层（虽然它们已经没有父级，但这是为了获取 originalParentsInfo，尽管在这里可能为空）。
 * - 如果当前未选中图层：查找并选中合成中所有无父级且未应用控制器表达式的图层。
 */

### `showHelpPanel()`
/**
 * 显示帮助和使用说明面板。
 * 面板包含脚本的基本操作、高级选项、按钮功能说明以及相关链接。
 */

#### `showHelpPanel()` 内部函数: `addTitle(text)`
// (隐式属于 showHelpPanel - 用于在帮助对话框中创建带样式的标题)

#### `showHelpPanel()` 内部函数: `addContent(text)`
// (隐式属于 showHelpPanel - 用于在帮助对话框中创建带样式的正文文本)

#### `showHelpPanel()` 内部函数: `addSeparator()`
// (隐式属于 showHelpPanel - 用于在帮助对话框中添加分隔符)

#### `showHelpPanel()` 内部函数: `createLinkButton(parent, text, icon, url)`
/**
     * 内部辅助函数：创建带图标和链接的文本按钮。
     * @param {Group|Panel} parent 父容器。
     * @param {String} text 显示的链接文本。
     * @param {String} icon 显示的图标字符 (例如 '₪')。
     * @param {String} url 点击后要打开的URL。
     * @returns {Group} 创建的包含图标和文本的 Group 对象。
     */ 