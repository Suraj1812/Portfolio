"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "./music-player.css";

const FADE_IN_SECONDS = 5;

/** True once the visitor has clicked/tapped/typed anything: browsers then allow sound. */
function hasUserActivation() {
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return activation?.hasBeenActive ?? false;
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPausedRef = useRef(false);
  /** True while the song runs muted because the browser blocked sound before any interaction. */
  const silentStartRef = useRef(false);
  const restartFadeRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [atTop, setAtTop] = useState(false);
  const [soundNudge, setSoundNudge] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const quietVolume = 0.02;
    const normalVolume = 0.45;
    let frame = 0;
    let fadeStarted = false;
    let disposed = false;
    let attempting = false;

    const stopFade = () => cancelAnimationFrame(frame);
    const prepareFade = () => {
      stopFade();
      fadeStarted = false;
      audio.volume = quietVolume;
    };
    const fadeIn = () => {
      // Buffering can fire "playing" again; only fade once per play/resume.
      if (fadeStarted) return;
      fadeStarted = true;
      const startTime = audio.currentTime;
      const tick = () => {
        if (disposed || audio.paused) return;
        const progress = Math.min(1, Math.max(0, (audio.currentTime - startTime) / FADE_IN_SECONDS));
        // Ears hear loudness logarithmically; an ease-in curve makes the rise sound even.
        const eased = progress * progress;
        audio.volume = Math.min(1, Math.max(0, quietVolume + (normalVolume - quietVolume) * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      tick();
    };
    const INTERACTION_EVENTS = ["pointerdown", "touchend", "keydown"] as const;
    const removeInteractionListeners = () => {
      INTERACTION_EVENTS.forEach(type => document.removeEventListener(type, startAfterInteraction, true));
    };
    const isUnexpected = (reason: unknown) =>
      reason instanceof DOMException && reason.name !== "NotAllowedError" && reason.name !== "AbortError";

    async function attemptAutoplay() {
      if (disposed || attempting || userPausedRef.current || !audio!.paused) return;
      attempting = true;
      try {
        // 1) Sound on, straight away (allowed on revisits / high media-engagement sites).
        audio!.muted = false;
        await audio!.play();
        silentStartRef.current = false;
        if (!disposed) {
          removeInteractionListeners();
          setSoundNudge(false);
        }
      } catch (reason) {
        if (disposed) return;
        if (isUnexpected(reason)) {
          setError(true);
          return;
        }
        // 2) Browsers only allow muted autoplay before the first gesture: start the
        //    record spinning silently and switch the sound on at the first tap/key.
        try {
          audio!.muted = true;
          await audio!.play();
          silentStartRef.current = true;
        } catch (mutedReason) {
          audio!.muted = false;
          if (!disposed && isUnexpected(mutedReason)) setError(true);
        }
      } finally {
        attempting = false;
      }
    }

    /** Must run inside a user gesture: browsers only accept unmuting there. */
    function unmuteFromStart() {
      setSoundNudge(false);
      silentStartRef.current = false;
      audio!.currentTime = 0;
      audio!.muted = false;
      prepareFade();
      fadeIn();
      removeInteractionListeners();
    }
    restartFadeRef.current = unmuteFromStart;

    // The song starts only once the visitor scrolls into the section after the hero.
    // If the browser blocks sound (no gesture yet), the record spins silently with a
    // "tap for sound" nudge and the first tap/key anywhere switches the sound on.
    let autoSoundDone = false;
    let armed = false;
    function tryAutoSound() {
      if (autoSoundDone || disposed || userPausedRef.current) return;
      if (!armed) {
        armed = true;
        INTERACTION_EVENTS.forEach(type => document.addEventListener(type, startAfterInteraction, { capture: true, passive: true }));
      }
      const needsSound = silentStartRef.current || audio!.paused;
      if (!needsSound) {
        autoSoundDone = true;
        return;
      }
      autoSoundDone = true;
      if (hasUserActivation()) {
        if (silentStartRef.current && !audio!.paused) unmuteFromStart();
        else void attemptAutoplay();
        return;
      }
      void forceSoundWithoutGesture();
    }

    /**
     * Tries to switch the sound on with no gesture at all. Browsers that trust the
     * site (returning visitors, autoplay allowed in site settings) accept it; the
     * rest pause the element instead, so we drop back to the silent spin + nudge.
     */
    async function forceSoundWithoutGesture() {
      if (disposed) return;
      const wasSilent = silentStartRef.current && !audio!.paused;
      const rejected = await new Promise<boolean>(resolve => {
        let settled = false;
        const finish = (value: boolean) => {
          if (settled) return;
          settled = true;
          audio!.removeEventListener("pause", onPause);
          window.clearTimeout(timer);
          resolve(value);
        };
        const onPause = () => finish(true);
        const timer = window.setTimeout(() => finish(audio!.paused || audio!.muted), 400);
        audio!.addEventListener("pause", onPause);
        try {
          if (wasSilent) {
            audio!.currentTime = 0;
            audio!.muted = false;
            prepareFade();
            fadeIn();
          } else {
            audio!.muted = false;
            audio!.play().catch(() => finish(true));
          }
        } catch {
          finish(true);
        }
      });
      if (disposed) return;
      if (!rejected) {
        silentStartRef.current = false;
        removeInteractionListeners();
        setSoundNudge(false);
        return;
      }
      // Blocked: keep the record spinning silently and ask for one tap.
      userPausedRef.current = false;
      try {
        audio!.muted = true;
        if (audio!.paused) await audio!.play();
        silentStartRef.current = true;
      } catch (reason) {
        audio!.muted = false;
        if (isUnexpected(reason)) setError(true);
      }
      if (!disposed) setSoundNudge(true);
    }
    // Start the song as soon as the visitor reaches the section after the hero.
    function onScrollForSound() {
      const hero = document.getElementById("top");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : window.innerHeight - window.scrollY;
      // The next section is reached once the hero's bottom edge passes the middle of the screen.
      if (heroBottom > window.innerHeight * 0.5) return;
      window.removeEventListener("scroll", onScrollForSound);
      tryAutoSound();
    }
    window.addEventListener("scroll", onScrollForSound, { passive: true });
    function startAfterInteraction(event: Event) {
      if (userPausedRef.current) {
        removeInteractionListeners();
        return;
      }
      if (event instanceof KeyboardEvent && (event.repeat || ["Shift", "Control", "Alt", "Meta", "Escape", "Tab"].includes(event.key))) return;
      // The player's own button handles its click without a second play request.
      if (event.target instanceof Element && event.target.closest(".music-player")) return;
      if (silentStartRef.current && !audio!.paused) {
        unmuteFromStart();
        return;
      }
      if (audio!.paused) {
        audio!.muted = false;
        audio!.play().then(() => {
          removeInteractionListeners();
          setSoundNudge(false);
        }).catch(reason => {
          if (!disposed && isUnexpected(reason)) setError(true);
        });
      }
    }
    function resumeWhenVisible() {
      if (armed && document.visibilityState === "visible") void attemptAutoplay();
    }

    prepareFade();
    audio.addEventListener("play", prepareFade);
    audio.addEventListener("playing", fadeIn);
    audio.addEventListener("pause", stopFade);
    audio.addEventListener("error", stopFade);
    document.addEventListener("visibilitychange", resumeWhenVisible);
    window.addEventListener("pageshow", resumeWhenVisible);
    // Landing deep-linked past the hero (e.g. /#experience) counts as reaching the next section.
    const initialCheck = window.requestAnimationFrame(onScrollForSound);

    return () => {
      disposed = true;
      restartFadeRef.current = () => {};
      window.cancelAnimationFrame(initialCheck);
      window.removeEventListener("scroll", onScrollForSound);
      stopFade();
      removeInteractionListeners();
      document.removeEventListener("visibilitychange", resumeWhenVisible);
      window.removeEventListener("pageshow", resumeWhenVisible);
      audio.removeEventListener("play", prepareFade);
      audio.removeEventListener("playing", fadeIn);
      audio.removeEventListener("pause", stopFade);
      audio.removeEventListener("error", stopFade);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const work = document.getElementById("work");
    if (!work) {
      setAtTop(false);
      return;
    }
    // Move as the scroll-guide robot leaves the hero for the projects.
    const updatePosition = () => {
      setAtTop(work.getBoundingClientRect().top <= window.innerHeight * 0.6);
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [pathname]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || loading) return;
    // First tap on the record while it spins silently: turn the sound on instead of pausing.
    if (silentStartRef.current && !audio.paused) {
      restartFadeRef.current();
      return;
    }
    if (!audio.paused) {
      setSoundNudge(false);
      userPausedRef.current = true;
      audio.pause();
      return;
    }
    userPausedRef.current = false;
    silentStartRef.current = false;
    setSoundNudge(false);
    audio.muted = false;
    setError(false);
    setLoading(true);
    try {
      await audio.play();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`music-player${playing ? " is-playing" : ""}${atTop ? " is-at-top" : ""}`}>
      <audio
        ref={audioRef}
        src="/audio/sunflower.mp3"
        preload="auto"
        loop
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setLoading(false);
          setError(true);
        }}
      />
      {soundNudge && (
        <button
          type="button"
          className="music-sound-nudge"
          onClick={() => {
            const audio = audioRef.current;
            if (audio && silentStartRef.current && !audio.paused) restartFadeRef.current();
            else void togglePlayback();
          }}
        >
          <span aria-hidden="true">🔊</span> Tap for sound
        </button>
      )}
      <span className="sr-only" id="music-player-status" role="status">
        {error ? "Unable to play. Tap to retry." : loading ? "Loading…" : ""}
      </span>
      <button
        type="button"
        className="music-player-button"
        aria-label={`${playing ? "Pause" : "Play"} Sunflower by Post Malone and Swae Lee`}
        aria-pressed={playing}
        aria-busy={loading}
        aria-describedby="music-player-status"
        onClick={togglePlayback}
      >
        <span className="music-record" aria-hidden="true">
          <span className="music-record-label" />
        </span>
        <svg className="music-tonearm" viewBox="0 0 36 100" fill="none" aria-hidden="true">
          <path d="M25 12v45c0 9-4 15-11 22l-5 5" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <path d="M25 12v45c0 9-4 15-11 22l-5 5" stroke="#ece9df" strokeWidth="5" strokeLinecap="round" />
          <path d="M23 16v40c0 10-5 16-10 21" stroke="#9a9a9a" strokeWidth="1.5" />
          <circle cx="25" cy="12" r="7" fill="#ece9df" stroke="#111" strokeWidth="2" />
          <circle cx="25" cy="12" r="2" fill="#777" />
          <path d="m7 77 7 6-8 10-6-5z" fill="#ece9df" stroke="#111" strokeWidth="2" />
        </svg>
        <span className="music-notes" aria-hidden="true"><span>♪</span><span>♫</span><span>♪</span></span>
        <span className="music-play-indicator" aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
      </button>
    </div>
  );
}
