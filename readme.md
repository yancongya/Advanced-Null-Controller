# Advanced Null Controller

*一个强大的 After Effects 空对象控制器脚本*

## 📦 项目概述

Advanced Null Controller 是一个专为 After Effects 设计的高级空对象控制器脚本，它能帮助您更高效地管理图层动画。通过智能的控制器系统和灵活的表达式，让您的动画制作更加便捷。

- **仓库地址**：GitHub https://github.com/Tyc-github/Advanced-Null-Controller
- **支持版本**：After Effects CS6 及以上版本
- **开源协议**：MIT

## 🚀 快速开始

1. 选择目标图层
2. 运行脚本
3. 选择控制属性
4. 点击"开搞"创建控制器

## ✨ 核心功能

### 🎯 基础功能
- **智能空对象创建**
  - 自动在所选图层中心位置创建控制器
  - 支持多图层批量创建
  - 智能层级管理系统
  - 自动处理锁定图层

- **灵活属性控制**
  - 位置控制（自动居中）
  - 旋转控制（可选）
  - 缩放控制（可选）
  - 不透明度控制（可选）

### 🌟 高级功能
- **多层级控制系统**
  - 基础控制器：直接控制单个图层
  - 子控制器：控制一组相关图层
  - 总控制器：统一管理所有子级
  - 智能层级关系维护

- **智能表达式系统**
  - 独立旋转控制
  - 独立缩放控制
  - 联动不透明度控制
  - 仅表达式模式支持
  - 表达式清除功能

- **整体控制功能**
  - 自动查找未控制图层
  - 批量创建控制器
  - 智能位置计算
  - 层级关系优化

## 🎮 使用指南

### 按钮功能
| 按钮 | 左键点击 | 右键点击 |
|------|----------|----------|
| 开搞 | 创建控制器 | 切换到仅表达式模式 |
| 取消 | 关闭面板 | 切换到清除控制器模式 |
| 帮助 | 查看使用说明 | - |

### 高级选项
- **总控制**
  - 右键点击激活
  - 创建总控制器
  - 统一管理所有子级

- **子控制**
  - 右键点击激活
  - 创建子级控制器
  - 精细控制单个元素

- **整体控制**
  - 自动查找未控制图层
  - 批量创建控制器
  - 智能位置计算

### 进阶技巧
- 使用总控制器实现整体动画
- 通过子控制器微调单个元素
- 利用表达式模式扩展现有控制器
- 合理使用清除功能重置控制关系
- 智能处理锁定图层

## ⚠️ 注意事项

- 操作前请确保选择正确的图层
- 清除功能会保留当前变换值
- 建议定期保存工程文件
- 遇到问题请通过 Issues 反馈
- 锁定图层需要临时解锁才能创建控制器

## 🔄 工作流程

```mermaid
graph TD
    A[启动脚本] --> B[创建UI界面]
    B --> C{用户交互}
    C -->|标题栏 Ctrl+Click| D[检查更新]
    C -->|帮助按钮| E[显示帮助面板]
    C -->|主功能按钮| F{功能模式}
    F -->|创建模式| G[图层校验]
    G -->|成功| H[创建控制器]
    G -->|失败| I[错误提示]
    F -->|清除模式| J[清除操作]
    H --> K[智能层级管理]
    K --> L[表达式设置]
    L --> M[完成操作]
```

## 🤝 参与贡献

欢迎提交 Issues 和 Pull Requests 来帮助改进这个项目！

## 🔗 相关链接

- [Bilibili](https://space.bilibili.com/100881808)
- [小红书](https://www.xiaohongshu.com/user/profile/5c009931f7e8b962bb328c6d)
- [爱发电](https://afdian.com/item/2c972f4608a411f09e8e52540025c377)
