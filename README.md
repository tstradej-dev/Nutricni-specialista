# FuelBox

První MVP aplikace pro jednoduché plánování výživy mladého sportovce během turnaje.

## v0.1

- zadání základních parametrů turnaje
- vizuální turnajový plán
- interaktivní krabička rozdělená do 3 částí
- výběr potravin podle kategorií
- časová osa před, mezi a po zápasech
- mobile-first responsive design

## Spuštění

```bash
npm install
npm run dev
```

## Princip

FuelBox nemá v první verzi diktovat přesné gramáže ani kalorie. Uživatel dostává jednoduché doporučení podle času do dalšího zápasu a vybírá si z vhodných kategorií a konkrétních potravin.

Nutriční pravidla budou v dalších verzích oddělena od prezentační vrstvy a budou průběžně odborně revidována.

## Roadmap

- oddělit databázi potravin a pravidla od UI
- zpřesnit algoritmus podle času do dalšího výkonu
- rozšířit timeline o dynamické časy zápasů
- přidat hydrataci
- odborná revize pravidel
- další typy sportovních dnů až po stabilizaci turnajového MVP
