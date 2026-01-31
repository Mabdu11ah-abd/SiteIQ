import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';


const runLighthouse = async (url) => {
  let browser;
  
  try {
    // Launch Puppeteer with production-friendly configuration
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // Required for some hosting environments
        '--disable-gpu'
      ],
    };

    // Use system Chrome if available (common in production)
    if (process.env.CHROME_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.CHROME_EXECUTABLE_PATH;
    } else if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    browser = await puppeteer.launch(launchOptions);

    const options = {
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: (new URL(browser.wsEndpoint())).port,
    };

    // Run Lighthouse
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