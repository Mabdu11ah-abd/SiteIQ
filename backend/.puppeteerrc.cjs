const { join } = require('path');

/**
 * Puppeteer configuration for production deployment
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Use system Chrome if available, otherwise download
  cacheDirectory: process.env.PUPPETEER_CACHE_DIR || join(__dirname, '.cache', 'puppeteer'),
};
