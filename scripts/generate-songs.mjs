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

specs.push(...[
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1,
    "leadCount": 1,
    "file": "petzold-minuet-g.mid",
    "id": "minuet-g",
    "title": "G大调小步舞曲",
    "subtitle": "轻进阶 · 三拍子与双音",
    "composer": "克里斯蒂安·佩措尔德",
    "bpm": 80,
    "timeSignature": [
      3,
      4
    ],
    "leadTrack": "one:",
    "bassTrack": "two:",
    "transpose": -7,
    "repeatSections": 48
  },
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1,
    "leadCount": 1,
    "file": "petzold-minuet-g-minor.mid",
    "id": "minuet-g-minor",
    "title": "G小调小步舞曲",
    "subtitle": "轻进阶 · 舒缓的小调旋律",
    "composer": "克里斯蒂安·佩措尔德",
    "bpm": 72,
    "timeSignature": [
      3,
      4
    ],
    "leadTrack": "one:",
    "bassTrack": "two:",
    "transpose": 2,
    "repeatSections": 48
  },
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1,
    "leadCount": 1,
    "file": "schumann-melody.mid",
    "id": "schumann-melody",
    "title": "旋律",
    "subtitle": "轻进阶 · 连贯旋律与低音",
    "composer": "舒曼 · Op.68 No.1",
    "bpm": 76,
    "timeSignature": [
      4,
      4
    ],
    "leadTrack": "upper",
    "bassTrack": "lower",
    "transpose": 0
  },
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1,
    "leadCount": 1,
    "file": "schumann-soldiers-march.mid",
    "id": "soldiers-march",
    "title": "士兵进行曲",
    "subtitle": "轻进阶 · 清晰节拍与双音",
    "composer": "舒曼 · Op.68 No.2",
    "bpm": 84,
    "timeSignature": [
      2,
      4
    ],
    "leadTrack": "upper",
    "bassTrack": "lower",
    "transpose": 5
  },
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1,
    "leadCount": 1,
    "file": "schumann-happy-farmer.mid",
    "id": "happy-farmer",
    "title": "快乐的农夫",
    "subtitle": "轻进阶 · 低音旋律与伴奏",
    "composer": "舒曼 · Op.68 No.10",
    "bpm": 80,
    "timeSignature": [
      4,
      4
    ],
    "leadTrack": "lower",
    "bassTrack": "upper",
    "transpose": 7
  },
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1,
    "leadCount": 1,
    "file": "schumann-first-loss.mid",
    "id": "first-loss",
    "title": "初次的悲伤",
    "subtitle": "轻进阶 · 慢速抒情",
    "composer": "舒曼 · Op.68 No.16",
    "bpm": 66,
    "timeSignature": [
      2,
      4
    ],
    "leadTrack": "upper",
    "bassTrack": "lower",
    "transpose": 5
  },
  {
    "useTicks": true,
    "leadStep": 0.5,
    "bassStep": 1.5,
    "leadCount": 1,
    "file": "schumann-wild-rider.mid",
    "id": "wild-rider",
    "title": "勇敢的骑士",
    "subtitle": "轻进阶 · 稍活泼的交替弹奏",
    "composer": "舒曼 · Op.68 No.8",
    "bpm": 80,
    "timeSignature": [
      6,
      8
    ],
    "leadTrack": "upper",
    "bassTrack": "lower",
    "transpose": 0,
    "swapRanges": [
      [
        48,
        72
      ]
    ]
  },
  {
    "useTicks": true,
    "leadStep": 0.25,
    "bassStep": 1.5,
    "leadCount": 1,
    "file": "chopin-prelude-7.mid",
    "id": "prelude-7",
    "title": "A大调前奏曲",
    "subtitle": "轻进阶 · 短篇完整乐曲",
    "composer": "肖邦 · Op.28 No.7",
    "bpm": 60,
    "timeSignature": [
      3,
      4
    ],
    "leadTrack": "rh:",
    "bassTrack": "lh:",
    "transpose": 3
  }
])

specs.push({
  file: 'internationale.mid', id: 'internationale', title: '国际歌',
  subtitle: '主歌＋副歌 · 轻进阶钢琴版', composer: '皮埃尔·狄盖特 · Jerry Engelbach 原钢琴改编',
  bpm: 84, timeSignature: [4, 4], useTicks: true,
  leadTrack: 'Instrument 1', bassTrack: 'Instrument 1',
  leadStep: .25, bassStep: 2, leadCount: 1, transpose: 2,
})

function fitKey(midi) {
  while (midi < 52) midi += 12
  while (midi > 83) midi -= 12
  return keys.reduce((best, item) =>
    Math.abs(item[1] - midi) < Math.abs(best[1] - midi) ? item : best)
}

function collect(track, spec, step, count, isBass, ppq) {
  const bins = new Map()
  for (const note of track.notes) {
    const beat = round(spec.useTicks ? note.ticks / ppq : note.time * spec.bpm / 60, step)
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
        duration: Math.max(step, Math.min(4, round(spec.useTicks ? note.durationTicks / ppq : note.duration * spec.bpm / 60, .25))),
      })
      if (picked.length === count) break
    }
    if (picked.length) {
      selected.push(...picked)
      if (isBass) lastBassBin = beat
    }
  }
  if (spec.useTicks) {
    // Each voice stays monophonic: the new arrangements need at most two held keys.
    for (let i = 0; i < selected.length - 1; i++) {
      selected[i].duration = Math.min(selected[i].duration, selected[i + 1].beat - selected[i].beat)
    }
  }
  return selected
}

function generate(spec) {
  const midi = new Midi(readFileSync(`source-midi/${spec.file}`))
  let lead = midi.tracks.find(track => track.name === spec.leadTrack)
  let bass = midi.tracks.find(track => track.name === spec.bassTrack)
  if (!lead || !bass) throw new Error(`Missing MIDI track in ${spec.file}`)
  if (spec.swapRanges) {
    const swaps = note => spec.swapRanges.some(([start, end]) => note.ticks / midi.header.ppq >= start && note.ticks / midi.header.ppq < end)
    const originalLead = lead.notes
    const originalBass = bass.notes
    lead = { notes: [...originalLead.filter(n => !swaps(n)), ...originalBass.filter(swaps)] }
    bass = { notes: [...originalBass.filter(n => !swaps(n)), ...originalLead.filter(swaps)] }
  }
  let notes = [
    ...collect(lead, spec, spec.leadStep, spec.leadCount, false, midi.header.ppq),
    ...collect(bass, spec, .25, 1, true, midi.header.ppq),
  ]
  if (spec.repeatSections) {
    // These two source MIDIs omit the written AABB repeats (16 bars per section).
    const span = spec.repeatSections
    notes = notes.flatMap(note => {
      const section = Math.floor(note.beat / span)
      return [0, 1].map(repeat => ({ ...note, beat: note.beat + (section + repeat) * span }))
    })
  }
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
