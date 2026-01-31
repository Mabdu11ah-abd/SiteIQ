# Google PageSpeed API Setup

## Overview
We've migrated from local Lighthouse (requires Chrome/Puppeteer) to Google PageSpeed Insights API for better production reliability and zero Chrome installation requirements.

## Benefits
✅ No Chrome/Puppeteer installation needed
✅ No memory-intensive browser processes
✅ Faster and more reliable in production
✅ Free tier: 25,000 queries/day
✅ Same Lighthouse data as local runs

## Getting Your API Key (Optional but Recommended)

### Without API Key
- Free tier: **25 queries per 100 seconds**
- Good for: Development/testing
- May hit rate limits quickly

### With API Key
- Free tier: **25,000 queries per day**
- Good for: Production use
- No rate limit issues

### Setup Steps

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Create a new project or select existing one
   - Project name: `SiteIQ` (or any name)

3. **Enable PageSpeed Insights API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for: "PageSpeed Insights API"
   - Click on it and press "Enable"

4. **Create API Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Restrict Your API Key (Recommended)**
   - Click on your newly created API key
   - Under "API restrictions":
     - Select "Restrict key"
     - Check only "PageSpeed Insights API"
   - Under "Application restrictions" (optional):
     - Add your server IP or domain
   - Save

6. **Add to Environment Variables**

   **Local Development (.env file):**
   ```bash
   GOOGLE_PAGESPEED_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Render.com:**
   - Go to your service dashboard
   - Environment → Add Environment Variable
   - Key: `GOOGLE_PAGESPEED_API_KEY`
   - Value: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxx`
   - Save Changes

   **Heroku:**
   ```bash
   heroku config:set GOOGLE_PAGESPEED_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Docker:**
   ```yaml
   environment:
     - GOOGLE_PAGESPEED_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxx
   ```

## Usage

The API is drop-in compatible with the existing Lighthouse service:

```javascript
import lighthouseService from './services/light_house_services.js';

const result = await lighthouseService.runLighthouse('https://example.com');

// Returns Lighthouse-compatible format with:
// - categories (performance, accessibility, best-practices, seo)
// - audits (detailed metrics)
// - scores (0-1 range)
```

## API Quotas & Limits

### Free Tier (With API Key)
- **25,000 queries/day** per project
- **No burst limits**
- **No cost**

### Without API Key
- **25 queries per 100 seconds** per IP
- Quickly hits rate limits
- Not suitable for production

### Paid Tier
- Higher quotas available if needed
- Billing starts after free tier exceeded
- Unlikely needed for most projects

## Rate Limit Handling

The service automatically handles rate limits:

```javascript
// If rate limit hit (HTTP 429)
throw new Error('PageSpeed API quota exceeded. Please add GOOGLE_PAGESPEED_API_KEY to environment variables.');
```

**Solutions:**
1. Add API key (recommended)
2. Implement caching/throttling
3. Queue analysis requests

## Caching Strategy (Recommended)

To reduce API calls, cache results:

```javascript
// Example caching in controller
const cacheKey = `lighthouse:${url}`;
const cachedResult = await redis.get(cacheKey);

if (cachedResult) {
  return JSON.parse(cachedResult);
}

const result = await runLighthouse(url);
await redis.setex(cacheKey, 3600, JSON.stringify(result)); // Cache 1 hour
```

## Desktop vs Mobile Analysis

Currently set to **mobile** strategy. To change:

**In `light_house_services.js`:**
```javascript
const params = {
  url: url,
  strategy: 'desktop', // Change from 'mobile' to 'desktop'
  category: categories,
};
```

Or make it configurable:
```javascript
const runLighthouse = async (url, strategy = 'mobile') => {
  const params = {
    url: url,
    strategy: strategy, // 'mobile' or 'desktop'
    category: categories,
  };
  // ...
};
```

## Troubleshooting

### Error: "PageSpeed API quota exceeded"
**Solution:** Add `GOOGLE_PAGESPEED_API_KEY` environment variable

### Error: "Invalid URL or request"
**Solution:** Ensure URL is publicly accessible and properly formatted (include https://)

### Slow Response Times
- PageSpeed API typically responds in 30-60 seconds
- This is normal as it runs full Lighthouse analysis
- Consider implementing background job processing

### API Key Not Working
1. Verify API is enabled in Google Cloud Console
2. Check API restrictions match your use case
3. Ensure key has PageSpeed Insights API permission
4. Try creating a new unrestricted key for testing

## Migration from Lighthouse

### What Changed
- ❌ Removed: `lighthouse` package
- ❌ Removed: `puppeteer` package  
- ❌ Removed: Chrome installation
- ❌ Removed: `.puppeteerrc.cjs`
- ✅ Added: Google PageSpeed API integration
- ✅ Kept: Same return format (Lighthouse-compatible)

### No Code Changes Needed
The controller and all existing code continue to work unchanged. The service returns the same data structure.

### Clean Up

Remove old packages:
```bash
npm uninstall lighthouse puppeteer puppeteer-core
```

Already done in `package.json`! ✅

## Cost Estimate

**Free Forever:**
- 25,000 API calls/day
- Assuming 1 analysis per website per day
- Supports up to 25,000 unique websites/day
- **$0/month** 🎉

**If You Exceed:**
- Extra $5 per 1,000 additional queries
- Highly unlikely for most SaaS applications
- Can set billing alerts in Google Cloud Console

## Monitoring

Track API usage in Google Cloud Console:
- Go to: https://console.cloud.google.com/apis/dashboard
- Select: PageSpeed Insights API
- View: Quotas, traffic, errors

Set up alerts for quota limits approaching.

## Additional Resources

- [PageSpeed Insights API Docs](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Reference](https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)
