'use client'

interface AudioElementsProps {
  musicRef1: React.RefObject<HTMLAudioElement | null>
  musicRef2: React.RefObject<HTMLAudioElement | null>
  sfxRef: React.RefObject<HTMLAudioElement | null>
}

export const AudioElements = ({ musicRef1, musicRef2, sfxRef }: AudioElementsProps) => {
  return (
    <>
      <audio ref={musicRef1} crossOrigin="anonymous">
        <track kind="captions" />
      </audio>
      <audio ref={musicRef2} crossOrigin="anonymous">
        <track kind="captions" />
      </audio>
      <audio ref={sfxRef} crossOrigin="anonymous">
        <track kind="captions" />
      </audio>
    </>
  )
}
