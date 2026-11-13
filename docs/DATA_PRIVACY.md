# Data Privacy & Security Statement — Chai Tycoon

**Document:** DATA_PRIVACY.md  
**Event:** VibeSprint 1.0 (OWASP NIE)  
**Standard:** 100% Client-Side Privacy & Zero Telemetry Compliance  

---

## 1. Zero External Data Exfiltration

Chai Tycoon is engineered strictly to preserve end-user privacy and adhere to the zero-external-API mandate:
* **No External Servers:** The application transmits zero network packets to any external backend, logging server, or cloud host.
* **No Analytics or Trackers:** Zero third-party analytics libraries (such as Google Analytics, Mixpanel, or Sentry) are included in the bundle.
* **No User Identity Tracking:** The game does not collect personal names, email addresses, IP addresses, or device identifiers.

---

## 2. Local Storage & Data Lifecycle

* **Storage Technology:** Game state is persisted locally on the client's device using standard HTML5 **IndexedDB** (`ChaiTycoonDB`).
* **Data Scoping:** All database records are strictly origin-isolated to the user's local browser domain (`localhost` or local file origin).
* **User Control & Deletion:**
  * Players can completely wipe all saved progress, ledger records, and settings at any time by clicking the in-game **"Reset Game & Wipe Data"** button in the settings modal.
  * Clearing browser site data or running in incognito mode automatically leaves zero trace on disk.

---

## 3. OWASP Security Assessment

* **Cross-Site Scripting (XSS):** All dynamic strings (customer dialogues, review text) are rendered through React's native JSX escaping mechanisms without using `dangerouslySetInnerHTML`.
* **Injection Vulnerabilities:** Local persistence uses typed object-stores with Dexie.js rather than arbitrary string concatenation.
* **Supply Chain Security:** Zero runtime CDN dependencies; all styles, fonts, and assets are self-contained in the local build.
