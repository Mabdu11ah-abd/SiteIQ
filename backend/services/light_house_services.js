import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

const runLighthouse = async (url) => {
  let browser;
  
  try {
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    };

    // Let Puppeteer find its own bundled Chrome
    // Only set executablePath if explicitly provided
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    browser = await puppeteer.launch(launchOptions);

    const options = {
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: (new URL(browser.wsEndpoint())).port,
    };

    const runnerResult = await lighthouse(url, options);

    return runnerResult.lhr;
  } catch (error) {
    console.error('Lighthouse error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default { runLighthouse };