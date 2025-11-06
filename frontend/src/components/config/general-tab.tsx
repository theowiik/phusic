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
        <label htmlFor="assets-folder" className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70">
          Assets Folder
        </label>
        <input
          id="assets-folder"
          type="text"
          value={config.assets || ''}
          onChange={(e) => updateConfig('assets', e.target.value)}
          className="input-clear w-full"
        />
      </div>
      <div>
        <label htmlFor="mock-image-url" className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70">
          Mock Image URL (optional)
        </label>
        <input
          id="mock-image-url"
          type="text"
          value={config.mockImage || ''}
          onChange={(e) => updateConfig('mockImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="input-clear w-full"
        />
        <p className="mt-1 text-[#e5e5e5] text-xs opacity-50 font-light">
          Used as fallback when actual images are not found
        </p>
      </div>
    </div>
  )
}
