# Backend Architecture Manifest — Chai Tycoon

**Directory:** `my-project/backend/`  
**Compliance Standard:** VibeSprint 1.0 Client-Only Architectural Mandate  

---

## 1. Architectural Role

Per the VibeSprint 1.0 specification and project requirements:
> **Limitation:** There must be absolutely no payment gateway or backend. Everything must run natively on the client. Zero External APIs & Zero .env dependency.

To strictly adhere to this constraint while fulfilling the prescribed multi-tier folder structure, this directory serves as the **Architecture Manifest & Local Static Server Harness**.

---

## 2. Offline Self-Contained Static Server (Optional)

While the frontend runs out-of-the-box via Vite (`npm run dev`), this directory includes a zero-dependency, native Node.js HTTP server (`serve.js`) that can host the compiled `frontend/dist` bundle completely offline without pulling any external packages.

To run the optional local server:
```bash
node serve.js [port]
```
* **External Dependencies:** Zero (uses Node.js built-in `http`, `fs`, `path`).
* **External Network Calls:** Zero.
* **Payment Gateways / Auth Services:** None.
