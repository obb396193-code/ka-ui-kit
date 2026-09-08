# ka-ui-kit

KA Pilot（快手渠道投放经营平台）的设计系统启动套件。给同团队做数据看板的项目当起点。

拿到这个包的目的：**不用自己试审美。** 里面的 token、组件、规范是产品负责人逐页口头拍板打磨出来的，照着用就能做出同一水准的界面。

---

## 先跑起来看

```bash
npm install
NEXT_PUBLIC_DATA_PROVIDER=mock npx next dev -p 3500
```

打开 `http://localhost:3500`，你会看到一个验收页：页头五件套、六个 KPI 卡、母版表格、右上角三套主题一键切、八种页面状态可切。

**先把这一页看明白再动手。** 规范文字里写的「真黑真白不要灰」「点彩」「缺数显 −」，看文字复现不出来，看一眼页面就懂了。让你的 agent 也看。

首次启动会慢一点，Tailwind 首次编译需要时间，页面暂时打不开不是挂了。

看完之后 `app/demo-page.tsx` 和 `app/page.tsx` 就可以删了，换成你自己的页面。

---

## 里面有什么

| 目录 | 是什么 | 能不能改 |
|---|---|---|
| `docs/` | 五份文档：执行规范、审核清单、组件选型流程、前端规范与组件复用、数据抓取指南 | 读，别改 |
| `app/globals.css` | 全套设计 token。三套主题模式 + 状态色 + 字体栈，61 处语义变量 | 只加不删，别硬编码颜色绕过它 |
| `lib/theme/theme.ts` | 主题状态机 + 18 个预设主色 + 首屏防闪脚本 | 预设色可以换成你的品牌色 |
| `components/ui/` | 15 个 shadcn 官方件，未改动 | 别改，方便跟官方升级 |
| `components/dice/` | Dice UI 取色器官方源码 | 别改，ESLint 已给它开豁免 |
| `components/business/` | 表壳、页头、八态壳、页签、主题开关 | 这层是给你改的 |
| `scripts/fonts/` | MiSans 切片生成（postinstall 自动跑） | 别改 |

字体栈是 `Geist → PingFang SC → MiSans → Microsoft YaHei`。Mac 用苹方零下载，Windows 用 MiSans 兜底。Geist 的 woff2 在 `app/fonts/`，许可证是 SIL OFL 1.1。

第三方源码的来源、许可、取得时间和改动记录都在 `THIRD-PARTY.md`。新增第三方组件时按同样格式登记。

---

## 给 agent 的开工提示词

直接复制给你的 agent：

```
你是「数据看板」项目的前端工程师。

【最高优先级】视觉和组件你没有决定权，只有执行权。本项目的设计规范来自 KA Pilot
（同团队快手渠道的投放经营平台），已由产品负责人逐页拍板冻结。你的任务是照规范执行，
不是重新设计。任何"我觉得这样更好看"的自主发挥都是错的。

【先读，按顺序】
1. docs/frontend-product-standard.md —— 视觉/数字/密度/动效/表格/图表全部硬规则
2. docs/前端视觉与体验审核清单.md —— 交付前逐条自检
3. docs/agent-workflow.md —— 需要新组件时的查找流程
4. app/globals.css 与 lib/theme/theme.ts —— 设计 token，只用语义 token，禁止硬编码颜色
5. app/demo-page.tsx —— 上面那些规则落成代码长什么样

【四条铁律，违反即返工】
1. 组件绝不自写。需要一个组件时：先查有没有官方件 → 原样复制进仓 → 只写业务适配层。
   同一能力多个库都有时，做成并排对比给人挑，你不自选。
2. 只用语义 token。颜色、圆角、阴影、密度一律走 CSS 变量，不在组件里散落硬编码值。
   真黑真白，灰只做发丝线，绝不要「灰灰的」。红绿黄是状态色，不参与配色。
3. 前端永不算数。所有指标由后端返回，前端只格式化，一律走 components/business/data-grid/format.ts。
   缺数显 −，分母 0 显 −，绝不显 0。只有后端明示"有数据且为零"才显 0。
4. 不造假数据。没接口的模块做诚实空态，用 ExampleBlock 标「示例」角标 + 写明解锁条件。

【每个页面必须覆盖八态】
用 StateFrame 包：normal / loading / empty / partial / stale / error / forbidden / disabled
只做"正常有数据"一条路径的页面不合格。

【表格统一】
全站一种表壳 components/business/data-grid/data-grid.tsx：勾选框列 / 名字一行（不放 ID 副行）/
类型 chip / 带图标状态 chip / 行末 ⋮ 菜单 / 「已选 N 条，共 M 条」页脚 + 批量动作。
详情用行内展开（renderExpanded），不用右侧抽屉。红绿状态同时给文字或图标，不能只靠颜色。

【页头常显五件】
空间 · 来源 · 数据日期 · 更新时间 · 口径 ⓘ
换数据源导致数字变化时，用户要一眼看出是换源不是算错。

【交付自检】
TypeScript 0 错 / ESLint 0 错 / 三套主题都验 / 明暗都验 /
1440 与 1366 与 390 三个视口无横向溢出 / 控制台 0 error /
键盘可达且焦点可见 / prefers-reduced-motion 生效

【报告纪律】
只报已核实的状态。"官方有"不等于"项目已有"。没验证过的不要写"已完成"。
```

---

## 常用件怎么用

照 `app/demo-page.tsx` 抄。要点：

**表格**：`useGridTable` 建表，`createColumnHelper<GridFeatures, YourRow>()` 定义列，`selectionColumn()` 和 `actionsColumn()` 放首尾，`DataGrid` 渲染。列显隐初始值必须走 `initialColumnVisibility` 参数，**不能在渲染中 setState**，否则 hydration 报错。

**缺数**：`MissingValue` 组件，或格式化函数传 null 自动出 −。

**八态**：`StateFrame` 包内容，`usePageState` 从地址栏读态，`StateSwitch` 是演示期的切换器。

**示例态**：`ExampleBlock` 传 `unlock` 说明解锁条件。角标别用绝对定位压右上角，会盖住按钮，我们踩过。

**页签**：`usePageTab` + `PageTabs`，状态同步到地址栏的 `?tab=`。子功能做成页签，不要开独立路由、不要进侧栏。

**主题**：根布局已接 `THEME_INIT_SCRIPT` 防首屏闪色。页面里放 `ThemeSwitch` 即可，位置固定在顶栏右上角。

---

## 已知的坑

| 坑 | 症状 | 解法 |
|---|---|---|
| 读地址栏参数的组件 | build 报错，dev 不报 | 包一层 `Suspense`，见 `app/page.tsx` |
| 表格列显隐 | hydration 不一致 | 走 `initialColumnVisibility`，不在渲染中 setState |
| 面包屑分隔符 | 二级页 hydration 报错 | shadcn 的分隔符本身是 `<li>`，必须和条目平级 |
| 示例角标 | 盖住内容的按钮 | 别用绝对定位，跟解锁说明同一行 |
| dev 日志放仓库里 | 页面 20 到 40 秒才出来 | 日志文件写到仓库外，否则触发文件监听循环重编译 |
| 装包卡住 | npm 长时间无输出 | 走代理，别在沙箱里装 |

---

## 没有包含什么

这个包**不含**业务逻辑、数据层、登录、侧栏导航、图表库。

原因：那些和业务强绑定，你的看板和我们的业务不同，照搬反而是负担。

需要图表的话自己选，我们主仓里 ECharts 和 Recharts 并存是历史遗留，你新起项目**只选一个**，建议 ECharts，配置驱动、能按需引入、能接主题桥。

侧栏导航我们主仓有 `components/ui/sidebar.tsx`（shadcn 官方件），需要就去主仓拿。

我们主仓里也有几样规范文档提到但**实际没做**的，别信文档说"已有"：Storybook 没装、正式图表层没建、token 桥没实现、视觉回归没配、错误上报没接。
