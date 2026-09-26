export interface SongNote {
  key: string
  pitch: string
  beat: number
  duration: number
  velocity?: number
  chordGroup?: string
}

export interface Song {
  id: string
  title: string
  subtitle: string
  composer?: string
  bpm: number
  timeSignature: [number, number]
  notes: SongNote[]
}
