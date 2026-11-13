# Judge Runbook — Chai Tycoon (VibeSprint 1.0)

**Project:** Chai Tycoon  
**Evaluation Time:** ~2 Minutes  
**Target:** Quick verification of features, core loop, mid-event twist, and constraints.  

---

## 1. Quick Launch (30 Seconds)

1. Open a terminal in `my-project/frontend`:
   ```bash
   cd my-project/frontend
   npm install
   npm run dev
   ```
2. Open the browser at the local URL (typically `http://localhost:5173`).
3. Notice that the game loads **instantly** without any backend, external API keys, or `.env` files.

---

## 2. Fast Evaluation Checklist

| Time | Action | Expected Behavior |
| :--- | :--- | :--- |
| **0:00 - 0:30** | **Morning Procurement** | Check starting capital (₹500). Purchase milk, tea, spices, and cups. Adjust Chai prices. Click **"Open Stall for Day 1"**. |
| **0:30 - 1:00** | **Daytime Rush & Zero Negative Bug Test** | Customers appear with dynamic patience bars. Click **"Serve"** or use keyboard hotkeys (`1`, `2`, `3`). Notice boiling animation and procedural Web Audio sfx. When an ingredient reaches 0, observe that the button turns disabled / "Out of Stock" — **zero negative inventory**. |
| **1:00 - 1:30** | **Day 1 Summary & The Minute 40 Supply Shock** | When the day ends, review the P&L statement (Revenue, COGS, Rent, Net Margin). Click **"Continue"**. The **"Breaking News: Dairy Crisis"** modal immediately triggers. |
| **1:30 - 2:00** | **Interactive Crisis Decision** | Review the 3 strategic choices (Raise Prices, Absorb Margin, Pivot to Sulaimani Chai). Select an option and observe Day 2 market rates and menu dynamically change. |

---

## 3. Constraint Compliance Verification

* **Offline / Zero Network:** Open Browser DevTools $\rightarrow$ Network tab $\rightarrow$ Set to "Offline" or reload. The game continues running smoothly.
* **Storage Inspection:** DevTools $\rightarrow$ Application $\rightarrow$ IndexedDB $\rightarrow$ `ChaiTycoonDB`. All state and day records are saved natively.
* **Zero `.env`:** No `.env` file exists or is loaded by the application.
