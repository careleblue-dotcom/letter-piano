import { useEffect, useRef, useState } from 'react'
import type { Song } from '../songs/types'

interface Props {
  song: Song
  beat: number
  active: boolean
  pressed: Set<string>
}

const PX_PER_BEAT = 124

export function SongTimeline({ song, beat, active, pressed }: Props) {
  const viewport = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)

  useEffect(() => {
    if (!viewport.current) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [])

  const lineX = width * .26
  const groupMap = new Map<number, typeof song.notes>()
  for (const note of song.notes) {
    const group = groupMap.get(note.beat) ?? []
    group.push(note)
    groupMap.set(note.beat, group)
  }
  const groups = [...groupMap.entries()].filter(([at, notes]) => {
    const x = lineX + (at - beat) * PX_PER_BEAT
    return x > -Math.max(...notes.map(n => n.duration)) * PX_PER_BEAT - 90 && x < width + 120
  })
  const measure = song.timeSignature[0] * 4 / song.timeSignature[1]
  const firstBar = Math.floor(Math.max(0, beat - lineX / PX_PER_BEAT) / measure)
  const lastBar = Math.ceil((beat + (width - lineX) / PX_PER_BEAT) / measure)
  const next = song.notes.find(note => note.beat >= Math.max(0, beat - .12))

  return <div className="timeline" ref={viewport} aria-label="横向字母曲谱">
    <div className="timeline-topline">
      <span>LETTER SCORE <span className="separator">/</span> 字母曲谱</span>
      <span>{song.timeSignature.join('/')} 拍 · {song.bpm} BPM</span>
    </div>
    <div className="score-stage">
      <div className="score-rail" />
      {Array.from({ length: Math.max(0, lastBar - firstBar + 1) }, (_, i) => {
        const bar = firstBar + i
        const x = lineX + (bar * measure - beat) * PX_PER_BEAT
        return <div className="bar-marker" key={bar} style={{ left: x }}>
          <span>{String(bar + 1).padStart(2, '0')}</span>
        </div>
      })}
      {groups.map(([at, group]) => {
        const x = lineX + (at - beat) * PX_PER_BEAT
        const duration = Math.max(...group.map(n => n.duration))
        const isCurrent = active && beat >= at - .15 && beat < at + Math.min(duration, .75)
        const isPast = beat > at + duration
        const approaching = active && at > beat && at - beat < 1.3
        return <div className={`note-group ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${approaching ? 'approaching' : ''}`}
          key={at} style={{ left: x, width: Math.max(32, duration * PX_PER_BEAT - 10) }}>
          <div className="note-labels">{group.map(note => <span className={pressed.has(note.key) ? 'pressed' : ''} key={note.key}>{note.key}</span>)}</div>
          <div className="note-stem" />
          <div className="note-line" />
        </div>
      })}
      <div className="playhead" style={{ left: lineX }}><span className="playhead-cap" /><span className="playhead-word">现在</span></div>
    </div>
    <div className="timeline-footer">
      <span>{active ? '看到字母，按下对应按键' : '点击开始演奏，跟着字母谱弹奏'}</span>
      <span>接下来 <strong>{next ? groupMap.get(next.beat)?.map(n => n.key).join(' + ') : '—'}</strong></span>
    </div>
  </div>
}
