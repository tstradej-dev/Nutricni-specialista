import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const phases = [
  { id: 'breakfast', kicker: 'RÁNO', title: 'Snídaně', subtitle: 'Základ pro sportovní den', rule: 'Větší jídlo s převahou sacharidů. Bílkovinu přidej podle běžných zvyklostí a tolerance.' },
  { id: 'early', kicker: 'PŘED VÝKONEM', title: '1–2 h před zápasem', subtitle: 'Lehká sacharidová svačina', rule: 'Vyber něco známého, lehkého a dobře stravitelného. Nemusíš kombinovat několik potravin.' },
  { id: 'close', kicker: 'TĚSNĚ PŘED', title: '30–60 min před', subtitle: 'Malé doplnění energie', rule: 'Jedna lehká sacharidová volba může úplně stačit. Není potřeba jíst banán a ještě něco navíc.' },
  { id: 'between', kicker: 'TURNaj', title: 'Mezi zápasy', subtitle: 'Doplň podle času do dalšího zápasu', rule: 'Při delší pauze je prostor pro větší svačinu. Při krátké pauze vol lehčí sacharidovou variantu.' },
  { id: 'recovery', kicker: 'REGENERACE', title: 'Po posledním zápase', subtitle: 'Doplň energii a bílkoviny', rule: 'Po výkonu mysli na sacharidy, bílkovinu a tekutiny.' },
]

const foods = [
  { id: 'banana', name: 'Banán', icon: '🍌', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'jednoduchá energie' },
  { id: 'apple', name: 'Jablko', icon: '🍎', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'podle tolerance' },
  { id: 'grapes', name: 'Hroznové víno', icon: '🍇', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'praktické do krabičky' },
  { id: 'mandarin', name: 'Mandarinka', icon: '🍊', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'lehká ovocná volba' },
  { id: 'berries', name: 'Jahody / borůvky', icon: '🫐', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'lehká porce' },
  { id: 'melon', name: 'Meloun', icon: '🍉', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'osvěžující volba' },
  { id: 'applesauce', name: 'Přesnídávka', icon: '🥣', tags: ['carb', 'easy'], phases: ['early', 'close', 'between'], note: 'praktická na cestu' },
  { id: 'pretzels', name: 'Preclíky', icon: '🥨', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'lehké sacharidy' },
  { id: 'ricecakes', name: 'Rýžové chlebíčky', icon: '🍘', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'lehké a křupavé' },
  { id: 'toast-honey', name: 'Toast + med', icon: '🍞', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'rychlá energie' },
  { id: 'roll-jam', name: 'Rohlík + džem', icon: '🥖', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'between'], note: 'jednoduchá klasika' },
  { id: 'cereal', name: 'Cereálie + mléko', icon: '🥣', tags: ['carb', 'protein'], phases: ['breakfast', 'early'], note: 'vhodné spíš s odstupem' },
  { id: 'oatmeal', name: 'Ovesná kaše', icon: '🥣', tags: ['carb', 'protein'], phases: ['breakfast'], note: 'větší snídaně' },
  { id: 'pancakes', name: 'Palačinky + ovoce', icon: '🥞', tags: ['carb'], phases: ['breakfast'], note: 'větší snídaně' },
  { id: 'sandwich', name: 'Lehký sendvič', icon: '🥪', tags: ['carb', 'protein'], phases: ['breakfast', 'between', 'recovery'], note: 'při delší pauze' },
  { id: 'wrap', name: 'Lehká tortilla', icon: '🌯', tags: ['carb', 'protein'], phases: ['breakfast', 'between', 'recovery'], note: 'větší svačina' },
  { id: 'yogurt-fruit', name: 'Jogurt + ovoce', icon: '🥛', tags: ['carb', 'protein'], phases: ['breakfast', 'between', 'recovery'], note: 'když je více času' },
  { id: 'rice-chicken', name: 'Rýže + kuře', icon: '🍚', tags: ['carb', 'protein'], phases: ['between', 'recovery'], note: 'větší jídlo' },
  { id: 'chocolate-milk', name: 'Kakaové mléko', icon: '🥛', tags: ['carb', 'protein'], phases: ['between', 'recovery'], note: 'praktická regenerace' },
  { id: 'flavoured-yogurt', name: 'Ochucený jogurt', icon: '🍶', tags: ['carb', 'protein'], phases: ['between', 'recovery'], note: 'sacharidy + bílkovina' },
  { id: 'milk', name: 'Mléko', icon: '🥛', tags: ['protein'], phases: ['breakfast', 'recovery'], note: 'doplněk k jídlu' },
]

const availableFor = (phaseId) => foods.filter((food) => food.phases.includes(phaseId))

function evaluate(phase, selectedFoods) {
  const hasCarb = selectedFoods.some((food) => food.tags.includes('carb'))
  const hasProtein = selectedFoods.some((food) => food.tags.includes('protein'))
  if (!selectedFoods.length) return { state: 'empty', title: 'Krabička čeká', text: 'Vyber jednu nebo více vhodných potravin.' }
  if (phase.id === 'close') return hasCarb
    ? { state: 'ok', title: '✓ Vhodná svačina', text: 'Ano. Banán nebo jiná jedna lehká sacharidová volba může před zápasem stačit.' }
    : { state: 'bad', title: '× Málo sacharidů', text: 'Těsně před výkonem chceme hlavně lehce dostupnou energii.' }
  if (phase.id === 'early') return hasCarb
    ? { state: 'ok', title: '✓ Vhodná svačina', text: 'Lehká sacharidová svačina je pro tento čas vhodná.' }
    : { state: 'bad', title: '× Málo sacharidů', text: 'Přidej lehký zdroj sacharidů.' }
  if (phase.id === 'recovery') return hasCarb && hasProtein
    ? { state: 'ok', title: '✓ Dobře složené', text: 'Máš sacharidy i bílkovinu. Nezapomeň také doplnit tekutiny.' }
    : { state: 'bad', title: hasCarb ? '× Chybí bílkovina' : '× Málo sacharidů', text: hasCarb ? 'Po výkonu přidej také zdroj bílkovin.' : 'Po výkonu doplň sacharidy a přidej bílkovinu.' }
  if (phase.id === 'breakfast') return hasCarb
    ? { state: 'ok', title: '✓ Dobrá snídaně', text: hasProtein ? 'Sacharidy i bílkovina jsou zastoupené.' : 'Sacharidy máš. Bílkovinu můžeš přidat podle chuti a tolerance.' }
    : { state: 'bad', title: '× Málo sacharidů', text: 'Snídaně před sportovním dnem by měla mít výrazný zdroj sacharidů.' }
  return hasCarb
    ? { state: 'ok', title: '✓ Vhodná svačina', text: 'Máš zdroj sacharidů. Velikost přizpůsob pauze a hladu.' }
    : { state: 'bad', title: '× Málo sacharidů', text: 'Při turnaji je potřeba průběžně doplňovat energii ze sacharidů.' }
}

function App() {
  const [activePhase, setActivePhase] = useState('breakfast')
  const [selected, setSelected] = useState({})
  const phase = phases.find((item) => item.id === activePhase)
  const selectedFoods = selected[activePhase] || []
  const evaluation = useMemo(() => evaluate(phase, selectedFoods), [phase, selectedFoods])
  const availableFoods = availableFor(activePhase)
  const selectedCount = Object.values(selected).reduce((total, list) => total + list.length, 0)

  const toggleFood = (food) => {
    setSelected((current) => {
      const list = current[activePhase] || []
      const exists = list.some((item) => item.id === food.id)
      return { ...current, [activePhase]: exists ? list.filter((item) => item.id !== food.id) : [...list, food] }
    })
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-mark">FUEL<span>BOX</span></div><div className="top-count">{selectedCount} položek</div></header>

      <section className="intro"><span className="eyebrow">SPORTOVNÍ DEN</span><h1>Poskládej<br /><em>krabičku.</em></h1><p>Vyber jídlo pro jednotlivé části dne. Aplikace ti jednoduše ukáže, jestli je svačina pro daný okamžik vhodně složená.</p></section>

      <nav className="phase-tabs" aria-label="Části sportovního dne">
        {phases.map((item) => <button key={item.id} className={item.id === activePhase ? 'active' : ''} onClick={() => setActivePhase(item.id)}><span>{item.kicker}</span><strong>{item.title}</strong></button>)}
      </nav>

      <section className="box-section">
        <div className="section-heading"><div><span className="eyebrow">{phase.kicker}</span><h2>{phase.title}</h2><p>{phase.subtitle}</p></div><span className={`status-pill ${evaluation.state}`}>{evaluation.state === 'ok' ? '✓' : evaluation.state === 'bad' ? '×' : '—'}</span></div>

        <div className="lunchbox-real">
          <div className="lunchbox-lid"><span></span><span></span><span></span></div>
          <div className="lunchbox-body">
            <div className="compartment breakfast-compartment" onClick={() => setActivePhase('breakfast')}><div className="compartment-label">RÁNO · SNÍDANĚ</div><div className="food-scene">{(selected.breakfast || []).map((food) => <button key={food.id} className="food-piece" onClick={(e) => { e.stopPropagation(); toggleFood(food) }}>{food.icon}<small>{food.name}</small></button>)}{!selected.breakfast?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment early-compartment" onClick={() => setActivePhase('early')}><div className="compartment-label">1–2 H PŘED</div><div className="food-scene">{(selected.early || []).map((food) => <button key={food.id} className="food-piece" onClick={(e) => { e.stopPropagation(); toggleFood(food) }}>{food.icon}<small>{food.name}</small></button>)}{!selected.early?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment close-compartment" onClick={() => setActivePhase('close')}><div className="compartment-label">30–60 MIN PŘED</div><div className="food-scene">{(selected.close || []).map((food) => <button key={food.id} className="food-piece" onClick={(e) => { e.stopPropagation(); toggleFood(food) }}>{food.icon}<small>{food.name}</small></button>)}{!selected.close?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment between-compartment" onClick={() => setActivePhase('between')}><div className="compartment-label">MEZI ZÁPASY</div><div className="food-scene">{(selected.between || []).map((food) => <button key={food.id} className="food-piece" onClick={(e) => { e.stopPropagation(); toggleFood(food) }}>{food.icon}<small>{food.name}</small></button>)}{!selected.between?.length && <span className="empty-plus">+</span>}</div></div>
          </div>
        </div>
      </section>

      <section className="picker-section"><div className="picker-title"><div><span className="eyebrow">VYBER POTRAVINY</span><h2>{phase.title}</h2><p>{phase.subtitle}</p></div><span className="selected-count">{selectedFoods.length} vybráno</span></div><div className="food-grid">{availableFoods.map((food) => { const chosen = selectedFoods.some((item) => item.id === food.id); return <button key={food.id} className={`food-option ${chosen ? 'chosen' : ''}`} onClick={() => toggleFood(food)}><span className="food-photo">{food.icon}</span><strong>{food.name}</strong><small>{food.note}</small>{chosen && <b>✓</b>}</button> })}</div></section>

      <section className={`nutrition-result ${evaluation.state}`}><div className="result-icon">{evaluation.state === 'ok' ? '✓' : evaluation.state === 'bad' ? '×' : 'i'}</div><div><strong>{evaluation.title}</strong><p>{evaluation.text}</p></div></section>
      <section className="rule-card"><span>💡</span><div><strong>{phase.rule}</strong><p>Nemusíš sníst všechno, co je v nabídce. Vyber to, co dítě zná, chutná mu a dobře snáší.</p></div></section>
      <footer>FuelBox v0.3 · orientační průvodce sportovní výživou</footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
