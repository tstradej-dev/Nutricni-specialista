import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './food-images.css'

const IMG = 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@17.0.0/color/svg/'
const image = (code) => `${IMG}${code}.svg`

const phases = [
  { id: 'breakfast', kicker: 'RÁNO', title: 'Snídaně', subtitle: 'Základ pro sportovní den', rule: 'Větší jídlo s převahou sacharidů. Nemusí být obrovské — cílem je přijít na sport dobře najedený.' },
  { id: 'early', kicker: 'PŘED VÝKONEM', title: '1–2 h před zápasem', subtitle: 'Lehká sacharidová svačina', rule: 'Vyber něco známého, lehkého a dobře stravitelného. Jedna nebo malá kombinace vhodných potravin může stačit.' },
  { id: 'close', kicker: 'TĚSNĚ PŘED', title: '30–60 min před', subtitle: 'Malé doplnění energie', rule: 'Jedna lehká sacharidová volba může úplně stačit. Není potřeba jíst banán a ještě něco navíc.' },
  { id: 'between', kicker: 'TURNaj', title: 'Mezi zápasy', subtitle: 'Doplň podle času do dalšího zápasu', rule: 'Čím kratší pauza, tím lehčí volba. Při delší pauze je prostor pro větší svačinu nebo malé jídlo.' },
  { id: 'recovery', kicker: 'REGENERACE', title: 'Po posledním zápase', subtitle: 'Doplň energii a bílkoviny', rule: 'Po výkonu mysli na sacharidy, bílkovinu a tekutiny.' },
]

const foods = [
  { id: 'banana', name: 'Banán', image: '1F34C', tags: ['carb', 'easy', 'fruit'], phases: ['breakfast', 'early', 'close', 'between'], note: 'snadno stravitelný' },
  { id: 'apple', name: 'Jablko', image: '1F34E', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'podle tolerance' },
  { id: 'grapes', name: 'Hroznové víno', image: '1F347', tags: ['carb', 'easy', 'fruit'], phases: ['breakfast', 'early', 'close', 'between'], note: 'praktické do krabičky' },
  { id: 'orange', name: 'Pomeranč', image: '1F34A', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'lehká ovocná volba' },
  { id: 'strawberry', name: 'Jahody', image: '1F353', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'lehká porce' },
  { id: 'blueberries', name: 'Borůvky', image: '1FAD0', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'lehká porce' },
  { id: 'melon', name: 'Meloun', image: '1F349', tags: ['carb', 'easy', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'osvěžující volba' },
  { id: 'pear', name: 'Hruška', image: '1F350', tags: ['carb', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'podle tolerance' },
  { id: 'mango', name: 'Mango', image: '1F96D', tags: ['carb', 'easy', 'fruit'], phases: ['breakfast', 'early', 'between'], note: 'sladké ovoce' },
  { id: 'applesauce', name: 'Přesnídávka', image: '1F963', tags: ['carb', 'easy'], phases: ['early', 'close', 'between'], note: 'praktická na cestu' },
  { id: 'raisins', name: 'Sušené ovoce', image: '1FAD0', tags: ['carb', 'easy'], phases: ['early', 'close', 'between'], note: 'malá porce' },
  { id: 'pretzels', name: 'Preclíky', image: '1F968', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'lehké sacharidy' },
  { id: 'ricecakes', name: 'Rýžové chlebíčky', image: '1F358', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'lehké a křupavé' },
  { id: 'toast-honey', name: 'Toast + med', image: '1F35E', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'close', 'between'], note: 'rychlá energie' },
  { id: 'roll-jam', name: 'Pečivo + džem', image: '1F956', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'between'], note: 'jednoduchá klasika' },
  { id: 'cereal', name: 'Cereálie + mléko', image: '1F963', tags: ['carb', 'protein'], phases: ['breakfast', 'early'], note: 'spíš s odstupem' },
  { id: 'oatmeal', name: 'Ovesná kaše', image: '1F963', tags: ['carb', 'protein'], phases: ['breakfast'], note: 'větší snídaně' },
  { id: 'pancakes', name: 'Palačinky + ovoce', image: '1F95E', tags: ['carb'], phases: ['breakfast'], note: 'větší snídaně' },
  { id: 'bagel', name: 'Bagel', image: '1F96F', tags: ['carb', 'easy'], phases: ['breakfast', 'early', 'between'], note: 'dobrý zdroj energie' },
  { id: 'sandwich', name: 'Lehký sendvič', image: '1F96A', tags: ['carb', 'protein'], phases: ['breakfast', 'between', 'recovery'], note: 'při delší pauze' },
  { id: 'wrap', name: 'Lehká tortilla', image: '1F959', tags: ['carb', 'protein'], phases: ['breakfast', 'between', 'recovery'], note: 'větší svačina' },
  { id: 'yogurt-fruit', name: 'Jogurt + ovoce', image: '1F95B', tags: ['carb', 'protein'], phases: ['breakfast', 'between', 'recovery'], note: 'když je více času' },
  { id: 'rice', name: 'Rýže', image: '1F35A', tags: ['carb'], phases: ['breakfast', 'between', 'recovery'], note: 'větší jídlo' },
  { id: 'rice-chicken', name: 'Rýže + kuře', image: '1F35A', tags: ['carb', 'protein'], phases: ['between', 'recovery'], note: 'větší jídlo' },
  { id: 'pasta', name: 'Těstoviny + rajčatová omáčka', image: '1F35D', tags: ['carb'], phases: ['breakfast', 'between', 'recovery'], note: 'větší jídlo' },
  { id: 'chocolate-milk', name: 'Kakaové mléko', image: '1F95B', tags: ['carb', 'protein'], phases: ['between', 'recovery'], note: 'praktická regenerace' },
  { id: 'yogurt', name: 'Jogurt', image: '1F95B', tags: ['protein'], phases: ['breakfast', 'between', 'recovery'], note: 'zdroj bílkovin' },
  { id: 'milk', name: 'Mléko', image: '1F95B', tags: ['protein'], phases: ['breakfast', 'recovery'], note: 'doplněk k jídlu' },
]

const availableFor = (phaseId) => foods.filter((food) => food.phases.includes(phaseId))

function evaluate(phase, selectedFoods) {
  const hasCarb = selectedFoods.some((food) => food.tags.includes('carb'))
  const hasProtein = selectedFoods.some((food) => food.tags.includes('protein'))
  if (!selectedFoods.length) return { state: 'empty', title: 'Krabička čeká', text: 'Vyber jednu nebo více vhodných potravin.' }
  if (phase.id === 'close') {
    if (selectedFoods.length > 2) return { state: 'bad', title: '× Zbytečně mnoho najednou', text: 'Těsně před zápasem není potřeba skládat velkou svačinu. Jedna lehká sacharidová volba může stačit.' }
    return hasCarb ? { state: 'ok', title: '✓ Vhodná svačina', text: 'Ano. Banán nebo jiná jedna lehká sacharidová volba může před zápasem stačit.' } : { state: 'bad', title: '× Málo sacharidů', text: 'Těsně před výkonem chceme hlavně lehce dostupnou energii.' }
  }
  if (phase.id === 'early') return hasCarb ? { state: 'ok', title: '✓ Vhodná svačina', text: 'Lehká sacharidová svačina je pro tento čas vhodná. Nemusíš přidávat další potraviny jen proto, aby jich bylo více.' } : { state: 'bad', title: '× Málo sacharidů', text: 'Přidej lehký zdroj sacharidů.' }
  if (phase.id === 'recovery') return hasCarb && hasProtein ? { state: 'ok', title: '✓ Dobře složené', text: 'Máš sacharidy i bílkovinu. Nezapomeň také doplnit tekutiny.' } : { state: 'bad', title: hasCarb ? '× Chybí bílkovina' : '× Málo sacharidů', text: hasCarb ? 'Po výkonu přidej také zdroj bílkovin.' : 'Po výkonu doplň sacharidy a přidej bílkovinu.' }
  if (phase.id === 'breakfast') return hasCarb ? { state: 'ok', title: '✓ Dobrá snídaně', text: hasProtein ? 'Sacharidy i bílkovina jsou zastoupené.' : 'Sacharidy máš. Bílkovinu můžeš přidat podle chuti a tolerance.' } : { state: 'bad', title: '× Málo sacharidů', text: 'Snídaně před sportovním dnem by měla mít výrazný zdroj sacharidů.' }
  return hasCarb ? { state: 'ok', title: '✓ Vhodná svačina', text: 'Máš zdroj sacharidů. Velikost přizpůsob pauze a hladu.' } : { state: 'bad', title: '× Málo sacharidů', text: 'Při turnaji je potřeba průběžně doplňovat energii ze sacharidů.' }
}

function App() {
  const [activePhase, setActivePhase] = useState('breakfast')
  const [selected, setSelected] = useState({})
  const [message, setMessage] = useState('')
  const phase = phases.find((item) => item.id === activePhase)
  const selectedFoods = selected[activePhase] || []
  const evaluation = useMemo(() => evaluate(phase, selectedFoods), [phase, selectedFoods])
  const availableFoods = availableFor(activePhase)
  const selectedCount = Object.values(selected).reduce((total, list) => total + list.length, 0)
  const globalCounts = Object.values(selected).flat().reduce((acc, food) => ({ ...acc, [food.id]: (acc[food.id] || 0) + 1 }), {})
  const repeatedFood = Object.entries(globalCounts).find(([, count]) => count >= 3)
  const repeatedName = repeatedFood ? foods.find((food) => food.id === repeatedFood[0])?.name : null

  const toggleFood = (food) => {
    setSelected((current) => {
      const list = current[activePhase] || []
      const exists = list.some((item) => item.id === food.id)
      if (!exists && (globalCounts[food.id] || 0) >= 2) {
        setMessage(`${food.name} už máš v plánu dvakrát. Zkus pro pestrost jinou vhodnou potravinu.`)
        return current
      }
      setMessage('')
      return { ...current, [activePhase]: exists ? list.filter((item) => item.id !== food.id) : [...list, food] }
    })
  }

  const renderFood = (food) => <button key={food.id} className="food-piece" onClick={(e) => { e.stopPropagation(); toggleFood(food) }}><img className="food-photo-image" src={image(food.image)} alt={food.name} /><small>{food.name}</small></button>

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
            <div className="compartment breakfast-compartment" onClick={() => setActivePhase('breakfast')}><div className="compartment-label">RÁNO · SNÍDANĚ</div><div className="food-scene">{(selected.breakfast || []).map(renderFood)}{!selected.breakfast?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment early-compartment" onClick={() => setActivePhase('early')}><div className="compartment-label">1–2 H PŘED</div><div className="food-scene">{(selected.early || []).map(renderFood)}{!selected.early?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment close-compartment" onClick={() => setActivePhase('close')}><div className="compartment-label">30–60 MIN PŘED</div><div className="food-scene">{(selected.close || []).map(renderFood)}{!selected.close?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment between-compartment" onClick={() => setActivePhase('between')}><div className="compartment-label">MEZI ZÁPASY</div><div className="food-scene">{(selected.between || []).map(renderFood)}{!selected.between?.length && <span className="empty-plus">+</span>}</div></div>
            <div className="compartment recovery-compartment" onClick={() => setActivePhase('recovery')}><div className="compartment-label">PO POSLEDNÍM ZÁPASE</div><div className="food-scene">{(selected.recovery || []).map(renderFood)}{!selected.recovery?.length && <span className="empty-plus">+</span>}</div></div>
          </div>
        </div>
      </section>
      <section className="picker-section"><div className="picker-title"><div><span className="eyebrow">VYBER POTRAVINY</span><h2>{phase.title}</h2><p>{phase.subtitle}</p></div><span className="selected-count">{selectedFoods.length} vybráno</span></div><div className="food-grid">{availableFoods.map((food) => { const chosen = selectedFoods.some((item) => item.id === food.id); const usedTwice = (globalCounts[food.id] || 0) >= 2 && !chosen; return <button key={food.id} className={`food-option ${chosen ? 'chosen' : ''} ${usedTwice ? 'disabled-food' : ''}`} onClick={() => toggleFood(food)}><span className="food-photo"><img className="food-photo-image" src={image(food.image)} alt="" /></span><strong>{food.name}</strong><small>{food.note}</small>{chosen && <b>✓</b>}</button> })}</div></section>
      {message && <div className="variety-note"><span>↺</span><div><strong>Trochu větší pestrost</strong><p>{message}</p></div></div>}
      {repeatedName && <div className="variety-note"><span>↺</span><div><strong>Zkus pestřejší výběr</strong><p>{repeatedName} máš v plánu už několikrát. Pro sportovní den je praktičtější střídat vhodné zdroje jídla, pokud dítěti vyhovují.</p></div></div>}
      <section className={`nutrition-result ${evaluation.state}`}><div className="result-icon">{evaluation.state === 'ok' ? '✓' : evaluation.state === 'bad' ? '×' : 'i'}</div><div><strong>{evaluation.title}</strong><p>{evaluation.text}</p></div></section>
      <section className="rule-card"><span>💡</span><div><strong>{phase.rule}</strong><p>Nemusíš sníst všechno, co je v nabídce. Vyber to, co dítě zná, chutná mu a dobře snáší.</p></div></section>
      <footer>FuelBox v0.4 · orientační průvodce sportovní výživou<div className="attribution">Potravinové ilustrace: OpenMoji · CC BY-SA 4.0</div></footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
