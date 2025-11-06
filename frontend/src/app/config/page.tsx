import { Suspense } from 'react'
import { ConfigContent } from './config-content'

export default function ConfigBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="font-medium text-gray-600 text-lg">Loading config...</div>
        </div>
      }
    >
      <ConfigContent />
    </Suspense>
  )
}
