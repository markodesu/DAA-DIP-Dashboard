# Deployment Guide

This guide covers multiple deployment options for the DAA + DIP Dashboard.

## Prerequisites

- Node.js 20+ installed
- Git repository set up (if deploying to cloud platforms)

## Build the Application

First, build the production version:

```bash
cd dashboard
npm install
npm run build
```

This creates a `dist` folder with the production-ready files.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (optional, you can also use the web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from dashboard directory**:
   ```bash
   cd dashboard
   vercel
   ```

3. **Or use Vercel Web Interface**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Set root directory to `dashboard`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Deploy"

The `vercel.json` file is already configured to handle React Router routing.

### Option 2: Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy from dashboard directory**:
   ```bash
   cd dashboard
   netlify deploy --prod
   ```

3. **Or use Netlify Web Interface**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your repository
   - Set build settings:
     - Base directory: `dashboard`
     - Build command: `npm run build`
     - Publish directory: `dashboard/dist`
   - Click "Deploy site"

The `netlify.toml` and `public/_redirects` files are already configured.

### Option 3: GitHub Pages

1. **Update vite.config.js** to set base path:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // Replace with your GitHub repo name
   })
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

### Option 4: Traditional Web Server (Apache/Nginx)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Copy dist folder** to your web server

3. **Configure server for React Router**:

   **For Apache** (create `.htaccess` in dist folder):
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QR,L]
   ```

   **For Nginx**:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Environment Variables

If you need environment variables, create a `.env` file in the dashboard directory:

```env
VITE_API_URL=https://api.example.com
```

Access them in code as `import.meta.env.VITE_API_URL`.

## Troubleshooting

### Routes not working after deployment

- Ensure redirect rules are configured (already done in vercel.json and netlify.toml)
- For GitHub Pages, make sure base path is set correctly in vite.config.js

### Build errors

- Make sure Node.js version is 20+
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check for any console errors during build

### Assets not loading

- Check that all image paths use relative paths or are in the `public` folder
- Verify that base path is set correctly if using GitHub Pages

## Quick Deploy Commands

**Vercel:**
```bash
cd dashboard && vercel --prod
```

**Netlify:**
```bash
cd dashboard && netlify deploy --prod
```

**GitHub Pages:**
```bash
cd dashboard && npm run deploy
```

