# Render + Neon Deployment - Quick Steps

## 1. Create Neon Database

1. Create a Neon project.
2. Copy the connection string.
3. Ensure it uses SSL:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

## 2. Set Render Backend Environment Variables

Go to your Render Web Service -> Environment and add:

```bash
DATABASE_URL=<your-neon-url>
JWT_SECRET=<paste-output-below>
NODE_ENV=production
FRONTEND_URL=https://test-analytics-metrics.github.io
PORT=10000
```

Generate `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Configure Build/Start in Render

```bash
Build Command: npm run install-all && npm run build
Start Command: npm run db:migrate -w packages/backend && npm run start -w packages/backend
```

You can also deploy with the repository `render.yaml` blueprint.

## 4. Update Frontend Production URL

Edit `packages/frontend/.env.production`:

```bash
VITE_API_URL=https://your-render-service.onrender.com/api
```

## 5. Deploy

```bash
git add .
git commit -m "Switch deploy stack to Render and Neon"
git push origin main
```

## 6. Verify

1. Check Render logs for successful migration output.
2. Check backend health:

```bash
curl https://your-render-service.onrender.com/api/health
```

3. Open frontend and test login, project creation, and test upload.

## Troubleshooting

If backend cannot connect to DB:
- Verify Neon `DATABASE_URL` is correct.
- Ensure `sslmode=require` exists.

If frontend cannot reach backend:
- Verify `VITE_API_URL` points to Render backend.
- Rebuild frontend: `npm run build -w packages/frontend`.
- Ensure backend `FRONTEND_URL` matches frontend origin.
