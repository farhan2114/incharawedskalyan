import { useState, useEffect } from 'react';
import { assets } from '../data/assets';
import { weddingConfig } from '../wedding.config';

let globalAudio: HTMLAudioElement | null = null;
const listeners = new Set<(playing: boolean) => void>();

function notify() {
  const isPlaying = !!globalAudio && !globalAudio.paused;
  listeners.forEach((l) => l(isPlaying));
}

export function getAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio(weddingConfig.music?.audioUrl || assets.music);
    globalAudio.loop = true;
    globalAudio.volume = 0.45;
    globalAudio.addEventListener('play', notify);
    globalAudio.addEventListener('pause', notify);
  }
  return globalAudio;
}

export function playAudio() {
  if (typeof window === 'undefined') return;
  const audio = getAudio();
  audio.play().catch(() => {});
}

export function toggleAudio() {
  const audio = getAudio();
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

export function useIsAudioPlaying(): boolean {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    listeners.add(setPlaying);
    setPlaying(!!globalAudio && !globalAudio.paused);
    return () => {
      listeners.delete(setPlaying);
    };
  }, []);

  return playing;
}
