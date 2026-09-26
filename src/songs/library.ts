import { KEY_BY_LETTER } from '../keyboard/keyMapping'
import type { Song, SongNote } from './types'
import generated from './generated.json'

type Entry = [keys: string, beat: number, duration?: number]

function notes(entries: Entry[]): SongNote[] {
  return entries.flatMap(([keys, beat, duration = 1], index) =>
    keys.split(' ').map((key) => ({
      key,
      pitch: KEY_BY_LETTER.get(key)!.pitch,
      beat,
      duration,
      chordGroup: keys.includes(' ') ? `chord-${index}` : undefined,
    })))
}

const completeSongs: Song[] = generated.map(item => ({
  ...item,
  timeSignature: [item.timeSignature[0], item.timeSignature[1]],
}))

export const SONGS: Song[] = [
  ...completeSongs,
  {
    id: 'ode', title: '欢乐颂 · 入门', subtitle: '短旋律练习', composer: '贝多芬 · 简化编曲', bpm: 88, timeSignature: [4, 4],
    notes: notes([
      ['D',0],['D',1],['F',2],['G',3],['G',4],['F',5],['D',6],['S',7],
      ['A',8],['A',9],['S',10],['D',11],['D',12,1.5],['S',13.5,.5],['S',14,2],
      ['D',16],['D',17],['F',18],['G',19],['G',20],['F',21],['D',22],['S',23],
      ['A',24],['A',25],['S',26],['D',27],['S',28,1.5],['A',29.5,.5],['A',30,2],
      ['S',32],['S',33],['D',34],['A',35],['S',36],['D',37],['F',38],['D',39],
      ['A',40],['S',41],['D',42],['F',43],['D',44,1.5],['S',45.5,.5],['A',46,2],
    ]),
  },
  {
    id: 'twinkle', title: '小星星 · 入门', subtitle: '完整童谣旋律', composer: '传统旋律 · 简化编曲', bpm: 82, timeSignature: [4, 4],
    notes: notes([
      ['A',0],['A',1],['G',2],['G',3],['J',4],['J',5],['G',6,2],
      ['F',8],['F',9],['D',10],['D',11],['S',12],['S',13],['A',14,2],
      ['G',16],['G',17],['F',18],['F',19],['D',20],['D',21],['S',22,2],
      ['G',24],['G',25],['F',26],['F',27],['D',28],['D',29],['S',30,2],
      ['A',32],['A',33],['G',34],['G',35],['J',36],['J',37],['G',38,2],
      ['F',40],['F',41],['D',42],['D',43],['S',44],['S',45],['A',46,2],
    ]),
  },
  {
    id: 'dusk', title: '暮色练习曲 · 入门', subtitle: '短篇原创练习曲', composer: '原创练习旋律', bpm: 76, timeSignature: [4, 4],
    notes: notes([
      ['A D G',0,2],['J',2,1],['K',3,1],['L',4,2],['K',6,1],['J',7,1],
      ['S F J',8,2],['G',10,1],['J',11,1],['K',12,2],['G',14,2],
      ['A D G',16,2],['D',18,1],['F',19,1],['G',20,2],['F',22,1],['D',23,1],
      ['S F J',24,2],['F',26,1],['G',27,1],['J',28,2],['G',30,2],
      ['A D G',32,2],['J',34,1],['K',35,1],['L',36,2],[';',38,1],['L',39,1],
      ['S G J',40,2],['K',42,1],['J',43,1],['A D G',44,4],
    ]),
  },
]

export const songEndBeat = (song: Song) => Math.max(...song.notes.map((note) => note.beat + note.duration))
