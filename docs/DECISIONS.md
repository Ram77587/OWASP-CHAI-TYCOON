# Architecture Decision Records (ADRs) — Chai Tycoon

---

## ADR-001: 100% Client-Native Single Page Application Architecture
* **Status:** Accepted  
* **Date:** 2026-11-13  
* **Context:** The VibeSprint 1.0 specification strictly mandates zero external APIs, zero `.env` dependencies, and no remote backend or payment gateway.  
* **Decision:** Build Chai Tycoon entirely as an offline-capable client-side Single Page Application utilizing React, Vite, and strict TypeScript. The `backend/` directory is maintained to fulfill repository directory structure requirements, containing architectural manifests and offline verification documentation.  
* **Consequences:** The application requires zero infrastructure hosting costs, has an attack surface of zero, runs instantly in any modern browser without network access, and guarantees 100% availability for evaluators.

---

## ADR-002: IndexedDB via Dexie.js for Game Persistence
* **Status:** Accepted  
* **Date:** 2026-11-13  
* **Context:** The application must persist game progress across browser refreshes, store daily financial ledgers, and maintain customer logs without exceeding storage quotas or blocking the main thread.  
* **Decision:** Use IndexedDB managed through Dexie.js instead of `window.localStorage`.  
* **Consequences:** Provides structured schema versioning, asynchronous non-blocking I/O, transaction safety, and support for multi-day historical P&L analytics. A fallback to in-memory/localStorage is provided if IndexedDB is disabled in private browsing.

---

## ADR-003: Deterministic Invariant Protection for Inventory
* **Status:** Accepted  
* **Date:** 2026-11-13  
* **Context:** A common bug in tycoon games is "negative inventory" when multiple customer orders are fulfilled simultaneously or when orders are clicked faster than state ticks.  
* **Decision:** Enforce an atomic `canFulfillOrder()` guard before any inventory decrement. In state mutations, ingredients are clamped using `Math.max(0, current - required)` with invariant assertion testing.  
* **Consequences:** Prevents phantom tea brewing, negative ingredient values, and artificial cash generation. Orders are rejected cleanly with visual and screen-reader accessible notifications.

---

## ADR-004: Procedural Sound Synthesis via Native Web Audio API
* **Status:** Accepted  
* **Date:** 2026-11-13  
* **Context:** The game requires immersive audio (tea boiling, pouring, cash register bell, alert chimes), but cannot fetch external `.mp3` or `.wav` files from external CDNs.  
* **Decision:** Implement a lightweight procedural sound synthesizer using the native HTML5 `AudioContext` and oscillator/noise nodes.  
* **Consequences:** 0 KB external audio asset footprint, zero network latency, zero HTTP requests, instant audio generation, and full user control over audio mute/volume preferences.

---

## ADR-005: Round 1 Supply Shock Interactive Decision Engine
* **Status:** Accepted  
* **Date:** 2026-11-13  
* **Context:** The "Minute 40 Twist - Supply Shock" requires milk prices to double after round one, accompanied by an interactive strategic response mechanism.  
* **Decision:** Implement an unskippable modal gate at the end of Day 1 (Round 1) presenting three well-balanced strategic paths (Raise Prices, Absorb Margin, or Pivot Menu to low-milk Sulaimani/Black Chai). The choice dynamically mutates the economic multiplier and unlock states for all subsequent days.  
* **Consequences:** Enhances gameplay depth, rewards strategic thinking, and satisfies the challenge's mid-event twist requirements.
