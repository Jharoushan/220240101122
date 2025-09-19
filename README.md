URL Shortener (MERN)

Backend (Node/Express + MongoDB) and Frontend (React + Vite + Material UI).

Backend
- Location: `Backend/`
- Env vars (create `Backend/.env`):
```
MONGO_URI=mongodb://localhost:27017/affordmed
BASE_URL=http://localhost:4000
FRONTEND_ORIGIN=http://localhost:3000
GEO_API_URL=http://ip-api.com/json/
```
- Run:
```
cd Backend
npm install
node src/server.js
```

API
- POST `/shorturls` body: `{ url, validity?, shortcode? }`
- 201 response: `{ shortLink, expiry }`
- GET `/shorturls/:code` => stats object with clicks list
- Redirect: `GET /:code`

Frontend
- Location: `frontend/`
- Env vars (create `frontend/.env`):
```
VITE_API_BASE=http://localhost:4000
```
- Run:
```
cd frontend
npm install
npm run dev
```

Pages
- Shortener: up to 5 URLs, client validation, displays results and expiry.
- Statistics: fetch stats by shortcode; shows totals and click log.




