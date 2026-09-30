import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const foods = {
  morning: [
    { name: 'Ovesná kaše', icon: '🥣', carbs: 3, group: 'meal' },
    { name: 'Banán', icon: '🍌', carbs: 2, group: 'fruit' },
    { name: 'Rohlík s medem', icon: '🥖', carbs: 3, group: 'carb' },
    { name: 'Jogurt s ovocem', icon: '🥛', carbs: 2, group: 'meal' },
    { name: 'Toast s džemem', icon: '🍞', carbs: 3, group: 'carb' },
    { name: 'Ovocná kapsička', icon: '🧃', carbs: 2, group: 'fruit' },
  ],
  oneHour: [
    { name: 'Banán', icon: '🍌', carbs: 2, group: 'fruit' },
    { name: 'Rýžové chlebíčky', icon: '🍘', carbs: 2, group: 'carb' },
    { name: 'Preclíky', icon: '🥨', carbs: 2, group: 'carb' },
    { name: 'Rohlík s medem', icon: '🥖', carbs: 3, group: 'carb' },
    { name: 'Ovocná kapsička', icon: '🧃', carbs: 2, group: 'fruit' },
    { name: 'Piškoty', icon: '🍪', carbs: 2, group: 'carb' },
  ],
  close: [
    { name: 'Banán', icon: '🍌', carbs: 2, group: 'fruit' },
    { name: 'Ovocná kapsička', icon: '🧃', carbs: 2, group: 'fruit' },
    { name: 'Preclíky', icon: '🥨', carbs: 2, group: 'carb' },
    { name: 'Rýžový chlebíček', icon: '🍘', carbs: 2, group: 'carb' },
    { name: 'Piškoty', icon: '🍪', carbs: 2, group: 'carb' },
  ],
  between: [
    { name: 'Banán', icon: '🍌', carbs: 2, group: 'fruit' },
    { name: 'Preclíky', icon: '🥨', carbs: 2, group: 'carb' },
    { name: 'Rohlík', icon: '🥖', carbs: 3, group: 'carb' },
    { name: 'Ovocná kapsička', icon: '🧃', carbs: 2, group: 'fruit' },
    { name: 'Jogurt s ovocem', icon: '🥛', carbs: 2, group: 'meal' },
    { name: 'Sendvič', icon: '🥪', carbs: 3, group: 'meal' },
  ],
}

const slots = [
  { id: 'morning', short: 'Ráno', time: '06:00', title: 'RÁNO', subtitle: 'větší snídaně', icon: '☀️' },
  { id: 'oneHour', short: '1 hod', time: '07:00', title: '1 HODINU PŘED', subtitle: 'lehká svačina', icon: '👟' },
  { id: 'close', short: 'Těsně před', time: '07:30', title: 'TĚSNĚ PŘED', subtitle: 'rychlá energie', icon: '⚡' },
  { id: 'between', short: 'Mezi zápasy', time: '09:00', title: 'MEZI ZÁPASY', subtitle: 'doplnění energie', icon: '✓' },
]

function statusFor(slotId, selected) {
  const items = selected[slotId] || []
  if (!items.length) return { state: 'empty', title: 'Krabička čeká', text: 'Vyber potraviny vhodné pro tuto část dne.' }
  const carbs = items.reduce((sum, item) => sum + item.carbs, 0)
  const needsMore = slotId !== 'close' && carbs < 3
  if (needsMore) return { state: 'warning', title: 'Ještě něco chybí', text: 'Svačina má zatím málo sacharidů. Přidej ještě jednu vhodnou položku.' }
  return { state: 'ok', title: 'Dobře složená svačina', text: 'Výběr odpovídá této části turnajového dne.' }
}

function App() {
  const [step, setStep] = useState('setup')
  const [activeSlot, setActiveSlot] = useState('oneHour')
  const [selected, setSelected] = useState({ morning: [], oneHour: [], close: [], between: [] })
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('14:00')
  const [age, setAge] = useState('9')
  const [sport, setSport] = useState('Florbal')

  const active = slots.find((slot) => slot.id === activeSlot)
  const status = useMemo(() => statusFor(activeSlot, selected), [activeSlot, selected])

  const toggleFood = (food) => {
    setSelected((current) => {
      const currentItems = current[activeSlot] || []
      const exists = currentItems.some((item) => item.name === food.name)
      return {
        ...current,
        [activeSlot]: exists ? currentItems.filter((item) => item.name !== food.name) : [...currentItems, food],
      }
    })
  }

  const removeFood = (name) => {
    setSelected((current) => ({
      ...current,
      [activeSlot]: current[activeSlot].filter((item) => item.name !== name),
    }))
  }

  if (step === 'setup') {
    return (
      <main className="app-shell setup-shell">
        <div className="brand-mark">FUEL<span>BOX</span></div>
        <section className="hero">
          <div className="eyebrow">SPORTOVNÍ VÝŽIVA BEZ SLOŽITOSTÍ</div>
          <h1>Slož si<br /><em>krabičku.</em></h1>
          <p>Vyber, kdy hraješ. My ti ukážeme, co se hodí jíst před zápasem a mezi zápasy.</p>
        </section>
        <section className="setup-card">
          <label>Sport</label>
          <div className="input-row"><span>🏑</span><select value={sport} onChange={(e) => setSport(e.target.value)}><option>Florbal</option><option>Fotbal</option><option>Hokej</option><option>Basketbal</option></select></div>
          <div className="two-cols">
            <div><label>Věk sportovce</label><div className="input-row"><span>🎂</span><input value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" /><small>let</small></div></div>
            <div><label>První zápas</label><div className="input-row"><span>🕐</span><input type="time" value={start} onChange={(e) => setStart(e.target.value)} /></div></div>
          </div>
          <label>Konec turnaje</label>
          <div className="input-row"><span>🏁</span><input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          <div className="game-preview"><span>4 zápasy</span><span>30 min</span><span>8:00 · 9:30 · 11:00 · 12:30</span></div>
          <button className="primary" onClick={() => setStep('plan')}>Složit krabičku <span>→</span></button>
        </section>
        <p className="fine-print">Orientační průvodce pro sportovní den. Vybírej potraviny, které sportovec běžně dobře snáší.</p>
      </main>
    )
  }

  return (
    <main className="app-shell plan-shell">
      <header className="topbar"><button className="back" onClick={() => setStep('setup')}>←</button><div className="brand-mark">FUEL<span>BOX</span></div><button className="more">•••</button></header>
      <section className="plan-header"><div><div className="eyebrow">TURNAJ · {sport.toUpperCase()}</div><h1>Moje <em>krabička.</em></h1><p>{age} let · {start}–{end} · 4 zápasy</p></div></section>

      <nav className="time-tabs" aria-label="Části turnajového dne">
        {slots.map((slot) => <button key={slot.id} className={activeSlot === slot.id ? 'active' : ''} onClick={() => setActiveSlot(slot.id)}><span>{slot.icon}</span><strong>{slot.short}</strong><small>{slot.time}</small></button>)}
      </nav>

      <section className="box-section">
        <div className="lunchbox-real">
          <div className="lunchbox-lid"><span></span><span></span><span></span></div>
          <div className="lunchbox-body">
            <div className="compartment large" onClick={() => setActiveSlot('oneHour')}>
              <div className="compartment-label">1 HODINU PŘED</div>
              <div className="food-scene">{selected.oneHour.length ? selected.oneHour.map((food) => <button key={food.name} className="food-piece" onClick={(e) => { e.stopPropagation(); removeFood(food.name) }} title="Odebrat">{food.icon}<small>{food.name}</small></button>) : <div className="empty-hint"><span>+</span><strong>Vyber potraviny</strong><small>klikni na část krabičky</small></div>}</div>
            </div>
            <div className="compartment medium" onClick={() => setActiveSlot('morning')}>
              <div className="compartment-label">RÁNO</div>
              <div className="food-scene">{selected.morning.length ? selected.morning.map((food) => <button key={food.name} className="food-piece" onClick={(e) => { e.stopPropagation(); removeFood(food.name) }}>{food.icon}<small>{food.name}</small></button>) : <span className="empty-plus">+</span>}</div>
            </div>
            <div className="compartment small" onClick={() => setActiveSlot('close')}>
              <div className="compartment-label">TĚSNĚ PŘED</div>
              <div className="food-scene">{selected.close.length ? selected.close.map((food) => <button key={food.name} className="food-piece" onClick={(e) => { e.stopPropagation(); removeFood(food.name) }}>{food.icon}<small>{food.name}</small></button>) : <span className="empty-plus">+</span>}</div>
            </div>
            <div className="compartment small between-compartment" onClick={() => setActiveSlot('between')}>
              <div className="compartment-label">MEZI ZÁPASY</div>
              <div className="food-scene">{selected.between.length ? selected.between.map((food) => <button key={food.name} className="food-piece" onClick={(e) => { e.stopPropagation(); removeFood(food.name) }}>{food.icon}<small>{food.name}</small></button>) : <span className="empty-plus">+</span>}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="picker-section">
        <div className="picker-title"><div><span className="eyebrow">VYBER PRO TUTO ČÁST DNE</span><h2>{active.title}</h2><p>{active.subtitle} · {active.time}</p></div><span className="selected-count">{selected[activeSlot].length} vybráno</span></div>
        <div className="food-grid">{foods[activeSlot].map((food) => { const chosen = selected[activeSlot].some((item) => item.name === food.name); return <button key={food.name} className={`food-option ${chosen ? 'chosen' : ''}`} onClick={() => toggleFood(food)}><span className="food-photo">{food.icon}</span><strong>{food.name}</strong>{chosen && <b>✓</b>}</button> })}</div>
      </section>

      <section className={`nutrition-result ${status.state}`}>
        <div className="result-icon">{status.state === 'ok' ? '✓' : status.state === 'warning' ? '×' : 'i'}</div>
        <div><strong>{status.title}</strong><p>{status.text}</p></div>
      </section>

      <section className="next-game"><div><span className="eyebrow">DALŠÍ ZÁPAS</span><strong>09:30</strong></div><div className="next-game-rule">Po zápase doplň energii a tekutiny. Čím méně času do dalšího zápasu, tím lehčí svačina.</div></section>
      <footer>FuelBox v0.2 · orientační průvodce, ne individuální zdravotní doporučení</footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
