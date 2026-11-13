# Agent Workflows & System Guidelines — Chai Tycoon

**Document:** AGENTS.md  
**Role:** Guidelines for AI agents working collaboratively on Chai Tycoon  

---

## 1. Agent Roles & Specializations

To ensure production-grade quality, development is modularized across four agent personas:

1. **Principal Full-Stack Architect (Lead):**
   - Owns system boundaries, state machine integrity, and folder structure.
   - Enforces zero-backend, zero external API, and zero `.env` constraints.
2. **Domain Engine Specialist:**
   - Implements pure TypeScript algorithms (`recipeEngine.ts`, `inventoryEngine.ts`, `economyEngine.ts`).
   - Mathematically enforces the **Zero Negative Inventory Invariant**.
3. **Frontend & Accessibility (A11y) Engineer:**
   - Develops modular, responsive React components in `frontend/src/components/`.
   - Ensures WCAG AA accessibility, keyboard hotkeys (`1-4`, `Space`), and responsive design.
4. **Procedural Audio & Visual Polish Specialist:**
   - Implements Web Audio API procedural synthesis nodes (`audioSynth.ts`).
   - Authors CSS animations for the boiling kettle, steam, and coin chimes.

---

## 2. Hard Constraints & Coding Rules

All agents must adhere to the following rules without exception:
1. **Strict TypeScript:** No `any`, no `@ts-ignore`, no untyped state mutations.
2. **Zero External API Calls:** Do not use `fetch()` or `axios` to any external domains. No third-party analytics, fonts, CDNs, or telemetry.
3. **Zero .env Dependencies:** The application must start cleanly with default fallback constants without requiring any `.env` file.
4. **Zero Negative Inventory:** Every serving action must be verified against current inventory before mutating state.
5. **Safe Persistence:** Use Dexie.js (IndexedDB) with clear schema migration and automatic state serialization.
