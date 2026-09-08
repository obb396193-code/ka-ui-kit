"use client"

import { useMemo, useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"

import {
  actionsColumn,
  DataGrid,
  MissingValue,
  selectionColumn,
  StatusChip,
  TypeChip,
  useGridTable,
  type GridFeatures,
} from "@/components/business/data-grid/data-grid"
import { formatDate, formatInteger, formatMoney, formatRatio, type RatioLike } from "@/components/business/data-grid/format"
import { PageBody, PageHeader } from "@/components/business/page-header"
import { StateFrame, StateSwitch, usePageState } from "@/components/business/state/page-state"
import { PageTabs, usePageTab } from "@/components/business/tabs/page-tabs"
import { ThemeSwitch } from "@/components/business/theme/theme-switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

// 这页是「样子对不对」的验收页，不是业务页。
// 它演示：页头五件套 / 三套主题一键切 / 八态壳 / 母版表壳 / 缺数显 − / 状态 chip / 示例角标。
// 你照这个结构做自己的页面，然后把这个文件删掉。

type Row = {
  id: string
  name: string
  kind: string
  status: "投放中" | "暂停" | "异常" | "待开户"
  spend: number | null
  conversion: number | null
  cpa: RatioLike
  updatedAt: string | null
}

// 故意留缺数：spend / conversion 为 null，cpa 的 state 非 finite。
// 规则是缺数显 −，绝不显 0；分母 0 也显 −。真 0 只有后端明确说「有数据且为零」时才显示。
const rows: Row[] = [
  { id: "a-01", name: "示例账户一", kind: "自投", status: "投放中", spend: 128400.5, conversion: 1820, cpa: { value: 70.55, state: "finite" }, updatedAt: "2026-09-08" },
  { id: "a-02", name: "示例账户二", kind: "代投", status: "暂停", spend: 43120, conversion: 0, cpa: { value: null, state: "infinite" }, updatedAt: "2026-09-08" },
  { id: "a-03", name: "示例账户三，名字特别长用来验证截断和换行行为是否正常", kind: "自投", status: "异常", spend: null, conversion: null, cpa: { value: null, state: "undefined" }, updatedAt: null },
  { id: "a-04", name: "示例账户四", kind: "代投", status: "待开户", spend: null, conversion: null, cpa: { value: null, state: "undefined" }, updatedAt: "2026-09-07" },
]

const statusTone = {
  投放中: "success",
  暂停: "pending",
  异常: "critical",
  待开户: "muted",
} as const

const helper = createColumnHelper<GridFeatures, Row>()

const columns = helper.columns([
  selectionColumn<Row>(),
  helper.accessor("name", {
    header: "账户",
    enableHiding: false,
    meta: { label: "账户" },
    // 名字一行，不放 ID 副行。这是拍过板的。
    cell: ({ getValue }) => <span className="block truncate font-medium">{getValue()}</span>,
  }),
  helper.accessor("kind", {
    header: "类型",
    meta: { label: "类型" },
    cell: ({ getValue }) => <TypeChip>{getValue()}</TypeChip>,
  }),
  helper.accessor("status", {
    header: "状态",
    meta: { label: "状态" },
    // 状态同时给文字和图标，不只靠颜色。
    cell: ({ getValue }) => <StatusChip tone={statusTone[getValue()]}>{getValue()}</StatusChip>,
  }),
  helper.accessor("spend", {
    header: "消耗",
    meta: { label: "消耗" },
    cell: ({ getValue }) => {
      const value = getValue()
      return value === null ? <MissingValue /> : <span className="tabular-nums">{formatMoney(value)}</span>
    },
  }),
  helper.accessor("conversion", {
    header: "转化",
    meta: { label: "转化" },
    cell: ({ getValue }) => {
      const value = getValue()
      return value === null ? <MissingValue /> : <span className="tabular-nums">{formatInteger(value)}</span>
    },
  }),
  helper.accessor((row) => row.cpa.value, {
    id: "cpa",
    header: "CPA",
    meta: { label: "CPA" },
    // 前端永不算数：CPA 由后端给，这里只格式化。
    cell: ({ row }) => <span className="tabular-nums">{formatRatio(row.original.cpa)}</span>,
  }),
  helper.accessor("updatedAt", {
    header: "更新时间",
    meta: { label: "更新时间" },
    cell: ({ getValue }) => {
      const value = getValue()
      return value === null ? <MissingValue /> : <span className="tabular-nums">{formatDate(value)}</span>
    },
  }),
  actionsColumn<Row>(() => (
    <>
      <DropdownMenuItem>查看详情</DropdownMenuItem>
      <DropdownMenuItem>加入关注</DropdownMenuItem>
    </>
  )),
])

const tabs = [
  { value: "overview", label: "总览" },
  { value: "accounts", label: "账户", badge: rows.length },
  { value: "settings", label: "设置" },
] as const

// KPI 卡：标签 + ⓘ口径 / 数字 + 环比 / 一条走势线。不放说明文字，不放进度条。
// 这里没带图表库，所以走势线位置留空并写明；你接了图表库再补上，别拿假折线糊。
const kpis = [
  { label: "消耗", value: formatMoney(171520.5), delta: "+12.4%", tone: "success" as const },
  { label: "转化", value: formatInteger(1820), delta: "-3.1%", tone: "critical" as const },
  { label: "CPA", value: formatMoney(94.24), delta: null, tone: null },
  { label: "达标率", value: "−", delta: null, tone: null },
  { label: "成本空间", value: formatMoney(8200), delta: "+2.0%", tone: "success" as const },
  { label: "待处理", value: formatInteger(3), delta: null, tone: null },
]

export function DemoPage() {
  const [tab, setTab] = usePageTab(tabs, "overview")
  const state = usePageState()
  const [selected, setSelected] = useState(0)

  const table = useGridTable({
    data: rows,
    columns,
    pageSize: 20,
    getRowId: (row) => row.id,
    onRowSelectionChange: (ids) => setSelected(ids.length),
  })

  const kpiCards = useMemo(
    () =>
      kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
            <span className="text-2xl font-semibold tabular-nums">{kpi.value}</span>
            {kpi.delta ? (
              <Badge variant="outline" className={kpi.tone === "success" ? "text-status-success" : "text-status-critical"}>
                {kpi.delta}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">环比 −</span>
            )}
          </CardContent>
        </Card>
      )),
    [],
  )

  return (
    <div className="@container/main mx-auto flex min-h-svh w-full max-w-[1600px] flex-col">
      <PageHeader
        title="设计系统验收页"
        description="空间 示例 · 来源 假数据 · 数据日期 2026-09-08 · 更新时间 刚刚 · 口径 ⓘ"
        isMock
        actions={
          <>
            <StateSwitch />
            <ThemeSwitch />
            <Button size="sm" variant="outline">
              导出
            </Button>
          </>
        }
      />
      <PageBody>
        <div className="px-4 lg:px-6">
          <PageTabs tabs={tabs} value={tab} onChange={setTab} />
        </div>

        <StateFrame state={state} className="px-4 lg:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 @5xl/main:grid-cols-6">{kpiCards}</div>

          <DataGrid
            table={table}
            toolbar={<span className="text-sm text-muted-foreground">共 {rows.length} 个示例账户</span>}
            bulkActions={<Button size="sm" variant="outline">批量操作（已选 {selected}）</Button>}
          />

          <p className="text-xs text-muted-foreground">
            上表第三、四行故意缺数，显示为 − 而不是 0。第二行转化为 0 但消耗不为 0，CPA 显示 ∞ 标记。
            右上角可切三套主题和八种页面状态。
          </p>
        </StateFrame>
      </PageBody>
    </div>
  )
}
