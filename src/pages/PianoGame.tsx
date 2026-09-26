import { useCallback, useEffect, useRef, useState } from 'react'
import { PianoSampler } from '../audio/PianoSampler'
import { PlayerControls } from '../components/PlayerControls'
import { SongTimeline } from '../components/SongTimeline'
import { VirtualPiano } from '../components/VirtualPiano'
import { PlaybackClock, type ClockState } from '../engine/PlaybackClock'
import { KEY_BY_LETTER, normalizeKey } from '../keyboard/keyMapping'
import { SONGS, songEndBeat } from '../songs/library'
import type { Song } from '../songs/types'

function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`
}

export function PianoGame() {
  const sampler = useRef<PianoSampler | null>(null)
  const clock = useRef<PlaybackClock | null>(null)
  const held = useRef(new Set<string>())
  const [pressed, setPressed] = useState(new Set<string>())
  const [song, setSong] = useState<Song>(SONGS[0])
  const [state, setState] = useState<ClockState>('idle')
  const [beat, setBeat] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(.75)
  const [assist, setAssist] = useState(false)
  const [free, setFree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timing, setTiming] = useState('')
  const assistRef = useRef(false)
  const freeRef = useRef(false)

  const ensureAudio = useCallback(async () => {
    if (!sampler.current) sampler.current = new PianoSampler()
    if (!clock.current) {
      clock.current = new PlaybackClock(sampler.current.context, song)
      clock.current.setSpeed(speed)
    }
    setLoading(true)
    try { await sampler.current.prepare(); sampler.current.setVolume(volume); setError(''); return true }
    catch (cause) { setError(cause instanceof Error ? cause.message : '音频载入失败'); return false }
    finally { setLoading(false) }
  }, [song, speed, volume])

  const press = useCallback((key: string) => {
    if (held.current.has(key) || !sampler.current) return
    const mapping = KEY_BY_LETTER.get(key)
    if (!mapping) return
    held.current.add(key)
    sampler.current.attack(key, mapping.pitch)
    setPressed(new Set(held.current))
    const engine = clock.current
    if (assistRef.current && !freeRef.current && engine?.state === 'playing') {
      const now = engine.beat
      const nearest = engine.song.notes.filter(note => note.key === key).reduce<typeof engine.song.notes[number] | null>((best, note) =>
        !best || Math.abs(note.beat - now) < Math.abs(best.beat - now) ? note : best, null)
      if (nearest && Math.abs(nearest.beat - now) < .55) {
        const delta = (now - nearest.beat) * 60_000 / (engine.song.bpm * engine.speed)
        setTiming(Math.abs(delta) < 80 ? '正好' : delta < 0 ? '稍早' : '稍晚')
      } else setTiming('')
    }
  }, [])

  const release = useCallback((key: string) => {
    if (!held.current.delete(key)) return
    sampler.current?.release(key)
    setPressed(new Set(held.current))
  }, [])

  const play = useCallback(async () => {
    if (freeRef.current) return
    if (clock.current?.state === 'playing' || clock.current?.state === 'countin') {
      clock.current.pause(); setState(clock.current.state); return
    }
    if (!(await ensureAudio())) return
    if (clock.current!.state === 'paused' && clock.current!.beat < songEndBeat(clock.current!.song)) clock.current!.resume()
    else clock.current!.start()
    setState(clock.current!.state)
  }, [ensureAudio])

  const restart = useCallback(async () => {
    if (!(await ensureAudio())) return
    clock.current!.start(); setBeat(clock.current!.beat); setState(clock.current!.state)
  }, [ensureAudio])

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const engine = clock.current
      if (engine) {
        engine.update()
        if (engine.state === 'playing' && engine.beat >= songEndBeat(engine.song) + 1) engine.pause()
        setBeat(engine.beat)
        setState(engine.state)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('select, input')) return
      if (event.code === 'Space') { event.preventDefault(); if (!event.repeat) sampler.current?.setSustain(true); return }
      if (event.key === 'Escape') { clock.current?.pause(); setState(clock.current?.state ?? 'idle'); return }
      if (event.key === 'Enter') {
        if (target.closest('button')) return
        event.preventDefault(); if (!event.repeat) void play(); return
      }
      const key = normalizeKey(event.key)
      if (KEY_BY_LETTER.has(key)) { event.preventDefault(); if (!event.repeat) press(key) }
    }
    const up = (event: KeyboardEvent) => {
      if (event.code === 'Space') { event.preventDefault(); sampler.current?.setSustain(false); return }
      const key = normalizeKey(event.key)
      if (KEY_BY_LETTER.has(key)) { event.preventDefault(); release(key) }
    }
    const blur = () => {
      for (const key of [...held.current]) release(key)
      sampler.current?.setSustain(false)
      clock.current?.pause()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur) }
  }, [play, press, release])

  useEffect(() => () => { sampler.current?.dispose() }, [])

  const selectSong = (id: string) => {
    const next = SONGS.find(item => item.id === id)!
    setSong(next); clock.current?.setSong(next); setBeat(0); setTiming('')
  }
  const setPlaybackSpeed = (value: number) => { setSpeed(value); clock.current?.setSpeed(value) }
  const setPlayerVolume = (value: number) => { setVolume(value); sampler.current?.setVolume(value) }
  const setFreeMode = async (value: boolean) => {
    if (value && !(await ensureAudio())) return
    clock.current?.pause(); freeRef.current = value; setFree(value); setTiming('')
  }
  const changeAssist = (value: boolean) => { assistRef.current = value; setAssist(value); setTiming('') }
  const beatUnit = 4 / song.timeSignature[1]
  const count = state === 'countin' ? Math.max(1, Math.ceil(-beat / beatUnit)) : null
  const currentSeconds = beat * 60 / song.bpm
  const totalSeconds = songEndBeat(song) * 60 / song.bpm

  return <main className="app-shell">
    <header className="app-header">
      <div className="brand"><div className="brand-mark">♫</div><div><strong>LETTER PIANO</strong><span>字母钢琴</span></div></div>
      <div className="header-right">看到字母就按对应键 <span className="header-divider" /> <kbd>Space</kbd> 延音</div>
    </header>

    <PlayerControls songs={SONGS} song={song} state={state} speed={speed} volume={volume} assist={assist} free={free}
      onSong={selectSong} onPlay={play} onRestart={restart} onSpeed={setPlaybackSpeed} onVolume={setPlayerVolume} onAssist={changeAssist} onFree={setFreeMode} />

    <section className="studio" aria-label="钢琴演奏区">
      <div className="studio-heading"><div><span className="section-kicker">NOW PLAYING / 正在演奏</span><h2>{free ? '自由弹奏' : song.title}</h2><p>{free ? '没有曲谱，随心探索每一个音' : `${song.subtitle} · ${song.composer ?? ''}`}</p></div>
        <div className="time-display">{free ? <span>自由弹奏</span> : <><strong>{formatTime(currentSeconds)}</strong><span>/ {formatTime(totalSeconds)}</span></>}</div></div>
      <div className="progress-track"><div style={{ width: `${Math.max(0, Math.min(100, beat / songEndBeat(song) * 100))}%` }} /></div>
      {free ? <div className="free-stage"><div className="free-symbol">♫</div><h3>随心弹奏</h3><p>十九个字母琴键已经就绪。</p><span>按住 Space，旋律会停留得更久。</span></div>
        : <SongTimeline song={song} beat={beat} active={state === 'playing'} pressed={pressed} />}
      {count !== null && !free && <div className="count-overlay" aria-live="polite"><span>准备好</span><strong>{count}</strong></div>}
      <div className="studio-bottom"><div className="beat-indicator">{Array.from({ length: song.timeSignature[0] }, (_, i) => <i key={i} className={state === 'playing' && Math.floor(beat / beatUnit) % song.timeSignature[0] === i ? 'active' : ''} />)}</div><div className="timing-text" aria-live="polite">{assist && timing ? timing : '你的节奏，你的音乐'}</div><span>ENTER 开始 / 暂停 <span className="separator">·</span> ESC 暂停</span></div>
    </section>

    <VirtualPiano pressed={pressed} onDown={press} onUp={release} />
    {loading && <div className="notice" role="status">正在预载钢琴采样…</div>}
    {error && <div className="notice error" role="alert">{error}</div>}
  </main>
}
