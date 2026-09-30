import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './food-images.css'
import { nutritionPhases, foods, phaseGuidance } from './nutritionData'

const IMG = 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@17.0.0/color/svg/'
const image = (code) => `${IMG}${code}.svg`
const availableFor = (phaseId) => foods.filter((food) => food.phases.includes(phaseId))

const hydrationByPhase = {
  breakfast: { title: 'Voda k snídani', text: 'Pij průběžně s jídlem. Pro děti je vhodné mít vodu stále po ruce; menší sklenice může mít zhruba 150–200 ml.', note: 'Potřeba se liší podle věku, velikosti, teploty a aktivity.' },
  early: { title: 'Pití před zápasem', text: 'Pij průběžně, ne velké množství najednou. Orientační sportovní doporučení používají asi 5–7 ml/kg tekutin 2–4 hodiny před výkonem.', note: 'Je to orientační hodnota, ne povinná dávka pro každé dítě.' },
  close: { title: 'Těsně před zápasem', text: 'Dej si jen menší doušky podle žízně a tolerance. Není potřeba do dítěte těsně před zápasem nalít velké množství vody.', note: 'Velký objem těsně před výkonem může být nepříjemný.' },
  between: { title: 'Pití během turnaje', text: 'Měj láhev stále po ruce a pij menší množství pravidelně. AAP uvádí při intenzivním sportu orientačně 90–120 ml každých 15 minut.', note: 'Není cílem vypít co nejvíc. Potřeba závisí na dítěti, pocení, délce zápasu a teplotě.' },
  recovery: { title: 'Doplň tekutiny po výkonu', text: 'Po výkonu pij postupně. Pokud znáš úbytek hmotnosti po výkonu, sportovní doporučení používají přibližně 1,25–1,5 l tekutin na každý 1 kg ztracené hmotnosti.', note: 'Bez znalosti ztráty tekutin je praktičtější pravidelně pít a sledovat žízeň a barvu moči.' },
}

function evaluate(phase, selectedFoods, betweenMinutes) {
  const guidance = phaseGuidance[phase.id]
  const hasCarb = selectedFoods.some((food) => food.tags.includes('carb'))
  const hasProtein = selectedFoods.some((food) => food.tags.includes('protein'))
  const easyFoods = selectedFoods.filter((food) => food.tags.includes('easy')).length
  const dynamicMax = phase.id === 'between'
    ? betweenMinutes < 30 ? 1 : betweenMinutes <= 60 ? 2 : betweenMinutes <= 120 ? 3 : 3
    : guidance.maxItems

  if (!selectedFoods.length) return { state: 'empty', title: 'Krabička čeká', text: 'Vyber vhodnou potravinu pro tuto část dne.' }

  if (selectedFoods.length > dynamicMax) {
    return { state: 'bad', title: '× Už je toho moc', text: phase.id === 'between' ? `Za ${betweenMinutes} minut hraješ znovu. Zvol raději lehčí variantu.` : guidance.tooMuchText }
  }

  if (phase.id === 'close') {
    if (!hasCarb) return { state: 'bad', title: '× Málo sacharidů', text: 'Těsně před výkonem je vhodná lehká sacharidová volba.' }
    return { state: 'ok', title: '✓ Vhodná svačina', text: 'Jedna lehká sacharidová volba může před zápasem stačit. Není potřeba přidávat další jídlo jen kvůli počtu položek.' }
  }

  if (phase.id === 'early') {
    if (!hasCarb) return { state: 'bad', title: '× Málo sacharidů', text: 'Přidej lehký zdroj sacharidů.' }
    return { state: 'ok', title: '✓ Vhodná svačina', text: easyFoods ? 'Máš lehce stravitelný zdroj energie. Další potraviny nejsou nutné jen proto, aby jich bylo více.' : 'Máš zdroj sacharidů. Pokud ti tato potravina před výkonem dobře sedí, může stačit.' }
  }

  if (phase.id === 'recovery') {
    if (!hasCarb && !hasProtein) return { state: 'bad', title: '× Chybí sacharidy i bílkovina', text: 'Po výkonu doplň energii a přidej zdroj bílkovin.' }
    if (!hasCarb) return { state: 'bad', title: '× Chybí sacharidy', text: 'Po turnaji potřebuješ také doplnit energii ze sacharidů.' }
    if (!hasProtein) return { state: 'bad', title: '× Chybí bílkovina', text: 'Přidej zdroj bílkovin. Velikost porce závisí na věku, hladu a dalším jídle.' }
    return { state: 'ok', title: '✓ Dobře složené', text: 'Máš sacharidy i bílkovinu. Nezapomeň také průběžně doplňovat tekutiny.' }
  }

  if (phase.id === 'breakfast') {
    if (!hasCarb) return { state: 'bad', title: '× Málo sacharidů', text: 'Snídaně před sportovním dnem by měla mít výrazný zdroj sacharidů.' }
    return { state: 'ok', title: '✓ Dobře složená snídaně', text: hasProtein ? 'Máš hlavní zdroj sacharidů a také bílkovinu. Není potřeba přidávat další jídlo jen proto, aby byla krabička plnější.' : 'Máš sacharidy. Bílkovinu můžeš přidat podle chuti a tolerance.' }
  }

  if (!hasCarb) return { state: 'bad', title: '× Málo sacharidů', text: 'Při turnaji je potřeba průběžně doplňovat energii. Pokud je další zápas brzy, vyber lehkou variantu.' }
  return { state: 'ok', title: '✓ Vhodně poskládané', text: `Další zápas je za ${betweenMinutes} minut. Zvolená svačina odpovídá této pauze.` }
}

function App() {
  const [activePhase, setActivePhase] = useState('breakfast')
  const [selected, setSelected] = useState({})
  const [message, setMessage] = useState('')
  const [betweenMinutes, setBetweenMinutes] = useState(60)
  const phase = nutritionPhases.find((item) => item.id === activePhase)
  const selectedFoods = selected[activePhase] || []
  const evaluation = useMemo(() => evaluate(phase, selectedFoods, betweenMinutes), [phase, selectedFoods, betweenMinutes])
  const availableFoods = availableFor(activePhase)
  const selectedCount = Object.values(selected).reduce((total, list) => total + list.length, 0)
  const globalCounts = Object.values(selected).flat().reduce((acc, food) => ({ ...acc, [food.id]: (acc[food.id] || 0) + 1 }), {})

  const toggleFood = (food) => {
    setSelected((current) => {
      const list = current[activePhase] || []
      const exists = list.some((item) => item.id === food.id)
      if (!exists && (globalCounts[food.id] || 0) >= 2) {
        setMessage(`${food.name} už máš dvakrát. Pro pestrost zkus jinou vhodnou potravinu.`)
        return current
      }
      setMessage('')
      return { ...current, [activePhase]: exists ? list.filter((item) => item.id !== food.id) : [...list, food] }
    })
  }

  const renderFood = (food) => (
    <button key={food.id} className="food-piece" onClick={(e) => { e.stopPropagation(); toggleFood(food) }} title={`Odebrat ${food.name}`}>
      <img className="food-photo-image" src={image(food.image)} alt="" />
      <small>{food.name}</small>
    </button>
  )

  const selectedIds = new Set(selectedFoods.map((food) => food.id))
  const hydration = hydrationByPhase[activePhase]

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-mark">FUEL<span>BOX</span></div><div className="top-count">{selectedCount} položek</div></header>
      <section className="intro"><span className="eyebrow">SPORTOVNÍ DEN</span><h1>Poskládej<br /><em>krabičku.</em></h1><p>Vyber jídlo pro jednotlivé části dne. Aplikace sleduje kombinaci, pestrost a také to, aby toho nebylo zbytečně moc.</p></section>
      <nav className="phase-tabs" aria-label="Části sportovního dne">
        {nutritionPhases.map((item) => <button key={item.id} className={item.id === activePhase ? 'active' : ''} onClick={() => { setActivePhase(item.id); setMessage('') }}><span>{item.kicker}</span><strong>{item.title}</strong></button>)}
      </nav>
      <section className="box-section">
        <div className="section-heading"><div><span className="eyebrow">{phase.kicker}</span><h2>{phase.title}</h2><p>{phase.subtitle}</p></div><span className={`status-pill ${evaluation.state}`}>{evaluation.state === 'ok' ? '✓' : evaluation.state === 'bad' ? '×' : '—'}</span></div>
        <div className="lunchbox-real">
          <div className="lunchbox-lid"><span></span><span></span><span></span></div>
          <div className="lunchbox-body">
            {nutritionPhases.map((item) => {
              const items = selected[item.id] || []
              return <div key={item.id} className={`compartment ${item.id}-compartment`} onClick={() => setActivePhase(item.id)}>
                <div className="compartment-label">{item.kicker} · {item.title}</div>
                <div className="food-scene">{items.length ? items.map(renderFood) : <span className="empty-plus">+</span>}</div>
              </div>
            })}
          </div>
        </div>
      </section>
      <div className={`nutrition-result ${evaluation.state}`}><div className="result-icon">{evaluation.state === 'ok' ? '✓' : evaluation.state === 'bad' ? '×' : '—'}</div><div><strong>{evaluation.title}</strong><p>{evaluation.text}</p></div></div>
      <section className="picker-section">
        {activePhase === 'between' && <div className="rule-card" style={{ marginBottom: 18 }}><span>⏱</span><div><strong>Za jak dlouho hraješ znovu?</strong><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>{[20, 45, 60, 90, 120, 180].map((minutes) => <button key={minutes} onClick={() => setBetweenMinutes(minutes)} style={{ border: 0, borderRadius: 999, padding: '8px 13px', fontWeight: 700, background: minutes === betweenMinutes ? '#18395f' : '#eef2f6', color: minutes === betweenMinutes ? '#fff' : '#18395f' }}>{minutes >= 60 ? `${minutes / 60} h` : `${minutes} min`}</button>)}</div><p style={{ marginTop: 8 }}>Podle pauzy aplikace upraví doporučenou velikost svačiny.</p></div></div>}
        <div className="picker-title"><div><span className="eyebrow">VYBER POTRAVINY</span><h2>{phase.title}</h2><p>{phase.rule}</p></div><span className="selected-count">{selectedFoods.length} vybráno</span></div>
        <div className="food-grid">
          {availableFoods.map((food) => <button key={food.id} className={`food-option ${selectedIds.has(food.id) ? 'chosen' : ''}`} onClick={() => toggleFood(food)}>
            <div className="food-photo"><img className="food-option-image" src={image(food.image)} alt="" /></div>
            <strong>{food.name}</strong><small>{food.note}</small>{selectedIds.has(food.id) && <b>✓</b>}
          </button>)}
        </div>
        {message && <div className="rule-card"><span>↔</span><div><strong>Pro pestrost</strong><p>{message}</p></div></div>}
        <div className="rule-card hydration-card"><span>💧</span><div><strong>{hydration.title}</strong><p>{hydration.text}</p><small>{hydration.note}</small></div></div>
      </section>
      <section className="rule-card"><span>i</span><div><strong>Jak aplikace přemýšlí</strong><p>{phase.rule} Hodnocení je orientační a nepočítá individuální energetickou potřebu dítěte. Potraviny je vhodné vyzkoušet nejdříve při tréninku, ne poprvé v den turnaje.</p></div></section>
      <footer>FuelBox · jednoduché plánování sportovní výživy pro mladé sportovce</footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
