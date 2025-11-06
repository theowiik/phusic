'use client'

import Image from 'next/image'
import { getAssetPath } from '../../constants/config'

interface ImagePreviewProps {
  imageName: string
  assetsFolder: string
}

export const ImagePreview = ({ imageName, assetsFolder }: ImagePreviewProps) => {
  if (!imageName) return null

  const imagePath = getAssetPath(assetsFolder, imageName)

  return (
    <Image
      src={imagePath}
      alt={imageName}
      width={128}
      height={128}
      className="h-32 w-32 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,20,0.3)] object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
