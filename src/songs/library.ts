import type { Song } from './types'
import generated from './generated.json'

export const SONGS: Song[] = generated.map(item => ({
  ...item,
  timeSignature: [item.timeSignature[0], item.timeSignature[1]],
}))

export const songEndBeat = (song: Song) => Math.max(...song.notes.map(note => note.beat + note.duration))
