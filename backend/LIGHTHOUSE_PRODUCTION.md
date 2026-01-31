# Lighthouse Production Configuration

## Problem
Puppeteer/Lighthouse cannot find Chrome in production environments because:
1. Chrome is not pre-installed
2. Puppeteer cache path is not configured
3. System dependencies are missing

## Solutions Implemented

### 1. Updated Lighthouse Service
**File:** `services/light_house_services.js`
- Added production-friendly Chrome launch arguments
- Configured to use environment variables for Chrome executable path
- Added fallback to system Chrome if available

### 2. Puppeteer Configuration
**File:** `.puppeteerrc.cjs`
- Configured cache directory for Puppeteer
- Allows custom cache path via environment variable

### 3. Render Configuration
**File:** `render.yaml`
- Automated Chrome installation during build
- Set proper environment variables

## Deployment Steps

### For Render.com

#### Option A: Using render.yaml (Recommended)
1. Add `render.yaml` to your repository root
2. Render will automatically detect and use this configuration
3. Chrome will be installed during the build phase

#### Option B: Manual Configuration
1. Go to your Render dashboard
2. Navigate to your service settings
3. Add Build Command:
   ```bash
   npm install && npx puppeteer browsers install chrome
   ```
4. Add Environment Variables:
   - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false`
   - `PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer`

### For Other Hosting Providers

#### Heroku
Add buildpacks:
```bash
heroku buildpacks:add jontewks/puppeteer
heroku buildpacks:add heroku/nodejs
```

Add to `package.json`:
```json
{
  "scripts": {
    "heroku-postbuild": "npx puppeteer browsers install chrome"
  }
}
```

#### AWS Elastic Beanstalk
Create `.ebextensions/chrome.config`:
```yaml
packages:
  yum:
    atk: []
    cups-libs: []
    gtk3: []
    libXcomposite: []
    alsa-lib: []
    libXcursor: []
    libXdamage: []
    libXext: []
    libXi: []
    libXrandr: []
    libXScrnSaver: []
    libXtst: []
    pango: []
    xorg-x11-fonts-100dpi: []
    xorg-x11-fonts-75dpi: []
    xorg-x11-fonts-cyrillic: []
    xorg-x11-fonts-misc: []
    xorg-x11-fonts-Type1: []
    xorg-x11-utils: []

commands:
  01_install_chrome:
    command: "npx puppeteer browsers install chrome"
```

#### Docker
Add to `Dockerfile`:
```dockerfile
# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome executable path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install dependencies and Chrome
RUN npm install && npx puppeteer browsers install chrome
```

#### DigitalOcean App Platform
Add to `.do/app.yaml`:
```yaml
name: siteiq-backend
services:
  - name: api
    build_command: npm install && npx puppeteer browsers install chrome
    environment_slug: node-js
    envs:
      - key: PUPPETEER_CACHE_DIR
        value: /workspace/.cache/puppeteer
```

## Environment Variables

Add these to your production environment:

```bash
# Optional: Point to system Chrome if installed
CHROME_EXECUTABLE_PATH=/usr/bin/chromium

# Or use Puppeteer's Chrome
PUPPETEER_EXECUTABLE_PATH=/opt/render/.cache/puppeteer/chrome/linux-<version>/chrome-linux64/chrome

# Cache directory
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

# Don't skip download
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# Production mode
NODE_ENV=production
```

## Alternative: Use Chrome as a Service

For better performance and reliability, consider using headless Chrome as a service:

### Option 1: Browserless.io
```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
});
```

### Option 2: Apify
```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: process.env.APIFY_PROXY_URL,
});
```

## Troubleshooting

### Chrome Not Found
```bash
# SSH into your production server and run:
npx puppeteer browsers install chrome
```

### Missing Dependencies
If you see errors about missing libraries:
```bash
# For Debian/Ubuntu
apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### Memory Issues
If Lighthouse crashes due to memory:
1. Increase server memory
2. Add `--max-old-space-size=4096` to Node.js
3. Use `--single-process` flag for Chrome
4. Reduce concurrent Lighthouse runs

## Testing Locally

Test the production configuration locally:

```bash
# Set environment variable
export PUPPETEER_CACHE_DIR=./.cache/puppeteer

# Install Chrome
npx puppeteer browsers install chrome

# Test lighthouse
node -e "import('./services/light_house_services.js').then(m => m.default.runLighthouse('https://example.com')).then(console.log)"
```

## Performance Tips

1. **Cache Chrome Installation**: Don't reinstall on every deploy
2. **Use Single Process Mode**: Better for limited resources
3. **Limit Concurrent Runs**: Queue Lighthouse jobs
4. **Set Timeouts**: Prevent hanging processes
5. **Monitor Memory**: Lighthouse can be memory-intensive

## Cost Optimization

If Chrome installation is too resource-intensive:
1. Use a dedicated Chrome service (Browserless.io, ~$50/mo)
2. Run Lighthouse on a separate worker service
3. Cache results and run periodically, not on-demand
4. Use Lighthouse CI for scheduled scans
