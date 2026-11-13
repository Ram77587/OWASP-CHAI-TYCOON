# Domain Context & Mathematical Formulations — Chai Tycoon

---

## 1. Domain Context: The Indian Chai Culture

In India, a *Chai Tapri* (roadside tea stall) is the social heartbeat of neighborhoods, college campuses, and commercial hubs. Running a successful stall requires balancing ingredient freshness, boiling temperatures, recipe balance (sweetness, spices, milk thickness), customer patience, and localized economics.

The simulation accurately reflects these cultural touchpoints:
* **Cutting Chai:** Half-measure quick tea, highly popular among commuters and students.
* **Masala Chai:** Rich, full-bodied spiced tea with cinnamon, clove, and black pepper.
* **Adrak Elaichi Chai:** Strong crushed ginger and aromatic green cardamom brew.
* **Kerala Sulaimani Chai:** Clear golden black tea with spices and lemon (critical low-milk strategic alternative).
* **Snacks:** Bun Maska (warm buttered bun) and Crispy Vegetable Samosas.

---

## 2. Standard Measurement & Recipe Matrix

All inventory is tracked in standardized metric units:
* **Milk:** Milliliters (ml)
* **Tea Leaves (Chai Patti):** Grams (g)
* **Sugar (Cheeni):** Grams (g)
* **Ginger (Adrak):** Slices / Grams
* **Cardamom (Elaichi):** Pods / Units
* **Cups:** Kulhad Clay / Eco-paper cups (Units)

### Recipe Specifications

| Item | Milk (ml) | Tea Leaves (g) | Sugar (g) | Ginger (g) | Cardamom (pods) | Cups | Base Cost (₹) | Default Price (₹) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cutting Chai** | 50 | 3 | 5 | 0 | 0 | 1 | ₹4.20 | ₹10.00 |
| **Masala Chai** | 80 | 5 | 7 | 1 | 1 | 1 | ₹7.50 | ₹15.00 |
| **Adrak Elaichi Chai** | 90 | 6 | 8 | 2 | 2 | 1 | ₹9.80 | ₹20.00 |
| **Sulaimani Chai** | 0 | 5 | 6 | 2 | 1 | 1 | ₹3.60 | ₹15.00 |
| **Bun Maska** | 0 | 0 | 0 | 0 | 0 | 1 (wrapper) | ₹12.00 | ₹25.00 |
| **Crispy Samosa** | 0 | 0 | 0 | 0 | 0 | 1 (plate) | ₹8.00 | ₹18.00 |

---

## 3. Economic Formulas & Simulation Parameters

### 3.1 Daily Revenue & Profit
$$\text{Gross Revenue} = \sum_{i=1}^{N_{\text{served}}} \left(\text{Price}_i + \text{Tip}_i\right)$$

$$\text{COGS} = \sum_{i=1}^{N_{\text{served}}} \text{Cost}(\text{Recipe}_i)$$

$$\text{Daily Net Profit} = \text{Gross Revenue} - \text{COGS} - \text{Daily Rent} - \text{Spoilage Cost}$$

### 3.2 Weather Demand Multiplier ($W_m$)
* **Monsoonal Downpour:** $W_m = 1.45$ (Tea demand surges by 45%; hot fried samosa demand surges by 60%).
* **Cold Winter Morning:** $W_m = 1.30$ (Demand increases for Adrak-Elaichi Chai).
* **Clear Sunny Day:** $W_m = 1.00$ (Standard baseline traffic).
* **Scorching Heatwave:** $W_m = 0.75$ (Hot tea demand dips; sulaimani and iced alternatives favored).

### 3.3 Customer Archetype Profiles

| Archetype | Price Sensitivity | Patience (seconds) | Preferred Order | Tipping Tendency |
| :--- | :--- | :--- | :--- | :--- |
| **College Student** | High (Walks out if Chai > ₹15) | 12s | Cutting Chai, Samosa | Low (5%) |
| **IT Techie** | Low (Tolerates Chai up to ₹30) | 10s | Adrak Elaichi Chai, Bun Maska | High (35%) |
| **Local Uncle/Elder**| Medium (Demands quality) | 18s | Masala Chai | Medium (15%) |
| **Commuter / Worker**| Medium (Needs quick service) | 8s | Cutting Chai | Medium (10%) |
