import type { Song } from '../songs/types'

export type ClockState = 'idle' | 'countin' | 'playing' | 'paused'

export class PlaybackClock {
  private anchor = 0
  private savedBeat = 0
  state: ClockState = 'idle'
  speed = 1

  constructor(private readonly context: AudioContext, public song: Song) {}

  get beat(): number {
    if (this.state !== 'playing' && this.state !== 'countin') return this.savedBeat
    return (this.context.currentTime - this.anchor) * this.song.bpm * this.speed / 60
  }

  start(): void {
    const countInBeats = this.song.timeSignature[0] * 4 / this.song.timeSignature[1]
    this.savedBeat = -countInBeats
    this.anchor = this.context.currentTime + countInBeats * 60 / (this.song.bpm * this.speed)
    this.state = 'countin'
  }

  pause(): void {
    if (this.state === 'playing' || this.state === 'countin') {
      this.savedBeat = this.beat
      this.state = 'paused'
    }
  }

  resume(): void {
    if (this.state !== 'paused') return
    this.anchor = this.context.currentTime - this.savedBeat * 60 / (this.song.bpm * this.speed)
    this.state = this.savedBeat < 0 ? 'countin' : 'playing'
  }

  update(): void {
    if (this.state === 'countin' && this.beat >= 0) this.state = 'playing'
  }

  setSpeed(speed: number): void {
    const beat = this.beat
    this.speed = speed
    this.savedBeat = beat
    this.anchor = this.context.currentTime - beat * 60 / (this.song.bpm * speed)
  }

  setSong(song: Song): void {
    this.song = song
    this.savedBeat = 0
    this.state = 'idle'
  }
}
