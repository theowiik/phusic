'use client'

import type { Config } from '../../types'

interface GeneralTabProps {
  config: Config
  updateConfig: (path: string, value: unknown) => void
}

export const GeneralTab = ({ config, updateConfig }: GeneralTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="assets-folder"
          className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
        >
          Assets Folder
        </label>
        <input
          id="assets-folder"
          type="text"
          value={config.assets || ''}
          onChange={(e) => updateConfig('assets', e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
        />
      </div>
      <div>
        <label
          htmlFor="mock-image-url"
          className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
        >
          Mock Image URL (optional)
        </label>
        <input
          id="mock-image-url"
          type="text"
          value={config.mockImage || ''}
          onChange={(e) => updateConfig('mockImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
        />
        <p className="mt-1 font-light text-[#e5e5e5] text-xs opacity-50">
          Used as fallback when actual images are not found
        </p>
      </div>
    </div>
  )
}
