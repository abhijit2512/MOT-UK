# MOTMate UK

A local **MVP** web app for checking UK vehicle MOT history and buying/selling used vehicles.

> MVP means "minimum viable product" — a small first version that proves the idea works.

---

## What MOTMate UK does

- **Check a vehicle's MOT** by typing or by **voice command** ("Check MOT for AB12 CDE").
- **Sell** a vehicle through a simple listing form.
- **Browse** vehicles for sale as cards.
- **Open a vehicle's details page** and check its MOT from the same screen.
- Manage listings from a simple **admin dashboard**.

The MOT API runs in **mock mode** out of the box, so you can run everything locally without any API keys.

---

## 1. Software you need

Install these once on your computer:

1. **Node.js 18 or newer** — <https://nodejs.org> (pick the LTS download).
2. **VS Code** (any editor really) — <https://code.visualstudio.com>.
3. **Claude Code** (optional, for AI-assisted edits) — <https://claude.com/claude-code>.

Check Node is installed by opening a terminal and running:

```bash
node --version
npm --version
```

You should see version numbers (e.g. `v22.x.x`).

---

## 2. Install dependencies

From inside the `motmate-uk` folder run:

```bash
npm run install:all
```

This installs three sets of packages: the root tooling, the **server**, and the **client**.

---

## 3. Run the full project (frontend + backend together)

```bash
npm run dev
```

Two services start in the same terminal:

- **Frontend (Vite):** <http://localhost:5173>
- **Backend (Express):** <http://localhost:3001>
- **Backend health check:** <http://localhost:3001/api/health>

Open the frontend URL in your browser. That's it.

### Run only the frontend

```bash
npm run dev:client
```

### Run only the backend

```bash
npm run dev:server
```

---

## 4. Mock MOT mode (default)

Out of the box the backend returns **realistic fake MOT data** for any plate you enter. This lets you demo and develop without DVSA credentials.

You'll see a yellow banner on the MOT result confirming mock mode is active.

### How to add real DVSA MOT API credentials later

1. Apply for access to the DVSA MOT History API: <https://documentation.history.mot.api.gov.uk/>
2. Copy `server/.env.example` to `server/.env`:

   ```bash
   cp server/.env.example server/.env
   ```

3. Edit `server/.env`:

   ```env
   DVSA_MOT_MOCK_MODE=false
   DVSA_CLIENT_ID=your-client-id
   DVSA_CLIENT_SECRET=your-client-secret
   DVSA_API_KEY=your-api-key
   DVSA_TOKEN_URL=https://login.microsoftonline.com/.../oauth2/v2.0/token
   DVSA_SCOPE_URL=https://tapi.dvsa.gov.uk/.default
   DVSA_LOOKUP_URL_TEMPLATE=https://history.mot.api.gov.uk/v1/trade/vehicles/registration/{registration}
   ```

4. Restart the backend (`Ctrl+C` then `npm run dev`).

> The mapping from DVSA's response to MOTMate's internal shape lives in
> `server/src/services/motService.ts` — adjust the field names there once
> you see real responses.

---

## 5. Project folders explained

```
motmate-uk/
├── client/                     React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/         Reusable UI: Navbar, VehicleCard, MotResultCard…
│   │   ├── pages/              Each route: Home, MotCheck, Sell, Browse, Admin…
│   │   ├── services/api.ts     Calls to the backend
│   │   ├── types/              Shared TypeScript types
│   │   ├── utils/              Helpers (formatting, voice parsing)
│   │   ├── App.tsx             Routes
│   │   ├── main.tsx            React entry point
│   │   └── index.css           Tailwind styles
│   ├── index.html
│   ├── vite.config.ts          Dev server + /api proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── server/                     Express + SQLite backend
│   ├── src/
│   │   ├── db/database.ts      SQLite setup + schema + demo data
│   │   ├── routes/             MOT and listings HTTP endpoints
│   │   ├── services/           MOT service (mock + real DVSA) + listings logic
│   │   ├── middleware/         Error handler
│   │   ├── types/              Shared types
│   │   ├── utils/              Registration cleanup/validation
│   │   └── index.ts            Server entry point
│   ├── data/                   SQLite file lives here (auto-created)
│   ├── .env.example            Copy to .env for real credentials
│   └── tsconfig.json
│
├── package.json                Root scripts (install:all, dev, build, check)
└── README.md
```

---

## 6. How to test each feature

After running `npm run dev`, open <http://localhost:5173>.

### MOT check
1. Click **MOT Check** in the navbar.
2. Type any UK-looking plate like `AB12CDE`, `BD19XYZ`, or `LX21KMN`.
3. Click **Check MOT** — you'll see the result card and history timeline.

### Voice command
1. On the MOT Check page, click **Voice search**. Allow microphone access.
2. Say: **"Check MOT for AB12 CDE"**.
3. The app extracts the plate, fills the input, and runs the check.
4. If your browser doesn't support voice (e.g. Firefox), you'll see a friendly message — type it instead.

### Sell my vehicle
1. Click **Sell My Vehicle**.
2. Fill all required fields. Bad values (missing email, negative price, etc.) show inline errors.
3. Click **Create listing** → you'll see a success screen and links to view your listing or browse all.

### Browse vehicles
1. Click **Browse**. Three demo cars are pre-seeded plus anything you've added.
2. Search by make, model, plate, or fuel; toggle **Show sold** to include sold listings.

### Vehicle details
1. From Browse, click **View Details** on any card.
2. Read the full description and seller info.
3. Click **Check MOT for this vehicle** — the MOT result appears underneath.

### Admin dashboard
1. Click **Admin**.
2. See total / available / sold counts.
3. For each listing: **Mark sold** ↔ **Mark available**, or **Delete**.

> ⚠️ The admin page has **no login** in the MVP — anyone hitting the URL can edit listings. Add authentication before any public deployment (see notes below).

---

## 7. Useful commands

```bash
npm run install:all   # Install root + client + server dependencies
npm run dev           # Run frontend + backend together
npm run dev:client    # Frontend only
npm run dev:server    # Backend only
npm run build         # Production build of client and server
npm run check         # TypeScript type-check (no build)
```

---

## 8. Legal & privacy notes (please read before going public)

- **DVSA API terms:** if you switch to the real MOT History API, you must comply with the official DVSA API terms of use, fair-use limits, and attribution requirements.
- **Don't store unnecessary personal data.** This MVP intentionally collects only what's needed to contact a seller.
- **Protect seller contact details.** They are currently exposed on the listing detail page so the seller can be contacted. Consider hiding behind a contact form before launch.
- **Add authentication.** The admin dashboard is open in the MVP — **do not deploy publicly without auth**.
- **Tighten security:** add Helmet, rate limiting, stricter CORS, HTTPS, input sanitisation everywhere, and audit dependencies before launch.

---

## 9. Known MVP limitations

- No user accounts / no authentication.
- Vehicle images are URLs only (no file upload).
- SQLite local file — fine for development, swap for Postgres/MySQL in production.
- Voice search depends on the browser's Web Speech API (best on Chrome/Edge).
- Mock MOT data is deterministic per plate but not real.
- No email notifications, no payment, no chat between buyer and seller.

Have fun, and treat this as your starting point — build on top of it.
