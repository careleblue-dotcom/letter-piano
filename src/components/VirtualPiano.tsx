import { PIANO_KEYS } from '../keyboard/keyMapping'

interface Props { pressed: Set<string>; onDown: (key: string) => void; onUp: (key: string) => void }

export function VirtualPiano({ pressed, onDown, onUp }: Props) {
  return <div className="piano-wrap">
    <div className="piano-heading"><span>19 个琴键 <span className="separator">·</span> 上排扩展音域</span><span>Q–T 低音 <i /> A–; 主键 <i /> Y–P 高音</span></div>
    <div className="piano-scroll"><div className="piano-keys">
      {PIANO_KEYS.map((item, index) => <button key={item.key} className={`piano-key ${pressed.has(item.key) ? 'down' : ''} ${index === 5 || index === 14 ? 'group-start' : ''}`}
        type="button" aria-label={`${item.key} 琴键`} onPointerDown={event => { event.preventDefault(); onDown(item.key) }}
        onPointerUp={() => onUp(item.key)} onPointerLeave={() => onUp(item.key)} onPointerCancel={() => onUp(item.key)}>
        <span className="key-glow" /><span className="key-letter">{item.key}</span>
      </button>)}
    </div></div>
    <div className="keyboard-hint">看到字母就按对应键 <span>·</span> 多个字母同时按 <span>·</span> <kbd>Space</kbd> 延音</div>
  </div>
}
