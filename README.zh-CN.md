# 今天吃什么？🎰

[English](./README.md)

> 不知道吃什么？拉下拉杆，让老虎机帮你决定。

**今天吃什么？** 是一个赌场风格的老虎机网页应用，把每天纠结「吃什么」的难题变成一个有趣的、可分享的小游戏。创建一个食物列表，添加你喜欢的食物，然后转动转轮。中间的转轮决定你的餐点 — 除非三个转轮全部匹配，那就是大奖！

## 在线演示

[whattoday-ten.vercel.app](https://whattoday-ten.vercel.app)

## 截图

<!-- 在此添加截图 -->

## 功能特点

**老虎机**
- 拟物化写实设计：拉丝钢机身、镀铬边框、背光赔率表
- 三个独立转轮，交错旋转节奏，带机械回弹动画
- 弹簧物理拉杆，带阻尼振荡效果
- 三轮匹配时触发大奖庆祝（彩带特效）
- 拉杆、旋转、中奖音效

**食物管理**
- 添加食物名称和可选图片（链接或上传）
- 二次确认删除
- 引导式新手体验 — 新列表自动打开食物面板

**分享**
- 每个列表生成唯一短链接
- 分享按钮在每次结果展示时出现
- 收到链接的人可以看到相同的食物列表并自行转动

**国际化**
- 自动检测浏览器语言
- 支持英文和简体中文

## 技术栈

| 层级 | 技术 |
|------|-----|
| 框架 | [Next.js 16](https://nextjs.org)（App Router、TypeScript） |
| 样式 | [Tailwind CSS v4](https://tailwindcss.com) |
| 动画 | [Framer Motion](https://www.framer.com/motion/) |
| 数据库 | [Supabase](https://supabase.com)（PostgreSQL） |
| 存储 | [Supabase Storage](https://supabase.com/docs/guides/storage) |
| 音效 | [Howler.js](https://howlerjs.com) |
| 特效 | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| 字体 | Press Start 2P、Abril Fatface（Google Fonts） |
| 部署 | [Vercel](https://vercel.com) |

## 快速开始

### 前置条件

- Node.js 18+
- 一个 [Supabase](https://supabase.com) 项目

### 1. 克隆并安装

```bash
git clone https://github.com/ehowang/whattoday.git
cd whattoday
npm install
```

### 2. 配置 Supabase

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 进入 **SQL Editor**，运行 [`supabase/schema.sql`](./supabase/schema.sql) 中的全部内容
3. 进入 **Storage** → 创建名为 `food-images` 的存储桶 → 设为**公开**
4. 进入 **Settings** → **API**，复制项目 URL 和 anon key

### 3. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 凭证：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 启动

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 部署

推送到 GitHub，在 [Vercel](https://vercel.com) 导入仓库。在 Vercel 项目设置中添加两个环境变量（`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`）。Vercel 自动检测 Next.js 并完成部署。

## 项目结构

```
src/
├── app/
│   ├── page.tsx                  # 首页
│   ├── layout.tsx                # 根布局（字体加载）
│   ├── globals.css               # 赌场主题 CSS
│   ├── api/
│   │   ├── lists/route.ts        # POST：创建食物列表
│   │   └── upload/route.ts       # POST：上传食物图片
│   └── l/[shortCode]/
│       ├── page.tsx              # SSR 列表页
│       └── SlotMachineClient.tsx # 客户端老虎机容器
├── components/
│   ├── SlotMachine.tsx           # 主机柜：赔率表、转轮、控制面板
│   ├── Reel.tsx                  # 单个转轮（回弹动画）
│   ├── Lever.tsx                 # 弹簧物理拉杆
│   ├── ResultDisplay.tsx         # 结果展示（含分享按钮）
│   ├── FoodDrawer.tsx            # 侧滑食物管理面板
│   ├── FoodItemForm.tsx          # 添加食物表单
│   ├── FoodItemCard.tsx          # 食物卡片（含删除）
│   └── CasinoLights.tsx         # 装饰指示灯
└── lib/
    ├── supabase.ts               # Supabase 客户端（懒加载单例）
    ├── i18n.ts                   # 浏览器语言检测 + 翻译
    ├── sounds.ts                 # 音效管理器（Howler.js）
    ├── shortcode.ts              # nanoid 短码生成器
    └── types.ts                  # TypeScript 类型定义
```

## 许可证

MIT
