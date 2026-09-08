import { Suspense } from "react"

import { DemoPage } from "./demo-page"

// StateSwitch / usePageState / usePageTab 都读 useSearchParams，Next 要求包在 Suspense 里。
// 你自己的页面同理，漏了会在 build 时报错（dev 下不报，容易漏）。
export default function Page() {
  return (
    <Suspense fallback={null}>
      <DemoPage />
    </Suspense>
  )
}
