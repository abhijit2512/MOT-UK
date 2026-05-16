# MOTMate UK

A beginner-friendly local MVP for checking UK vehicle MOT history and listing
vehicles for sale. Frontend in React + Vite + Tailwind. Backend in Express +
SQLite. Runs **fully offline** out of the box thanks to a built-in mock MOT
service — no DVSA credentials needed to try it.

---

## 1. What MOTMate UK does

- Check a UK vehicle's MOT status & history by registration number
- Voice search ("Check MOT for AB12 CDE") using the browser's Web Speech API
- List a vehicle for sale (form with seller contact details)
- Browse a marketplace of vehicle listings
- Open a vehicle's full details and check its MOT from there
- A simple admin dashboard to mark listings as sold / available / delete

## 2. Software you need installed

- **Node.js 20 LTS** (or 22 LTS): https://nodejs.org — **pick the LTS download**, not "Current".
  - ⚠️ **Do not use Node 24** on Windows. `better-sqlite3` does not yet ship
    prebuilt binaries for Node 24 on Windows, so `npm install` will try to
    compile it from C++ source and fail unless you have Python and Visual
    Studio Build Tools installed.
  - If you already have Node 24, install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
    and switch:
    ```cmd
    nvm install 20.18.0
    nvm use 20.18.0
    ```
- A code editor — **VS Code** is recommended: https://code.visualstudio.com
- (Optional) **Claude Code** if you want AI help editing the project

Check your install:

```bash
node --version
npm --version
```

`node --version` should report `v20.x.x` or `v22.x.x`.

## 3. Install dependencies

From the project root (the folder containing this README):

```bash
npm run install:all
```

This installs root, server and client dependencies in one go.

## 4. Run the whole project

```bash
npm run dev
```

This runs the backend and frontend together.

- Frontend: **http://localhost:5173**
- Backend health: **http://localhost:3001/api/health**

To stop: press `Ctrl + C` in the terminal.

## 5. Run frontend only

```bash
npm run dev:client
```

## 6. Run backend only

```bash
npm run dev:server
```

## 7. Mock MOT mode (default)

By default the backend uses realistic **mock** MOT data so you don't need DVSA
credentials. Any valid-looking UK registration will produce a result.

Mock mode is controlled by `DVSA_MOT_MOCK_MODE`. Set it in `server/.env`
(copy `server/.env.example` to `server/.env`):

```env
DVSA_MOT_MOCK_MODE=true
```

When mock mode is on you can use anything like `AB12CDE`, `LR21XYZ`, `MM70TST`…

## 8. Adding real DVSA MOT API credentials later

1. Apply for access to the DVSA MOT History API
   (https://documentation.history.mot.api.gov.uk/).
2. Copy `server/.env.example` to `server/.env`.
3. Fill in:
   ```env
   DVSA_MOT_MOCK_MODE=false
   DVSA_CLIENT_ID=...
   DVSA_CLIENT_SECRET=...
   DVSA_API_KEY=...
   DVSA_TOKEN_URL=...
   DVSA_SCOPE_URL=...
   DVSA_LOOKUP_URL_TEMPLATE=https://history.mot.api.gov.uk/v1/trade/vehicles/registration/{registration}
   ```
4. Open `server/src/services/motService.ts` and complete the
   `fetchRealMotData()` function. The OAuth + lookup flow is described in
   the comment block there.

**Never** put DVSA credentials in the frontend or commit `server/.env`.

## 9. Project structure

```
motmate-uk/
  client/                  React + Vite + Tailwind frontend
    src/
      components/          Reusable UI (Navbar, cards, spinner…)
      pages/               One file per route (Home, MOT, Sell, Browse, Details, Admin)
      services/            api.ts (HTTP) and voiceService.ts (Web Speech)
      types/               Shared TypeScript types
      utils/               format & validation helpers
      App.tsx, main.tsx    App entry & routes
  server/                  Express + SQLite backend
    src/
      db/                  SQLite setup (auto-creates motmate.db)
      routes/              health, mot, listings
      services/            motService.ts (mock + real placeholder)
      middleware/          error handler
      types/, utils/       Shared types & validation
      index.ts             Server entry
    data/                  SQLite database file lives here (auto-created, gitignored)
    .env.example           Copy to .env to override defaults
  package.json             Root scripts (install:all, dev, build, check)
  README.md
```

## 10. How to test each feature

After `npm run dev`, open http://localhost:5173.

### MOT check
1. Go to **MOT Check** in the navbar (or use the home search bar).
2. Type `AB12CDE` and press **Check**.
3. You should see a MOT result card with PASS/FAIL, expiry, advisories,
   and a history timeline.

### Voice command
1. Use Chrome or Edge (best Web Speech support).
2. Open **MOT Check**, click the **Voice** button (allow microphone).
3. Say: *"Check MOT for AB12 CDE"*.
4. The detected registration appears in the input and the check runs automatically.
5. If your browser doesn't support voice, a friendly message is shown and
   typing still works.

### Sell my vehicle
1. Go to **Sell**, fill in all required fields.
2. Submit. You'll see a success screen with a link to the new listing.

### Browse vehicles
1. Go to **Browse**. You should see the demo listings + anything you added.
2. Use the search box to filter by make/model/reg.

### Vehicle details
1. From **Browse**, click **View details** on any card.
2. Read the listing, see seller contact, then click
   **Check MOT for this vehicle** — MOT data renders below.

### Admin dashboard
1. Go to **Admin**.
2. See totals (total / available / sold).
3. Toggle a listing's status with **Mark sold** / **Mark available**.
4. **Delete** removes a listing (after confirmation).

## 11. Legal & privacy notes

- This project is an MVP. It is **not** affiliated with DVSA or the UK government.
- If you connect the real DVSA API, you must follow the official
  [DVSA MOT History API terms](https://documentation.history.mot.api.gov.uk/).
- Don't collect or store more seller personal data than necessary.
  Treat seller contact details as sensitive — never log them, never expose them
  to third parties.
- Add proper **authentication** to the admin dashboard and listing endpoints
  before deploying publicly. The current `/admin` page has no login by design,
  so it can be demoed easily — search the code for `TODO (security)` and
  `TODO (production security)` to find the spots to harden.
- Add rate-limiting and CAPTCHA on public MOT and listing endpoints to prevent
  abuse of the real DVSA API quota and listing spam.
- Run behind HTTPS only when deployed.

## Useful root scripts

```bash
npm run install:all   # install everything
npm run dev           # run client + server together
npm run dev:client    # run only the frontend
npm run dev:server    # run only the backend
npm run build         # build both
npm run check         # TypeScript type-check both
```
