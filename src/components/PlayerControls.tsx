import type { Song } from '../songs/types'
import type { ClockState } from '../engine/PlaybackClock'

interface Props {
  songs: Song[]; song: Song; state: ClockState; speed: number; volume: number; assist: boolean; free: boolean
  onSong: (id: string) => void; onPlay: () => void; onRestart: () => void; onSpeed: (value: number) => void
  onVolume: (value: number) => void; onAssist: (value: boolean) => void; onFree: (value: boolean) => void
}

export function PlayerControls(props: Props) {
  const { songs, song, state, speed, volume, assist, free } = props
  return <div className="controls">
    <div className="controls-primary">
      <div className="control-field song-select"><label htmlFor="song">曲目</label><select id="song" value={song.id} onChange={e => props.onSong(e.target.value)} disabled={free}>
        {songs.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
      </select></div>
      <button className="play-button" type="button" onClick={props.onPlay} disabled={free}>{free ? '自由弹奏中' : state === 'playing' || state === 'countin' ? 'Ⅱ  暂停' : '▶  开始演奏'}</button>
      <button className="plain-button" type="button" onClick={props.onRestart} disabled={free}>↺ <span>从头开始</span></button>
      <div className="control-field speed-select"><label htmlFor="speed">速度</label><select id="speed" value={speed} onChange={e => props.onSpeed(Number(e.target.value))}>
        {[.5,.75,1,1.25].map(value => <option value={value} key={value}>{value}×</option>)}
      </select></div>
    </div>
    <div className="controls-secondary">
      <label className="toggle-row"><span>节奏辅助</span><input type="checkbox" checked={assist} onChange={e => props.onAssist(e.target.checked)} /><i /></label>
      <div className="volume-field"><span>音量</span><input aria-label="音量" type="range" min="0" max="1" step="0.01" value={volume} onChange={e => props.onVolume(Number(e.target.value))} /></div>
      <button className={`mode-button ${free ? 'selected' : ''}`} type="button" onClick={() => props.onFree(!free)}>{free ? '返回曲谱' : '自由弹奏'}</button>
    </div>
  </div>
}
