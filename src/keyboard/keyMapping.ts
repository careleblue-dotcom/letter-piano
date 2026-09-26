export interface PianoKey {
  key: string
  pitch: string
  hand: 'left' | 'right'
}

// Three familiar keyboard clusters cover nineteen consecutive white-note pitches.
export const PIANO_KEYS: PianoKey[] = [
  { key: 'Q', pitch: 'E3', hand: 'left' },
  { key: 'W', pitch: 'F3', hand: 'left' },
  { key: 'E', pitch: 'G3', hand: 'left' },
  { key: 'R', pitch: 'A3', hand: 'left' },
  { key: 'T', pitch: 'B3', hand: 'left' },
  { key: 'A', pitch: 'C4', hand: 'left' },
  { key: 'S', pitch: 'D4', hand: 'left' },
  { key: 'D', pitch: 'E4', hand: 'left' },
  { key: 'F', pitch: 'F4', hand: 'left' },
  { key: 'G', pitch: 'G4', hand: 'left' },
  { key: 'J', pitch: 'A4', hand: 'right' },
  { key: 'K', pitch: 'B4', hand: 'right' },
  { key: 'L', pitch: 'C5', hand: 'right' },
  { key: ';', pitch: 'D5', hand: 'right' },
  { key: 'Y', pitch: 'E5', hand: 'right' },
  { key: 'U', pitch: 'F5', hand: 'right' },
  { key: 'I', pitch: 'G5', hand: 'right' },
  { key: 'O', pitch: 'A5', hand: 'right' },
  { key: 'P', pitch: 'B5', hand: 'right' },
]

export const KEY_BY_LETTER = new Map(PIANO_KEYS.map((item) => [item.key, item]))
export const normalizeKey = (key: string) => key.length === 1 ? key.toUpperCase() : key
