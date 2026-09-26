export interface PianoSample {
  pitch: string
  midi: number
  url: string
}

// Salamander Grand Piano, Alexander Holm, CC BY 3.0.
// Additional sample pitches can be added here without changing the audio engine.
export const PIANO_SAMPLES: PianoSample[] = [
  { pitch: 'D#3', midi: 51, url: `${import.meta.env.BASE_URL}samples/Ds3.mp3` },
  { pitch: 'F#3', midi: 54, url: `${import.meta.env.BASE_URL}samples/Fs3.mp3` },
  { pitch: 'A3', midi: 57, url: `${import.meta.env.BASE_URL}samples/A3.mp3` },
  { pitch: 'C4', midi: 60, url: `${import.meta.env.BASE_URL}samples/C4.mp3` },
  { pitch: 'D#4', midi: 63, url: `${import.meta.env.BASE_URL}samples/Ds4.mp3` },
  { pitch: 'F#4', midi: 66, url: `${import.meta.env.BASE_URL}samples/Fs4.mp3` },
  { pitch: 'A4', midi: 69, url: `${import.meta.env.BASE_URL}samples/A4.mp3` },
  { pitch: 'C5', midi: 72, url: `${import.meta.env.BASE_URL}samples/C5.mp3` },
  { pitch: 'D#5', midi: 75, url: `${import.meta.env.BASE_URL}samples/Ds5.mp3` },
  { pitch: 'F#5', midi: 78, url: `${import.meta.env.BASE_URL}samples/Fs5.mp3` },
  { pitch: 'A5', midi: 81, url: `${import.meta.env.BASE_URL}samples/A5.mp3` },
]

const SEMITONES: Record<string, number> = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }

export function pitchToMidi(pitch: string): number {
  const match = /^([A-G]#?)(\d)$/.exec(pitch)
  if (!match) throw new Error(`Unknown pitch: ${pitch}`)
  return (Number(match[2]) + 1) * 12 + SEMITONES[match[1]]
}
