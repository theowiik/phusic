import type { Config } from '../../types'

interface GeneralTabProps {
  config: Config
  updateConfig: (path: string, value: unknown) => void
}

export const GeneralTab = ({ config, updateConfig }: GeneralTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="assets-folder" className="mb-2 block font-medium text-gray-700">
          Assets Folder
        </label>
        <input
          id="assets-folder"
          type="text"
          value={config.assets || ''}
          onChange={(e) => updateConfig('assets', e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="mock-image-url" className="mb-2 block font-medium text-gray-700">
          Mock Image URL (optional)
        </label>
        <input
          id="mock-image-url"
          type="text"
          value={config.mockImage || ''}
          onChange={(e) => updateConfig('mockImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-gray-500 text-sm">
          Used as fallback when actual images are not found
        </p>
      </div>
    </div>
  )
}
