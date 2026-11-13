# Five-Test Checklist & Verification Suite — Chai Tycoon

**Document:** FIVE_TEST_CHECKLIST.md  
**Purpose:** Comprehensive reproducible test scripts validating all core mechanics, invariants, and constraints.

---

### Test 1: Deterministic Zero-Negative Inventory Invariant
* **Objective:** Ensure the simulation never allows inventory numbers to fall below zero under rapid clicking or ingredient exhaustion.
* **Steps:**
  1. Start Day 1 with low ingredients (e.g., only 100ml of Milk and 1 Cup).
  2. Serve the first customer demanding Cutting Chai (consuming 50ml Milk, 1 Cup).
  3. Serve the second customer (consuming 50ml Milk, 1 Cup). Milk and Cups are now 0.
  4. Rapidly click "Serve" or press keyboard hotkey `1` on subsequent waiting orders.
* **Pass Criteria:**
  - Inventory displays `0 ml` Milk and `0` Cups.
  - The UI instantly disables the serve action and marks the order as "Out of Stock".
  - Customer patience expires and customer departs with an "Out of stock!" dialogue.
  - No negative numbers (`-1`, `-50`) appear in the UI or in IndexedDB state.

---

### Test 2: The Minute 40 Supply Shock Trigger & Interactive Decision
* **Objective:** Verify that completing Round 1 (Day 1) triggers the Dairy Crisis Supply Shock and that user decisions dynamically alter Day 2 simulation parameters.
* **Steps:**
  1. Complete Day 1 rush hours.
  2. Review the Day 1 Financial Summary modal and click "Proceed to Next Day".
  3. Observe the full-screen **"BREAKING NEWS: DAIRY CRISIS"** modal appearance.
  4. Select **Strategy C: Reformulate & Pivot Menu (Low-Milk Sulaimani Chai)**.
* **Pass Criteria:**
  - Day 2 milk procurement price is doubled (from ₹25 to ₹50 per Liter).
  - Sulaimani Chai (zero milk) is unlocked and featured on the menu.
  - Customer dialogues reference the milk shortage and praise the Sulaimani Chai option.

---

### Test 3: Offline Persistence & Refresh Rehydration
* **Objective:** Verify that all game state, cash, inventory, and historical summaries persist across hard browser reloads.
* **Steps:**
  1. Earn ₹150 in revenue during Day 1.
  2. Refresh the browser tab (`Ctrl + R` or `F5`).
  3. Open Chrome DevTools $\rightarrow$ Application $\rightarrow$ IndexedDB $\rightarrow$ `ChaiTycoonDB`.
* **Pass Criteria:**
  - Cash balance, day counter, and purchased inventory are restored accurately.
  - No data is lost, and no crash occurs.

---

### Test 4: Financial Ledger & P&L Mathematical Precision
* **Objective:** Verify that Gross Revenue, COGS, Rent, and Net Margin match exact deterministic formulas.
* **Steps:**
  1. Sell 5 Cutting Chais at ₹10 each (Gross = ₹50).
  2. COGS per cup = ₹4.20 (Total COGS = ₹21.00).
  3. Stall Rent = ₹20.00.
  4. Day Net Profit should equal: $50 - 21 - 20 = ₹9.00$.
* **Pass Criteria:**
  - The Day End Summary ledger shows exact arithmetic balance with zero floating point rounding errors (`toFixed(2)` applied).

---

### Test 5: Procedural Sound Synthesis & Keyboard Accessibility
* **Objective:** Verify sound generation without external audio requests and full keyboard control.
* **Steps:**
  1. Open DevTools Network tab $\rightarrow$ filter by `media` or `.mp3`/`.wav`.
  2. Serve an order by pressing keyboard key `1`.
  3. Listen to the procedurally synthesized kettle boil and coin drop chimes.
* **Pass Criteria:**
  - Audio plays cleanly through the Web Audio API.
  - Zero network requests are made to fetch external sound files.
  - Mute toggle in the top-right successfully silences all synthesizer nodes.
