# Chai Tycoon ☕ — Roadside Tea Empire Simulator

> **VibeSprint 1.0 Submission — OWASP NIE**  
> An offline-native, zero-dependency, production-grade management simulation game built with strict TypeScript, React, and browser-native persistence.

---

## 🌟 Overview

**Chai Tycoon** immerses you into the vibrant, high-stakes world of an Indian roadside Chai stall (*Tapri*). Master the art of brewing legendary cutting chai, manage raw ingredient inventories, survive the morning rush hour, navigate dynamic spot-market pricing, and expand your street stall into a celebrated tea enterprise.

Built specifically for the **VibeSprint 1.0 challenge**, Chai Tycoon guarantees:
* **Zero External APIs & Zero .env Dependencies:** Operates 100% self-contained in the browser.
* **Zero Negative Inventory Invariant:** Mathematically protected deterministic simulation loop.
* **Mid-Event Twist ("Minute 40 Supply Shock"):** Interactive dairy crisis after Round 1 requiring tough strategic trade-offs.
* **Browser-Native Persistence:** Full state persistence and historical P&L analytics using **IndexedDB (Dexie.js)**.
* **Zero External Audio Assets:** Real-time procedural sound effects synthesized mathematically via the **HTML5 Web Audio API**.
* **Zero Backend / Zero Payment Gateway:** 100% native client architecture with zero exfiltration risk.

---

## 🎮 The Core Gameplay Loop

```
  ┌────────────────────────────────────────────────────────┐
  │ 1. MORNING PREP & PROCUREMENT                          │
  │    Check weather forecast, inspect stocks, buy milk,   │
  │    tea, ginger, cardamom, and configure cup prices.    │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 2. THE DAYTIME RUSH (BUSINESS HOURS)                   │
  │    Serve diverse customer archetypes before patience   │
  │    runs out. Invariant checks prevent negative stock.  │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 3. EVENING SUMMARY & STALL UPGRADES                    │
  │    Review P&L ledger (Gross, COGS, Rent, Net Margin).  │
  │    Invest profits into Brass Samovars, Assistants, etc.│
  └───────────────────────────┬────────────────────────────┘
                              │
               (After Round 1: Day 1 Complete)
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 4. THE SUPPLY SHOCK TWIST (DAIRY CRISIS)               │
  │    Milk costs double! Choose your response:            │
  │    - Raise Prices (+50%)                               │
  │    - Absorb Margin (Keep customer goodwill)            │
  │    - Pivot Menu (Promote milk-free Sulaimani Chai)     │
  └────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
my-project/
├── frontend/             # React 18 + Vite + Strict TypeScript client application
│   ├── src/
│   │   ├── components/   # Modular, accessible UI components (Prep, Rush, Upgrades, Twist)
│   │   ├── engine/       # Pure TypeScript game loop, inventory invariant, economy, audio synth
│   │   ├── stores/       # Zustand reactive state stores
│   │   ├── db/           # Dexie.js IndexedDB schema and persistence handlers
│   │   └── types/        # Strict TypeScript domain interfaces
├── backend/              # Client-only architecture manifest & offline static server harness
├── docs/                 # Complete VibeSprint documentation suite
│   ├── PRD.md            # Product Requirements Document
│   ├── ARCHITECTURE.md   # Architectural blueprint & security model
│   ├── TASKS.md          # Sprint task tracking & status
│   ├── DECISIONS.md      # Architecture Decision Records (ADRs)
│   ├── CONTEXT.md        # Cultural context, recipe matrices & economic formulas
│   ├── AGENTS.md         # Multi-agent roles & development guide
│   ├── JUDGE_RUNBOOK.md  # 2-minute evaluation runbook for competition judges
│   ├── FIVE_TEST_CHECKLIST.md # Step-by-step reproducible verification test suite
│   ├── USER_QUICKSTART.md# Gameplay manual and keyboard shortcuts
│   ├── DATA_PRIVACY.md   # 100% offline & zero telemetry compliance statement
│   └── HANDOFF.md        # Extension and maintenance guide
├── .gitignore
└── README.md             # This document
```

---

## 🚀 Quickstart & Installation

### Prerequisites
* Node.js (v18+ recommended)
* npm or pnpm

### Running the Application

1. **Navigate to the frontend directory:**
   ```bash
   cd my-project/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Launch:** Open your browser at `http://localhost:5173`.

### Offline Production Build (Optional)
```bash
# Build the static bundle
npm run build

# Run the zero-dependency local static server
cd ../backend
node serve.js 3000
```
Visit `http://localhost:3000` — fully functional with **zero internet connection**.

---

## 🏆 VibeSprint Documentation Cards

Access detailed evaluation artifacts inside the `docs/` folder:

1. **[Judge Runbook](file:///C:/Users/Premdeep/OneDrive/Desktop/B&W/my-project/docs/JUDGE_RUNBOOK.md)**: 2-minute fast walkthrough for evaluators.
2. **[Five-Test Checklist](file:///C:/Users/Premdeep/OneDrive/Desktop/B&W/my-project/docs/FIVE_TEST_CHECKLIST.md)**: Reproducible verification scripts for all core mechanics.
3. **[User Quickstart](file:///C:/Users/Premdeep/OneDrive/Desktop/B&W/my-project/docs/USER_QUICKSTART.md)**: Player guide, recipe breakdown, and keyboard shortcuts.
4. **[Data Privacy Statement](file:///C:/Users/Premdeep/OneDrive/Desktop/B&W/my-project/docs/DATA_PRIVACY.md)**: Zero external data exfiltration and OWASP compliance.
5. **[Architecture Blueprint](file:///C:/Users/Premdeep/OneDrive/Desktop/B&W/my-project/docs/ARCHITECTURE.md)**: Unidirectional state machine, IndexedDB schema, and Web Audio API synthesizer.
6. **[Engineering Handoff](file:///C:/Users/Premdeep/OneDrive/Desktop/B&W/my-project/docs/HANDOFF.md)**: Extensibility guide for recipes, upgrades, and events.

---

## ⌨️ Accessibility & Controls

* **`1` - `4`**: Quickly fulfill customer orders in queue slots 1 through 4.
* **`Space`**: Instant brew / boil tea.
* **`M`**: Mute / unmute procedural audio synthesizer.
* **Tab / Shift+Tab**: Full keyboard accessibility across all interactive controls.
