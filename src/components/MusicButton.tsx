import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useIsAudioPlaying, toggleAudio } from '../lib/audio';

export const MusicButton: React.FC = () => {
  const isPlaying = useIsAudioPlaying();

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={isPlaying ? 'Turn music off' : 'Turn music on'}
      className="fixed bottom-5 right-5 z-50 flex size-12 items-center justify-center rounded-full border border-gold/60 bg-paper/90 text-gold-deep shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:bg-gold/15"
    >
      {isPlaying ? (
        <Volume2 className="size-5" aria-hidden="true" />
      ) : (
        <VolumeX className="size-5" aria-hidden="true" />
      )}
    </button>
  );
};
