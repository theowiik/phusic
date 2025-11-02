import type { Config } from '../../types'

interface SFXTabProps {
  config: Config
  updateArrayItem: (path: string, index: number, value: unknown) => void
  addArrayItem: (path: string, defaultValue: unknown) => void
  removeArrayItem: (path: string, index: number) => void
}

export const SFXTab = ({ config, updateArrayItem, addArrayItem, removeArrayItem }: SFXTabProps) => {
  return (
    <div className="space-y-4">
      {config.sfx?.map((sfx, idx) => (
        <div key={`sfx-${idx}-${sfx.file}`} className="flex items-center gap-2">
          <label htmlFor={`sfx-${idx}`} className="w-20 font-medium text-gray-700">
            SFX {idx + 1}
          </label>
          <input
            id={`sfx-${idx}`}
            type="text"
            value={sfx.file || ''}
            onChange={(e) => updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })}
            placeholder="sfx.mp3"
            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeArrayItem('sfx', idx)}
            className="rounded bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('sfx', { file: '' })}
        className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
      >
        + Add Sound Effect
      </button>
    </div>
  )
}
