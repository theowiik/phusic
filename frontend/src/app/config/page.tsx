import { Suspense } from 'react'
import { ConfigContent } from './config-content'

export default function ConfigBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-600 text-xl">Loading config...</div>
        </div>
      }
    >
      <ConfigContent />
    </Suspense>
  )
}
