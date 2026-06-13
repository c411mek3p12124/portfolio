"use client";
import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { useContentStore } from "./content/ContentProvider";

const Ctx = createContext<{ playing: boolean; toggle: () => void; hasTrack: boolean }>({
  playing: false,
  toggle: () => {},
  hasTrack: false,
});
export function useAudio() { return useContext(Ctx); }

/* Background music. The <audio> lives here (above the page views) so it keeps
   playing across Landing ⇄ Portfolio navigation. Plays only on user click
   (the sound toggle) so browser autoplay rules are satisfied. */
export function AudioProvider({ children }: { children: ReactNode }) {
  const { get } = useContentStore();
  const track: string = (get("audio.track") ?? "").trim();
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { if (!track) setPlaying(false); }, [track]);

  const toggle = () => {
    const a = ref.current;
    if (!a || !track) return;
    if (a.paused) a.play().catch(() => setPlaying(false));
    else a.pause();
  };

  return (
    <Ctx.Provider value={{ playing, toggle, hasTrack: !!track }}>
      {children}
      {track && (
        <audio
          ref={ref}
          src={track}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
    </Ctx.Provider>
  );
}
