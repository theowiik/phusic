'use client'

import { getAssetPath } from '../../constants/config'

interface ImagePreviewProps {
  imageName: string
  assetsFolder: string
}

export const ImagePreview = ({ imageName, assetsFolder }: ImagePreviewProps) => {
  if (!imageName) return null

  const imagePath = getAssetPath(assetsFolder, imageName)

  return (
    <img
      src={imagePath}
      alt={imageName}
      className="h-32 w-32 rounded border border-gray-300 object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
