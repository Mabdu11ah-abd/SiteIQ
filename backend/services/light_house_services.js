import axios from 'axios';

/**
 * Run PageSpeed Insights analysis using Google PageSpeed API
 * @param {string} url - The URL to analyze
 * @returns {Object} Lighthouse-compatible report object
 */
const runLighthouse = async (url) => {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  GOOGLE_PAGESPEED_API_KEY not set. Using API without key (limited quota).');
    }

    // PageSpeed API endpoint
    const apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    
    // Categories to analyze (matches Lighthouse categories)
    const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
    
    // Build API request
    const params = {
      url: url,
      strategy: 'mobile', // or 'desktop'
      category: categories,
    };
    
    if (apiKey) {
      params.key = apiKey;
    }

    console.log(`📊 Calling PageSpeed API for: ${url}`);
    
    const response = await axios.get(apiUrl, { 
      params,
      timeout: 180000 // 60 second timeout
    });

    if (!response.data || !response.data.lighthouseResult) {
      throw new Error('Invalid PageSpeed API response');
    }

    // Extract Lighthouse results from PageSpeed API response
    const lighthouseResult = response.data.lighthouseResult;
    
    console.log('✅ PageSpeed API analysis completed');
    
    // Return Lighthouse-compatible format
    return {
      fetchTime: lighthouseResult.fetchTime,
      finalUrl: lighthouseResult.finalUrl,
      lighthouseVersion: lighthouseResult.lighthouseVersion,
      requestedUrl: url,
      categories: lighthouseResult.categories,
      audits: lighthouseResult.audits,
      configSettings: lighthouseResult.configSettings,
      timing: lighthouseResult.timing,
      userAgent: lighthouseResult.userAgent,
    };
    
  } catch (error) {
    console.error('PageSpeed API error:', error.message);
    
    if (error.response) {
      // API returned an error response
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
      
      if (error.response.status === 429) {
        throw new Error('PageSpeed API quota exceeded. Please add GOOGLE_PAGESPEED_API_KEY to environment variables.');
      } else if (error.response.status === 400) {
        throw new Error(`Invalid URL or request: ${error.response.data.error?.message || 'Bad Request'}`);
      }
    }
    
    throw new Error(`PageSpeed analysis failed: ${error.message}`);
  }
};

export default { runLighthouse };