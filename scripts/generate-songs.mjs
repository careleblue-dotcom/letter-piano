import { readFileSync, writeFileSync } from 'node:fs'
import midiPackage from '@tonejs/midi'

const { Midi } = midiPackage

const keys = [
  ['Q', 52], ['W', 53], ['E', 55], ['R', 57], ['T', 59],
  ['A', 60], ['S', 62], ['D', 64], ['F', 65], ['G', 67],
  ['J', 69], ['K', 71], ['L', 72], [';', 74],
  ['Y', 76], ['U', 77], ['I', 79], ['O', 81], ['P', 83],
]
const pitchNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const round = (value, step) => Math.round(value / step) * step

const specs = [
  {
    file: 'never-see-me-again.mid', id: 'never', title: 'Never See Me Again',
    subtitle: '约 2 分半 · 简化钢琴改编', composer: 'Ye · 根据公开钢琴序列改编',
    bpm: 84, timeSignature: [4, 4], leadTrack: 'Grand Piano (Classic)', bassTrack: 'Electric Piano',
    leadStep: .25, bassStep: 1, leadCount: 1, transpose: -6, repeat: 3, coda: 21,
  },
  {
    file: 'fur-elise.mid', id: 'fur-elise', title: '致爱丽丝',
    subtitle: '完整乐曲 · 字母简化版', composer: '贝多芬',
    bpm: 72, timeSignature: [3, 8], leadTrack: 'up:', bassTrack: 'down:',
    leadStep: .25, bassStep: 1.5, leadCount: 1, transpose: 0,
  },
  {
    file: 'gymnopedie-1.mid', id: 'gymnopedie', title: '第一号裸体歌舞',
    subtitle: '完整乐曲 · 舒缓练习', composer: '埃里克·萨蒂',
    bpm: 60, timeSignature: [3, 4], leadTrack: 'treble:', bassTrack: 'bass:',
    leadStep: .25, bassStep: 1, leadCount: 2, transpose: 0,
  },
  {
    file: 'entertainer.mid', id: 'entertainer', title: '演艺人',
    subtitle: '完整乐曲 · 爵士切分节奏', composer: '斯科特·乔普林',
    bpm: 72, timeSignature: [2, 4], leadTrack: 'up:', bassTrack: 'down:',
    leadStep: .5, bassStep: 2, leadCount: 1, transpose: 0,
  },
]

function fitKey(midi) {
  while (midi < 52) midi += 12
  while (midi > 83) midi -= 12
  return keys.reduce((best, item) =>
    Math.abs(item[1] - midi) < Math.abs(best[1] - midi) ? item : best)
}

function collect(track, spec, step, count, isBass) {
  const bins = new Map()
  for (const note of track.notes) {
    const beat = round(note.time * spec.bpm / 60, step)
    const items = bins.get(beat) ?? []
    items.push(note)
    bins.set(beat, items)
  }
  const selected = []
  let lastBassBin = -Infinity
  for (const [beat, notes] of [...bins].sort((a, b) => a[0] - b[0])) {
    if (isBass && beat < lastBassBin + spec.bassStep - .001) continue
    const sorted = [...notes].sort((a, b) => isBass ? a.midi - b.midi : b.midi - a.midi)
    const picked = []
    for (const note of sorted) {
      const [key, mappedMidi] = fitKey(note.midi + spec.transpose)
      if (picked.some(item => item.key === key)) continue
      picked.push({
        key,
        pitch: `${pitchNames[mappedMidi % 12]}${Math.floor(mappedMidi / 12) - 1}`,
        beat,
        duration: Math.max(step, Math.min(4, round(note.duration * spec.bpm / 60, .25))),
      })
      if (picked.length === count) break
    }
    if (picked.length) {
      selected.push(...picked)
      if (isBass) lastBassBin = beat
    }
  }
  return selected
}

function generate(spec) {
  const midi = new Midi(readFileSync(`source-midi/${spec.file}`))
  const lead = midi.tracks.find(track => track.name === spec.leadTrack)
  const bass = midi.tracks.find(track => track.name === spec.bassTrack)
  if (!lead || !bass) throw new Error(`Missing MIDI track in ${spec.file}`)
  const notes = [
    ...collect(lead, spec, spec.leadStep, spec.leadCount, false),
    ...collect(bass, spec, .25, 1, true),
  ]
  const phraseBeats = Math.ceil(Math.max(...notes.map(note => note.beat + note.duration)) / 4) * 4
  const result = []
  const repeats = spec.repeat ?? 1
  for (let cycle = 0; cycle < repeats; cycle++) {
    for (const note of notes) result.push({ ...note, beat: round(note.beat + cycle * phraseBeats, .25) })
  }
  if (spec.coda) {
    for (const note of notes.filter(note => note.beat < spec.coda)) {
      result.push({ ...note, beat: round(note.beat + repeats * phraseBeats, .25) })
    }
  }
  const deduped = new Map()
  for (const note of result) deduped.set(`${note.beat}:${note.key}`, note)
  return {
    id: spec.id, title: spec.title, subtitle: spec.subtitle, composer: spec.composer,
    bpm: spec.bpm, timeSignature: spec.timeSignature,
    notes: [...deduped.values()].sort((a, b) => a.beat - b.beat || a.key.localeCompare(b.key)),
  }
}

const songs = specs.map(generate)
writeFileSync('src/songs/generated.json', JSON.stringify(songs))
for (const song of songs) {
  const end = Math.max(...song.notes.map(note => note.beat + note.duration))
  console.log(`${song.title}: ${song.notes.length} notes, ${(end * 60 / song.bpm).toFixed(0)} seconds`)
}
