import { Suspense } from 'react'
import { ConfigContent } from './config-content'

export default function ConfigBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="text-[#e5e5e5] opacity-50 font-light text-sm">
            Loading config...
          </div>
        </div>
      }
    >
      <ConfigContent />
    </Suspense>
  )
}
