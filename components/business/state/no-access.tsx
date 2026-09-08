"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { IconShieldLock } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// 无权限（403）统一落点：说清「谁没权 / 为什么 / 怎么办」，不把人扔回登录页，也不用空态冒充。
//
// 原版从会话上下文读当前空间和角色。这里改成传参，你接上自己的登录态后把值传进来即可。
export function NoAccess({
  title = "你没有这个页面的权限",
  reason,
  scopeLabel,
  roleLabel,
  readOnly = false,
  howToFix = "要开权限：找管理员在成员与授权里加授权。",
  homeHref = "/",
  action,
}: {
  title?: string
  reason?: string
  /** 当前所在范围，比如空间或团队名。拿不到就不传，显示 − */
  scopeLabel?: string
  /** 当前身份角色，比如「优化师」。拿不到就不传，显示 − */
  roleLabel?: string
  readOnly?: boolean
  howToFix?: string
  homeHref?: string
  action?: ReactNode
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
        <IconShieldLock className="size-8 text-muted-foreground" />
        <p className="font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {reason ?? "这个对象不在你被授权的范围内，或者当前空间是只读的。"}
        </p>
        <p className="text-xs text-muted-foreground">
          当前范围 {scopeLabel ?? "−"} · {roleLabel ?? "−"}
          {readOnly ? " · 只读" : ""}
        </p>
        <div className="mt-2 flex gap-2">
          {action ?? (
            <Button asChild size="sm" variant="outline">
              <Link href={homeHref}>回首页</Link>
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{howToFix}</p>
      </CardContent>
    </Card>
  )
}
