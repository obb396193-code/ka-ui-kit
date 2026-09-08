# 第三方源码出处

本仓包含从官方来源原样复制的第三方组件源码。记在这里是为了可追溯：来源、许可、取得时间、本地路径、以及改了什么。

新增第三方组件时按同样格式登记，别只把文件丢进来。

---

## shadcn/ui

- **许可**：MIT
- **来源**：官方 registry，经 `shadcn` 命令行工具取得
- **本地路径**：`components/ui/`（15 个文件）
- **配置**：`components.json`，style 为 `new-york-v4`，baseColor 为 `neutral`，启用 CSS 变量
- **改动**：无。原样保留，方便跟官方升级对齐。

只带了 15 个，是本仓这几个壳的传递闭包，不是 shadcn 全部组件。缺什么用命令行工具装，或从 KA Pilot 主仓 `apps/web/components/ui/` 复制，同一套 style 和 baseColor 互相兼容。

## Dice UI Color Picker

- **许可**：MIT
- **来源**：`https://diceui.com/r/radix-vega/color-picker.json`
- **取得时间**：2026-09-05
- **完整性校验**：`sha256:5d89891ef49484aca44242c625e618ad132f4084c1c144fefe98abf2fe66bb03`
- **本地路径**：`components/dice/`（6 个文件：`color-picker.tsx`、`compose-refs.ts`、`visually-hidden-input.tsx`，以及 `hooks/` 下三个）
- **改动**：只改了 import 路径，指向本仓的 shadcn 组件和同目录 hook。**焦点、ARIA、受控行为一律未改。**
- **ESLint**：`eslint.config.mjs` 对这个目录开了两条豁免，保持上游写法，不为本仓风格改动它。

## Geist 字体

- **许可**：SIL Open Font License 1.1，全文见 `app/fonts/GEIST-LICENSE.txt`
- **来源**：`geist` 包 1.7.2 版
- **本地路径**：`app/fonts/Geist-Variable.woff2` 和 `GeistMono-Variable.woff2`
- **为什么本地放**：内网环境拉不到外部字体服务，必须本地加载。

## MiSans 字体

- **许可**：小米免费商用，全文在 `node_modules/misans/LICENSE`
- **来源**：npm 包 `misans` 4.1.0
- **本地路径**：不进仓。`scripts/fonts/prepare-misans.mjs` 在 postinstall 生成到 `app/fonts/misans/`，该目录已在忽略列表里。
- **改动**：生成时修正了字重映射。npm 包把常规体登记成 330、380、520，浏览器要 400 时会抓到 Medium，字看着发粗。脚本改成 400、500、600。

---

## 添加新组件时的规矩

1. 只从官方 registry、官方仓库或官方代码面板取源码。不从搬运站取，不绕过登录墙或许可校验。
2. **原样复制，只改 import 路径。** 焦点管理、ARIA 关系、portal、受控状态、键盘行为都别动，那些是组件正确性的一部分。
3. 在本文件登记：来源 URL、许可、取得时间、本地路径、改了什么。有哈希就记哈希。
4. 需要为上游写法开 ESLint 豁免时，按来源目录开，别全局关规则。
5. 同一能力多个库都有时，做成同业务容器并排对比再选，别让 agent 自己拍。
