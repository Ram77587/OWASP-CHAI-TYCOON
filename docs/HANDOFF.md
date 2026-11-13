# Engineering Handoff & Maintenance Guide — Chai Tycoon

**Document:** HANDOFF.md  
**Version:** 1.0.0  
**Target:** Engineering Maintenance & Extensibility Guide  

---

## 1. Project Scaffolding Overview

The project is structured into three principal directories:
* `frontend/`: The production React 18 + Vite + TypeScript application containing all UI components, state stores, and the deterministic game engine.
* `backend/`: Architecture manifest explaining the 100% native client-side design and optional offline static server harness.
* `docs/`: Comprehensive VibeSprint documentation, PRD, architecture, and verification checklists.

---

## 2. Key Code Extension Points

### 2.1 Adding New Chai Recipes or Snacks
All recipes are defined in `frontend/src/engine/gameRules.ts`. To introduce a new item (e.g., *Kashmiri Kahwa*):
1. Add the item key to `RecipeKey` enum in `types/index.ts`.
2. Define the ingredient bill-of-materials in `RECIPES`:
   ```typescript
   KASHMIRI_KAHWA: {
     id: 'KASHMIRI_KAHWA',
     name: 'Kashmiri Kahwa',
     ingredients: { milk: 0, teaLeaves: 4, sugar: 6, ginger: 0, cardamom: 2, cups: 1 },
     baseCost: 8.5,
     defaultPrice: 35.0,
     description: 'Aromatic green tea infused with saffron and cardamom'
   }
   ```
3. The inventory validation engine and UI will automatically incorporate the new recipe.

### 2.2 Adding New Customer Archetypes
Customer archetypes reside in `frontend/src/engine/customerEngine.ts`. To add a new persona (e.g., *Food Vlogger*):
1. Add the profile with price tolerance, patience interval, preferred drinks, and dialogue lines.
2. The spawner probability distribution will automatically weight customer generation based on stall reputation.

### 2.3 Adding New Equipment Upgrades
Upgrades are defined in `frontend/src/engine/gameRules.ts` under `UPGRADES`. Each upgrade specifies its cost, name, icon, and operational effect (e.g., multiplier to brewing speed or customer patience).

---

## 3. Build & Production Packaging

To compile a production build of the client:
```bash
cd my-project/frontend
npm run build
```
The output is generated in `frontend/dist/`. Because the application is 100% client-native, this folder can be served from any static web server (NGINX, Caddy, GitHub Pages, or local Python HTTP server) with zero backend setup.
