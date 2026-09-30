import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const foods = {
  fruit: [
    { name: 'Banán', icon: '🍌', note: 'snadno stravitelný' },
    { name: 'Mandarinka', icon: '🍊', note: 'lehká a osvěžující' },
    { name: 'Hroznové víno', icon: '🍇', note: 'praktické do krabičky' },
    { name: 'Jablko', icon: '🍎', note: 'volba podle tolerance' },
    { name: 'Jahody', icon: '🍓', note: 'lehká porce' },
    { name: 'Meloun', icon: '🍉', note: 'hodně vody' },
  ],
  quick: [
    { name: 'Preclíky', icon: '🥨', note: 'rychlá energie' },
    { name: 'Piškoty', icon: '🍪', note: 'lehké na trávení' },
    { name: 'Rýžové chlebíčky', icon: '🍘', note: 'lehká svačina' },
    { name: 'Pečivo s medem', icon: '🍞', note: 'rychle dostupné sacharidy' },
    { name: 'Přesnídávka', icon: '🥣', note: 'praktická na cestu' },
  ],
  snack: [
    { name: 'Sendvič', icon: '🥪', note: 'větší svačina' },
    { name: 'Jogurt + ovoce', icon: '🥛', note: 'když je delší pauza' },
    { name: 'Tortilla', icon: '🌯', note: 's lehkou náplní' },
    { name: 'Pečivo + šunka', icon: '🥖', note: 'jednoduchá volba' },
  ],
}

const slots = [
  { id: 'fruit', title: 'Ovoce', subtitle: 'lehká energie', icon: '🍌' },
  { id: 'quick', title: 'Rychlá energie', subtitle: 'před / mezi zápasy', icon: '🥨' },
  { id: 'snack', title: 'Větší svačina', subtitle: 'při delší pauze', icon: '🥪' },
]

const games = [
  { time: '08:00', label: 'ZÁPAS', icon: '🏑' },
  { time: '09:30', label: 'ZÁPAS', icon: '🏑' },
  { time: '11:00', label: 'ZÁPAS', icon: '🏑' },
  { time: '12:30', label: 'ZÁPAS', icon: '🏑' },
]

function minutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function App() {
  const [step, setStep] = useState('setup')
  const [selected, setSelected] = useState({})
  const [openSlot, setOpenSlot] = useState(null)
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('14:00')
  const [age, setAge] = useState('9')
  const [sport, setSport] = useState('Florbal')

  const plan = useMemo(() => {
    return [
      { time: '06:00', type: 'meal', icon: '🍽️', title: 'Snídaně', text: 'Větší snídaně před odjezdem na turnaj.' },
      { time: '07:15', type: 'snack', icon: '⚡', title: 'Lehká svačina', text: 'Do prvního zápasu zbývá přibližně 45 minut.' },
      { time: '08:00', type: 'game', icon: '🏑', title: 'Zápas', text: '30 minut hry.' },
      { time: '08:35', type: 'recover', icon: '💧', title: 'Doplnit', text: 'Napít se a doplnit lehkou energii.' },
      { time: '09:30', type: 'game', icon: '🏑', title: 'Zápas', text: '30 minut hry.' },
      { time: '10:05', type: 'recover', icon: '⚡', title: 'Svačina', text: 'Vyber něco lehkého, co dobře snášíš.' },
      { time: '11:00', type: 'game', icon: '🏑', title: 'Zápas', text: '30 minut hry.' },
      { time: '11:30', type: 'meal', icon: '🥪', title: 'Větší svačina', text: 'Je tu delší prostor do dalšího zápasu.' },
      { time: '12:30', type: 'game', icon: '🏑', title: 'Zápas', text: '30 minut hry.' },
      { time: '13:05', type: 'recover', icon: '🔄', title: 'Regenerace', text: 'Napít se a dát si jídlo po posledním zápase.' },
    ]
  }, [])

  const addFood = (slot, food) => {
    setSelected((current) => ({ ...current, [slot]: food }))
    setOpenSlot(null)
  }

  if (step === 'setup') {
    return (
      <main className="app-shell setup-shell">
        <div className="brand-mark">FUEL<span>BOX</span></div>
        <section className="hero">
          <div className="eyebrow">SPORTOVNÍ VÝŽIVA BEZ SLOŽITOSTÍ</div>
          <h1>Naplánuj<br /><em>turnaj.</em></h1>
          <p>Řekni nám, kdy hraješ. FuelBox ti připraví jednoduchý plán jídla a pití.</p>
        </section>

        <section className="setup-card">
          <label>Sport</label>
          <div className="input-row"><span>🏑</span><select value={sport} onChange={(e) => setSport(e.target.value)}><option>Florbal</option><option>Fotbal</option><option>Hokej</option><option>Basketbal</option></select></div>

          <div className="two-cols">
            <div><label>Věk sportovce</label><div className="input-row"><span>🎂</span><input value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" /><small>let</small></div></div>
            <div><label>Začátek</label><div className="input-row"><span>🕐</span><input type="time" value={start} onChange={(e) => setStart(e.target.value)} /></div></div>
          </div>

          <label>Konec turnaje</label>
          <div className="input-row"><span>🏁</span><input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></div>

          <div className="game-preview"><span>4 zápasy</span><span>30 min</span><span>8:00 · 9:30 · 11:00 · 12:30</span></div>
          <button className="primary" onClick={() => setStep('plan')}>Vytvořit můj plán <span>→</span></button>
        </section>
        <p className="fine-print">Doporučení jsou orientační. Každý sportovec je jiný — vybírej jídlo, které dobře snášíš.</p>
      </main>
    )
  }

  return (
    <main className="app-shell plan-shell">
      <header className="topbar"><button className="back" onClick={() => setStep('setup')}>←</button><div className="brand-mark">FUEL<span>BOX</span></div><button className="more">•••</button></header>

      <section className="plan-header">
        <div className="eyebrow">TVŮJ TURNAJ</div>
        <h1>{sport} <em>day.</em></h1>
        <p>Sportovec {age} let · {start}–{end}</p>
      </section>

      <section className="box-section">
        <div className="section-heading"><div><span className="eyebrow">PŘIPRAV SI</span><h2>Moje krabička</h2></div><span className="box-count">{Object.keys(selected).length}/3</span></div>
        <div className="lunchbox">
          {slots.map((slot, index) => (
            <button key={slot.id} className={`box-compartment compartment-${index + 1} ${selected[slot.id] ? 'filled' : ''}`} onClick={() => setOpenSlot(openSlot === slot.id ? null : slot.id)}>
              {selected[slot.id] ? <><span className="food-big">{selected[slot.id].icon}</span><strong>{selected[slot.id].name}</strong><small>{slot.title}</small></> : <><span className="slot-icon">{slot.icon}</span><strong>{slot.title}</strong><small>{slot.subtitle}</small><span className="plus">+</span></>}
            </button>
          ))}
        </div>
        {openSlot && (
          <div className="picker">
            <div className="picker-head"><div><span className="eyebrow">VYBER SI</span><h3>{slots.find((s) => s.id === openSlot).title}</h3></div><button onClick={() => setOpenSlot(null)}>×</button></div>
            <div className="food-grid">{foods[openSlot].map((food) => <button key={food.name} className="food-option" onClick={() => addFood(openSlot, food)}><span>{food.icon}</span><strong>{food.name}</strong><small>{food.note}</small></button>)}</div>
          </div>
        )}
      </section>

      <section className="timeline-section">
        <div className="section-heading"><div><span className="eyebrow">DEN PO KROCÍCH</span><h2>Kdy co dělat</h2></div></div>
        <div className="timeline">
          {plan.map((item, index) => <article className={`timeline-item ${item.type}`} key={`${item.time}-${index}`}><div className="time">{item.time}</div><div className="timeline-dot">{item.icon}</div><div className="timeline-copy"><strong>{item.title}</strong><p>{item.text}</p></div></article>)}
        </div>
      </section>

      <section className="tip"><span>💡</span><div><strong>Jednoduché pravidlo</strong><p>Čím méně času zbývá do zápasu, tím lehčí by měla být svačina.</p></div></section>
      <footer>FuelBox v0.1 · orientační průvodce, ne individuální zdravotní doporučení</footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
