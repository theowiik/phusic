interface AudioElementsProps {
  musicRef1: React.RefObject<HTMLAudioElement>
  musicRef2: React.RefObject<HTMLAudioElement>
  sfxRef: React.RefObject<HTMLAudioElement>
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
