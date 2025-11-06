import { Suspense } from 'react'
import { ConfigContent } from './config-content'

export default function ConfigBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="font-light text-[#e5e5e5] text-sm opacity-50">Loading config...</div>
        </div>
      }
    >
      <ConfigContent />
    </Suspense>
  )
}
