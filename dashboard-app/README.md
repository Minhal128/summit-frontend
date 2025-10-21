Run dashboard on port 8081 (local dev)

This dashboard app is configured to run on port 8081 in development.

- Start the dashboard:

```powershell
# from h:\Development\crypto\summit-frontend\dashboard-app
npm install
npm run dev
```

- The frontend (summit-frontend) should redirect to the dashboard after login. To override the dashboard URL, set the environment variable in the frontend project:


If you want the frontend to redirect to the deployed dashboard instead of localhost, the default fallback used by the app is `https://dashboardsummit.vercel.app`.

To override this in local development, create a `.env.local` in `h:\Development\crypto\summit-frontend` with:

```env
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:8081
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Restart the frontend dev server (Next.js) after changing environment variables.
