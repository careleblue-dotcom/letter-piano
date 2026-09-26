import { PIANO_SAMPLES, pitchToMidi } from './sampleMapping'

interface Voice {
  source: AudioBufferSourceNode
  gain: GainNode
  key: string
  held: boolean
  deferred: boolean
  released: boolean
}

export class PianoSampler {
  readonly context = new AudioContext({ latencyHint: 'interactive' })
  private readonly master = this.context.createGain()
  private readonly compressor = this.context.createDynamicsCompressor()
  private readonly buffers = new Map<string, AudioBuffer>()
  private readonly voices = new Set<Voice>()
  private loadPromise?: Promise<void>
  private sustain = false

  constructor() {
    this.master.gain.value = 0.72
    this.compressor.threshold.value = -12
    this.compressor.ratio.value = 2.5
    this.compressor.attack.value = 0.003
    this.compressor.release.value = 0.18
    this.master.connect(this.compressor).connect(this.context.destination)
  }

  async prepare(): Promise<void> {
    await this.context.resume()
    this.loadPromise ??= Promise.all(PIANO_SAMPLES.map(async (sample) => {
      const response = await fetch(sample.url)
      if (!response.ok) throw new Error(`Could not load ${sample.url}`)
      this.buffers.set(sample.pitch, await this.context.decodeAudioData(await response.arrayBuffer()))
    })).then(() => undefined)
    await this.loadPromise
  }

  setVolume(value: number): void {
    this.master.gain.setTargetAtTime(value * 0.85, this.context.currentTime, 0.012)
  }

  attack(key: string, pitch: string, velocity = 0.8): void {
    const midi = pitchToMidi(pitch)
    const sample = PIANO_SAMPLES.reduce((best, item) =>
      Math.abs(item.midi - midi) < Math.abs(best.midi - midi) ? item : best)
    const buffer = this.buffers.get(sample.pitch)
    if (!buffer) return

    const now = this.context.currentTime
    const source = this.context.createBufferSource()
    const gain = this.context.createGain()
    source.buffer = buffer
    source.playbackRate.value = 2 ** ((midi - sample.midi) / 12)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(Math.max(0.05, Math.min(1, velocity)), now + 0.006)
    source.connect(gain).connect(this.master)
    const voice: Voice = { source, gain, key, held: true, deferred: false, released: false }
    this.voices.add(voice)
    source.onended = () => { this.voices.delete(voice); source.disconnect(); gain.disconnect() }
    source.start(now)
  }

  release(key: string): void {
    for (const voice of this.voices) {
      if (voice.key !== key || !voice.held) continue
      voice.held = false
      if (this.sustain) voice.deferred = true
      else this.releaseVoice(voice)
    }
  }

  setSustain(on: boolean): void {
    this.sustain = on
    if (!on) for (const voice of this.voices) {
      if (voice.deferred) this.releaseVoice(voice)
    }
  }

  private releaseVoice(voice: Voice): void {
    if (voice.released) return
    voice.released = true
    voice.deferred = false
    const now = this.context.currentTime
    voice.gain.gain.cancelScheduledValues(now)
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now)
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7)
    voice.source.stop(now + 0.75)
  }

  dispose(): void {
    for (const voice of this.voices) { try { voice.source.stop() } catch { /* already ended */ } }
    void this.context.close()
  }
}
