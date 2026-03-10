# Production Deployment Guide

## Render + Neon Deployment

### Prerequisites
- Render account: https://render.com
- Neon account: https://neon.tech
- GitHub repository with your code

### Step 1: Create a Neon Postgres Database

1. Create a new Neon project.
2. Open your database and copy the connection string.
3. Use an SSL connection string in Render:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

### Step 2: Create Backend Service on Render

1. In Render, click New -> Web Service.
2. Connect this GitHub repository.
3. Use these commands:

```bash
Build Command: npm run install-all && npm run build
Start Command: npm run db:migrate -w packages/backend && npm run start -w packages/backend
```

4. Or use the included blueprint file `render.yaml`.

### Step 3: Configure Environment Variables in Render

Add the following in your Render service:

```bash
DATABASE_URL=postgresql://... # Neon connection string
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain
JWT_SECRET=<secure-random-string>
ADMIN_KEY=<optional-admin-key>
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Verify Database Migrations

The start command runs migrations on each deploy. Verify in Render logs, then test health:

```bash
curl https://your-render-service.onrender.com/api/health
```

### Step 5: Configure Frontend API URL

Set `VITE_API_URL` to your Render backend URL in `packages/frontend/.env.production`:

```bash
VITE_API_URL=https://your-render-service.onrender.com/api
```

### Step 6: CORS Configuration

Set `FRONTEND_URL` in Render to your exact frontend origin.

### Troubleshooting

Migration errors:
- Confirm `DATABASE_URL` points to Neon and includes `sslmode=require`.
- Check Render logs for migration failures.

Connection errors:
- Verify `VITE_API_URL` points to Render.
- Check backend health endpoint.

CORS errors:
- Verify `FRONTEND_URL` exactly matches deployed frontend origin.

### Security Checklist

- Set a strong `JWT_SECRET`.
- Use SSL for Neon (`sslmode=require`).
- Restrict CORS to trusted frontend domains.
- Keep `ADMIN_KEY` secret if enabled.

### Environment Summary

Backend (Render):

```bash
DATABASE_URL=postgresql://...&sslmode=require
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain
JWT_SECRET=<32+-char-random-string>
ADMIN_KEY=<optional>
```

Frontend:

```bash
VITE_API_URL=https://your-render-service.onrender.com/api
```
