# Advanced Null Controller by 烟囱

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![After Effects](https://img.shields.io/badge/After%20Effects-CS6%2B-9999FF)

</div>

## 📦 项目信息
- **项目名称**：Advanced-Null-Controller
- **仓库地址**：https://github.com/Tyc-github/Advanced-Null-Controller
- **问题反馈**：[Issues](https://github.com/Tyc-github/Advanced-Null-Controller/issues)

## ✨ 功能特点

这是一个用于 After Effects 的脚本，可以快速创建空对象并设置父子级关系，同时可以选择添加属性表达式控制。

### 🛠 主要功能
- 默认创建居中的空对象控制器，自动设置父子级关系
- 可选择性添加属性表达式
- 可以设置仅添加表达式而不创建空对象和设定父子级
- 可以清除选中图层的表达式和父子级关系
- 子级可以不随父子⭕旋转、📐缩放，而且可以单个空对象的👁不透明度控制全部子级的不透明度

## 💡 使用方法

### 基础使用
1. 在 AE 中选择要控制的图层
2. 运行脚本
3. 选择要添加的控制属性（旋转/缩放/不透明度）
4. 点击"开搞"按钮

### 🔄 按钮功能
- **开搞**（左键）：创建空对象并设置父子级关系
- **开搞**（右键）：切换到"仅表达式"模式，仅添加勾选的表达式
- **取消**（左键）：关闭面板
- **取消**（右键）：切换到"清除"模式，清除选中图层的表达式和父子级关系

### 💫 特殊功能
- **仅表达式模式**：只添加表达式，不创建新的空对象和设置父子级关系
- **清除模式**：移除已有的控制器关系和表达式

## 🔍 技术细节

### 使用表达式进行控制
- **旋转**：
  ```javascript
  value - parent.transform.rotation
  ```
- **缩放**：
  ```javascript
  s = [];
  parentScale = parent.transform.scale.value;
  for (i = 0; i < parentScale.length; i++){
      s[i] = (parentScale[i]== 0) ? 0 : value[i]*100/parentScale[i];
  }
  s
  ```
- **不透明度**：
  ```javascript
  hasParent?parent.transform.opacity*parent.enabled:value
  ```

### 🎯 创建的空对象特性
- 大小：100x100 像素
- 位置：自动计算所选图层的中心位置
- 不透明度：默认设置为 100%
- 命名规则：[首个选中图层名称]_控制器

## ⚠️ 注意事项
1. 使用前请先选择要控制的图层
2. 至少选择一个要添加的控制属性
3. 清除功能会保持图层当前的变换值
4. 支持2D和3D图层的控制

## 🔧 兼容性
- 支持 After Effects CS6 及以上版本
- 支持 Windows 和 MacOS 系统
- 目前仅在中文版AE进行测试

## 📝 更新日志
### v1.0.0
- 初始版本发布
- 实现基础功能
- 添加界面交互
- 支持多种控制模式

## 👨‍💻 作者
- 作者：烟囱
- 版本：1.0.0 