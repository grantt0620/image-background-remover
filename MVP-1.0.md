# Image Background Remover — MVP v1.0 需求文档

---

## 一、产品概述

| 项目 | 内容 |
|------|------|
| 产品名称 | Image Background Remover |
| 版本 | MVP v1.0 |
| 目标用户 | 电商卖家、设计师、社交媒体运营者、普通用户 |
| 核心价值 | 一键AI去除图片背景，免费、快速、无需注册 |
| 部署平台 | Cloudflare Pages + Workers |
| 上线目标 | 2周内完成开发并上线 |

---

## 二、核心功能（MVP范围）

### ✅ F1 — 图片上传
- 支持点击上传 和 拖拽上传
- 支持格式：JPG、PNG、WEBP
- 文件大小限制：≤ 10MB
- 单次处理：1张图片

### ✅ F2 — 背景自动去除
- 调用 Remove.bg API 处理
- 图片在内存中流转，不写入任何存储
- 处理时显示 Loading 状态
- 处理失败时显示友好错误提示

### ✅ F3 — 结果预览
- 左右对比展示（原图 vs 去背景图）
- 透明背景用棋盘格样式展示
- 支持切换不同背景色预览效果（白/黑/自定义色）

### ✅ F4 — 图片下载
- 下载格式：PNG（保留透明通道）
- 一键下载，文件命名：`原文件名-removed-bg.png`

### ✅ F5 — Cloudflare Worker 代理
- 前端不直接暴露 Remove.bg API Key
- Worker 转发请求，隐藏密钥
- 基础防滥用：IP 限流（每IP每小时最多20次）

---

## 三、不在MVP范围内（后续版本）

| 功能 | 计划版本 |
|------|------|
| 批量上传处理 | v1.1 |
| 用户注册/登录 | v1.2 |
| 付费订阅/额度管理 | v1.2 |
| API对外开放 | v2.0 |
| 图片编辑（调整/裁剪） | v1.1 |
| 历史记录 | v1.2 |

---

## 四、页面结构

```
首页（单页应用）
├── Header — Logo + 产品名称
├── Hero区 — 标题 + 副标题（含核心关键词）
├── 上传区 — 拖拽/点击上传组件
├── 处理区 — Loading动画
├── 结果区 — 左右对比 + 下载按钮
└── Footer — 说明文字 + 隐私政策链接
```

---

## 五、技术架构

```
前端（Cloudflare Pages）
  └── 纯静态 HTML + Vanilla JS / 或 Next.js

后端（Cloudflare Workers）
  └── /api/remove-bg
        ├── 接收前端图片（multipart/form-data）
        ├── 转发至 Remove.bg API
        ├── 返回处理后的PNG
        └── IP限流（Cloudflare KV 或 内存计数）

第三方服务
  └── Remove.bg API（背景去除核心能力）
```

---

## 六、非功能性需求

| 指标 | 目标 |
|------|------|
| 响应时间 | 图片处理 ≤ 8秒 |
| 可用性 | 99%（依赖CF和Remove.bg SLA） |
| 隐私 | 图片不存储，处理完即销毁 |
| SEO | 页面含核心关键词，支持Google索引 |
| 移动端 | 响应式布局，支持手机使用 |

---

## 七、SEO 关键配置

- **页面Title**：`Free Image Background Remover — Remove BG Online Instantly`
- **Meta Description**：`Remove image background in seconds with AI. Free, no signup required. Upload JPG/PNG and download transparent PNG instantly.`
- **H1**：`Remove Image Background Free & Instantly`
- **页面语言**：英文（主站），后续扩展多语言

---

## 八、成本估算（MVP阶段）

| 项目 | 费用 |
|------|------|
| Cloudflare Pages + Workers | 免费（或 $5/月 Paid版） |
| Remove.bg API | 按量付费，约 $0.2/张（可申请免费额度测试） |
| 域名 | ~$10/年 |
| **总计** | **基本免费起步** |

---

## 九、上线检查清单

- [ ] Worker 部署完成，API Key 通过环境变量注入
- [ ] 前端页面完成，移动端适配
- [ ] Remove.bg API 调通，测试3种图片格式
- [ ] IP限流逻辑测试
- [ ] SEO meta 标签配置
- [ ] 隐私政策页面（简版）
- [ ] 自定义域名绑定
- [ ] Google Search Console 提交
