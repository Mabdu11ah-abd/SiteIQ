import axios from "axios";
import SeoReport from "../models/seoModel.js";
import SeoRecommendation from "../models/SeoRecommendation.js";
import Website from "../models/Website.js"; //new



const generateLightHouseRecommendation = async (req, res) => {
  try {
    console.log("✅ Step 1: Extracting user ID from auth...");
    const clerkUserId = req.auth.userId;
    console.log(clerkUserId);

    if (!req.auth || !req.auth.userId) {
      console.warn("❌ Missing auth context.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("✅ Step 2: Extracting domain from request body...");
    const { domain } = req.body;

    if (!domain) {
      console.warn("❌ Missing required field: domain.");
      return res.status(400).json({ error: "Missing required field: domain." });
    }

    console.log("✅ Step 3: Searching for Lighthouse report in DB...");
    const seoReportDoc = await SeoReport.findOne({ clerkUserId, domain });
    console.log("seoReportDoc:", JSON.stringify(seoReportDoc, null, 2));

    if (!seoReportDoc || !seoReportDoc.lighthouse) {
      console.warn("❌ Lighthouse report not found.");
      return res.status(404).json({
        error: "Lighthouse report not found.",
      });
    }

    console.log("✅ Step 4: Validating Novita API key...");
    const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
    if (!NOVITA_API_KEY) {
      console.error("❌ Missing Novita API key in environment variables.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    console.log("✅ Step 5: Extracting Lighthouse data...");
    const lighthouseData = seoReportDoc.lighthouseResult;
    const simplifiedData = {
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
      audits: {},
    };

    try {
      // Handle different Lighthouse result formats
      const categories =
        lighthouseData?.categories || lighthouseData?.lhr?.categories || {};

      simplifiedData.performance =
        categories.performance?.score ??
        categories["performance"]?.score ??
        null;

      simplifiedData.accessibility =
        categories.accessibility?.score ??
        categories["accessibility"]?.score ??
        null;

      simplifiedData.bestPractices =
        categories["best-practices"]?.score ??
        categories["bestPractices"]?.score ??
        null;

      simplifiedData.seo =
        categories.seo?.score ?? categories["seo"]?.score ?? null;

      // Handle audits data
      const audits =
        lighthouseData?.audits || lighthouseData?.lhr?.audits || {};

      simplifiedData.audits = Object.keys(audits)
        .filter(
          (key) =>
            audits[key]?.score !== null && audits[key]?.score !== undefined
        )
        .reduce((obj, key) => {
          obj[key] = {
            title: audits[key]?.title || "Untitled audit",
            description: audits[key]?.description || "No description available",
            score: audits[key]?.score,
            displayValue: audits[key]?.displayValue || "N/A",
          };
          return obj;
        }, {});
      } catch (error) {
      console.error("Error processing Lighthouse data:", error);
      // Return at least the basic structure even if processing fails
    }

    // Now use simplifiedData in your prompt
    console.log("Processed Lighthouse data:", simplifiedData);

    console.log("✅ Step 6: Constructing prompt...");
    const prompt = `You are an expert web performance analyst. You are given a structured Lighthouse report that includes:

- *Overall scores* for:
  - *Performance* (0 to 1 or null)
  - *Accessibility* (0 to 1 or null)
  - *Best Practices* (0 to 1 or null)
  - *SEO* (0 to 1 or null)

- *Detailed audits*: Each audit includes:
  - *title* (e.g., "First Contentful Paint")
  - *description* (what the audit checks and why it matters)
  - *score* (0 to 1)
  - *displayValue* (e.g., "1.5s", "14 elements failed")

---

🎯 Your task is to:

1. *Analyze the overall scores* in each category (Performance, Accessibility, Best Practices, SEO) and assess which area is weakest. Briefly summarize overall strengths and weaknesses.
2. *Review each audit* in detail, focusing especially on those with low scores (less than 0.9). For each weak audit:
   - Clearly describe *what the issue is* based on the title and description.
   - Explain *why the issue matters* (impact on user experience, web performance, SEO rankings, accessibility compliance, etc.)
   - Provide *step-by-step technical recommendations* for fixing the issue.
   - If available, use the displayValue to support your analysis.
3. For each recommendation, include:
   - *Priority Level* (High / Medium / Low)
   - *Category* (Performance / Accessibility / Best Practices / SEO)
   - *Audit Title*
   - *Issue Summary*
   - *Why It Matters*
   - *How to Fix It*
4. Group your recommendations by category and sort them by *priority* (high impact first).
5. Recommend tooling, code fixes, configuration changes, or external resources where appropriate (e.g., “Use WebP format for images to reduce load time by 30%”).
6. If any scores or audits are missing (null), mention them and recommend that those audits be rerun or investigated further.
7. Keep your recommendations technically accurate, highly actionable, and focused on what would move the needle in real-world performance or SEO.

---

✅ Format the output like this:

### 🔧 Recommendation {Number}
- *Priority Level:* High / Medium / Low
- *Category:* Performance / Accessibility / Best Practices / SEO
- *Audit Title:* e.g., "First Contentful Paint"
- *Issue Summary:* Brief and technical description of the problem
- *Why It Matters:* Describe impact (speed, UX, compliance, rankings, etc.)
- *How to Fix It:* Detailed steps, code-level advice, tools or libraries to use
- *Display Value (if present):* e.g., "2.1s"

---

🧠 Be direct, technical, and thorough. Avoid vague advice. Emphasize actionable strategies that developers can immediately use. Only include meaningful recommendations—skip audits that score 1.0 unless there's still room for optimization.

Lighthouse Report JSON:
${JSON.stringify(simplifiedData, null, 2)}
`; // FIX HERE: Changed reportData to simplifiedData and ensured backticks are correct

    console.log("✅ Step 7: Sending request to Novita AI...");
    const response = await axios.post(
      "https://api.novita.ai/v3/openai/chat/completions",
      {
        model: "deepseek/deepseek_v3",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000, // Increased for more detailed technical recommendations
        stream: false,
      },
      {
        headers: {
          // FIX HERE: Use backticks for the template literal string
          Authorization: `Bearer ${NOVITA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      console.error("❌ AI model returned empty response.");
      return res
        .status(500)
        .json({ error: "AI model returned an empty response." });
    }

    console.log("✅ Step 8: Extracting recommendation text...");
    const lighthouseRecommendationText =
      response.data.choices[0].message.content.trim();

    console.log("✅ Step 9: Saving recommendation to database...");
    const newRecommendation = new SeoRecommendation({
      clerkUserId,
      domain,
      seoReport: seoReportDoc._id,
      recommendations: {
        lighthouse: lighthouseRecommendationText,
        seo: "", // Leave empty as this is Lighthouse-specific
      },
      action: "Analyzed",
    });

    await newRecommendation.save();

    console.log("✅ Step 10: Successfully saved and responding to client.");
    return res.status(200).json({
      message: "Lighthouse recommendation generated and saved successfully.",
      recommendation: {
        lighthouse: lighthouseRecommendationText,
      },
    });
  } catch (error) {
    console.error(
      "❌ Error generating Lighthouse recommendations:",
      error.response?.data || error.message || error
    );
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// 📄 READ ALL recommendations for a user
const getSEORecommendations = async (req, res) => {
  try {
    
    console.log("✅ Step 1: Auth check");
    const clerkUserId = req.auth?.userId; // hardcoded for now
    console.log(clerkUserId);

    if (!clerkUserId) {
      console.warn("❌ Missing auth context.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("✅ Step 2: Extracting websiteId from params");
    const { websiteId } = req.params;

    if (!websiteId) {
      console.warn("❌ websiteId missing in URL params.");
      return res
        .status(400)
        .json({ error: "Missing website ID in request parameters." });
    }

    console.log("✅ Step 3: Finding Website with SEO recommendations...");
    const websiteDoc = await Website.findById(websiteId).populate({
      path: "seoRecommendation",
    });
    //website id with seoreport
    if (!websiteDoc) {
      console.warn("❌ Website not found.");
      return res.status(404).json({ error: "Website not found." });
    }

    console.log("✅ Step 4: Returning recommendations...");
    return res.status(200).json({
      recommendations: websiteDoc.seoRecommendation, // includes populated seoReport
    });
  } catch (error) {
    console.error("❌ getSEORecommendations error:", error?.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const getUserSeoRecommendations = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    console.log(clerkUserId);

    if (!clerkUserId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing Clerk User ID" });
    }

    // Step 1: Find the user's website
    const website = await Website.findOne({
      clerkuserId: clerkUserId,
    }).populate("seoRecommendation"); // Populate linked SEO recommendations

    if (!website) {
      return res.status(404).json({ error: "No website found for this user" });
    }

    // Step 2: Send only recommendations
    res.status(200).json({
      websiteDomain: website.domain,
      seoRecommendations: website.seoRecommendation, // populated array
    });
  } catch (error) {
    console.error("Error fetching SEO recommendations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✏ UPDATE a recommendation's action or notes
const updateRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body;

    const updated = await SeoRecommendation.findByIdAndUpdate(
      id,
      { action, notes },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Recommendation not found." });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update recommendation." });
  }
};

// ❌ DELETE a recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SeoRecommendation.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "Recommendation not found." });

    return res.status(200).json({ message: "Recommendation deleted." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete recommendation." });
  }
};

function buildSEOPrompt(scoresArray) {
  return `
You are provided with an SEO scoring report containing detailed metrics representing the health and performance of a website’s SEO. The scores object includes the following dimensions:

    - *rankingPosition:* Numerical score indicating the average ranking positions of targeted keywords in search engine results pages (SERPs). Higher scores mean better average rankings.
    - *keywordRelevance:* Numerical score reflecting how well the website’s content matches the targeted keywords and user intent.
    - *richSnippets:* Numerical score measuring the presence and correctness of structured data markup that enhances search listings with rich snippets.
    - *urlStructure:* Numerical score assessing the SEO-friendliness, clarity, and consistency of the website’s URLs.
    - *visibility:* Numerical score estimating how visible the site is in search results, factoring in impressions, click-through rates, and indexing status.
    - *competitorAnalysis:* Numerical score derived from a comparative analysis against primary competitors, including keyword overlap, backlink profiles, and content quality.
    - *paginationStrength:* Numerical score representing the effectiveness of pagination handling on the site, impacting crawl efficiency and user experience.
    - *total:* The cumulative SEO score combining the above factors into an overall site SEO health index.

    Your task is to analyze these scores in extreme detail and extract a comprehensive SEO report that provides the *best possible, **high-impact, **actionable recommendations* leveraging this valuable information. Use the scoring data as your central reference to identify precise SEO strengths, weaknesses, and strategic opportunities.

    For each dimension, perform the following:

    1. *Ranking Position:*
       - Analyze the average keyword rankings indicated by this score.
       - Identify whether poor rankings are likely due to on-page issues, off-page factors, or technical constraints.
       - Provide exact recommendations to improve keyword rankings, including content optimization, link-building, or technical fixes.

    2. *Keyword Relevance:*
       - Evaluate how well the site content aligns with the target keywords and user intent based on this score.
       - Identify gaps where keywords may be irrelevant, underused, or overly generic.
       - Recommend detailed content optimization, keyword targeting strategies, and semantic improvements to maximize relevance and organic traffic.

    3. *Rich Snippets:*
       - Assess the use of structured data markup and the impact on SERP enhancements.
       - Point out missing or incorrectly implemented schema types that could unlock rich snippets like FAQs, reviews, breadcrumbs, or product info.
       - Provide clear implementation steps and schema best practices to increase rich snippet visibility and click-through rates.

    4. *URL Structure:*
       - Examine URL consistency, readability, use of keywords, and avoidance of unnecessary parameters or dynamic IDs.
       - Suggest URL rewrites, canonicalization, and redirection strategies to improve crawlability and user experience.
       - Emphasize the SEO benefits of a clean, logical URL hierarchy and naming conventions.

    5. *Visibility:*
       - Interpret the site’s overall visibility score, factoring in impression share, index coverage, and organic click-through rates.
       - Identify potential indexing issues, penalty risks, or content quality problems reducing visibility.
       - Recommend technical and content improvements to maximize site visibility and organic traffic volume.

    6. *Competitor Analysis:*
       - Compare your site’s scores to known competitor benchmarks focusing on keyword coverage, backlink authority, and content depth.
       - Pinpoint competitive gaps and strategic weaknesses revealed by this score.
       - Suggest advanced tactics suchs as content gap filling, link acquisition from high-authority domains, and leveraging competitor weaknesses.

    7. *Pagination Strength:*
       - Evaluate how well pagination is handled from a user experience and SEO perspective based on this score.
       - Detect issues like duplicate content, improper rel=“next/prev” tags, or crawl inefficiencies in paginated series.
       - Propose pagination best practices and technical fixes to improve indexing and reduce bounce rates.

    8. *Total Score Analysis:*
       - Interpret the overall cumulative SEO health index.
       - Provide a strategic roadmap prioritizing high-impact fixes that will maximize SEO ROI within 3-6 months.
       - Recommend an implementation timeline that balances quick wins with long-term improvements.

    Format your output as a detailed, prioritized list where each recommendation includes:
    - *Priority Level:* High, Medium, or Low — indicating the urgency and impact of the recommendation.
    - *SEO Dimension:* Which scoring category this recommendation targets.
    - *Issue:* Clear, concise description of the problem or opportunity.
    - *Actionable Recommendation:* Step-by-step, specific actions to implement the fix or improvement.
    - *Expected Impact:* How this change will improve rankings, visibility, traffic, or conversions, supported by realistic outcomes.

    Be extremely precise and data-driven, directly referencing the scoring data provided. Avoid generic advice; tailor every suggestion to leverage the insights from these scores to deliver the best possible SEO results.

    Here is the SEO scoring data you must analyze:

${JSON.stringify(scoresArray, null, 2)}
  `;
}




const generateSEORecommendations = async (req, res) => {
  try {
    console.log("✅ Step 1: Auth check");
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      console.warn("❌ Missing auth context.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("✅ Step 2: Extracting websiteId from params");
    const { websiteId } = req.params;

    if (!websiteId) {
      console.warn("❌ websiteId missing in URL params.");
      return res.status(400).json({ error: "Missing website ID in request parameters." });
    }

    console.log("✅ Step 3: Finding Website by ID...");
    const websiteDoc = await Website.findOne({ _id: websiteId }).populate("seoReport");

    if (!websiteDoc) {
      console.warn("❌ Website not found.");
      return res.status(404).json({ error: "Website not found." });
    }

    console.log("✅ Step 4: Extracting SEO report...");
    const seoReportDoc = websiteDoc.seoReport;

    if (!seoReportDoc) {
      console.warn("❌ No SEO report found for website.");
      return res.status(404).json({ error: "SEO report not found for this website." });
    }

    // Validate Novita API key early
    const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
    if (!NOVITA_API_KEY) {
      return res.status(500).json({ error: "Missing Novita API key." });
    }

    // Prepare data for the single prompt
    let seoScoresData = null;
    if (seoReportDoc.phraseResults && seoReportDoc.phraseResults.length > 0) {
      seoScoresData = seoReportDoc.phraseResults.map(p => p.scores).slice(0, 10);
      console.log("✅ SEO phrase results detected for analysis.");
    } else {
      console.warn("⚠ No phraseResults found for SEO score analysis.");
    }

    let lighthouseAnalysisData = null;
    if (seoReportDoc.lighthouse && seoReportDoc.lighthouse.lighthouseReport) {
      console.log("✅ Lighthouse report detected for analysis.");
      const lighthouseRawReport = seoReportDoc.lighthouse.lighthouseReport;

      let lighthouseCategories = lighthouseRawReport.categories || {};
      let lighthouseAudits = lighthouseRawReport.audits || {};

      let lighthouseMetrics = {
          "first-contentful-paint": lighthouseAudits['first-contentful-paint']?.numericValue,
          "largest-contentful-paint": lighthouseAudits['largest-contentful-paint']?.numericValue,
          "cumulative-layout-shift": lighthouseAudits['cumulative-layout-shift']?.numericValue,
          "total-blocking-time": lighthouseAudits['total-blocking-time']?.numericValue,
          "speed-index": lighthouseAudits['speed-index']?.numericValue,
          "interactive": lighthouseAudits['interactive']?.numericValue,
      };

      const seoAndPerformanceAuditsToInclude = [
        "meta-description", "document-title", "link-text", "image-alt", "hreflang", "canonical",
        "robots-txt", "viewport", "content-width", "html-has-lang", "plugins",
        "crawlable-links", "is-crawlable", "font-display",
        "first-contentful-paint", "largest-contentful-paint", "cumulative-layout-shift",
        "speed-index", "total-blocking-time", "interactive",
        "server-response-time", "render-blocking-resources", "uses-long-cache-ttl",
        "uses-text-compression", "uses-optimized-images", "uses-responsive-images",
        "offscreen-images", "efficient-animated-content", "unminified-css", "unminified-javascript",
        "unused-css-rules", "unused-javascript", "dom-size", "redirects",
        "network-requests", "mainthread-work-breakdown", "bootup-time", "diagnostics"
      ];

      const importantAudits = {};
      seoAndPerformanceAuditsToInclude.forEach(auditKey => {
          if (lighthouseAudits[auditKey] && (lighthouseAudits[auditKey].score !== null || lighthouseAudits[auditKey].rawValue !== null)) {
              importantAudits[auditKey] = {
                  score: lighthouseAudits[auditKey].score,
                  title: lighthouseAudits[auditKey].title,
                  description: lighthouseAudits[auditKey].description,
                  displayValue: lighthouseAudits[auditKey].displayValue,
                  details: lighthouseAudits[auditKey].details
              };
          }
      });

      lighthouseAnalysisData = {
          scores: {
              performance: lighthouseCategories.performance?.score,
              accessibility: lighthouseCategories.accessibility?.score,
              'best-practices': lighthouseCategories['best-practices']?.score,
              seo: lighthouseCategories.seo?.score,
          },
          metrics: lighthouseMetrics,
          audits: importantAudits,
      };
      console.log('Processed Lighthouse data for prompt:', lighthouseAnalysisData);

    } else {
      console.warn("⚠ No valid Lighthouse data found for analysis.");
    }

    // Determine if any data is available for analysis
    if (!seoScoresData && !lighthouseAnalysisData) {
      console.warn("❌ No SEO or Lighthouse data available to generate recommendations.");
      return res.status(400).json({ error: "No SEO or Lighthouse data found for analysis." });
    }

    console.log("✅ Step 5: Building the combined prompt...");

    let combinedPrompt = `You are an expert web performance and technical SEO analyst. Your task is to analyze the provided data (if available) in extreme detail and generate **high-impact, actionable recommendations**.

Prioritize recommendations based on urgency and potential impact.

---

`;

    // Add SEO Scores section conditionally
    if (seoScoresData) {
      combinedPrompt += `## 📊 SEO SCORE ANALYSIS

You are provided with an SEO scoring report containing detailed metrics representing the health and performance of a website’s SEO. The scores object includes the following dimensions:

- *rankingPosition:* Numerical score indicating the average ranking positions of targeted keywords in search engine results pages (SERPs). Higher scores mean better average rankings.
- *keywordRelevance:* Numerical score reflecting how well the website’s content matches the targeted keywords and user intent.
- *richSnippets:* Numerical score measuring the presence and correctness of structured data markup that enhances search listings with rich snippets.
- *urlStructure:* Numerical score assessing the SEO-friendliness, clarity, and consistency of the website’s URLs.
- *visibility:* Numerical score estimating how visible the site is in search results, factoring in impressions, click-through rates, and indexing status.
- *competitorAnalysis:* Numerical score derived from a comparative analysis against primary competitors, including keyword overlap, backlink profiles, and content quality.
- *paginationStrength:* Numerical score representing the effectiveness of pagination handling on the site, impacting crawl efficiency and user experience.
- *total:* The cumulative SEO score combining the above factors into an overall site SEO health index.

Your task is to analyze these scores in extreme detail and extract a comprehensive SEO report that provides the *best possible, **high-impact, **actionable recommendations* leveraging this valuable information. Use the scoring data as your central reference to identify precise SEO strengths, weaknesses, and strategic opportunities.

For each dimension, perform the following:

1.  *Ranking Position:*
    - Analyze the average keyword rankings indicated by this score.
    - Identify whether poor rankings are likely due to on-page issues, off-page factors, or technical constraints.
    - Provide exact recommendations to improve keyword rankings, including content optimization, link-building, or technical fixes.

2.  *Keyword Relevance:*
    - Evaluate how well the site content aligns with the target keywords and user intent based on this score.
    - Identify gaps where keywords may be irrelevant, underused, or overly generic.
    - Recommend detailed content optimization, keyword targeting strategies, and semantic improvements to maximize relevance and organic traffic.

3.  *Rich Snippets:*
    - Assess the use of structured data markup and the impact on SERP enhancements.
    - Point out missing or incorrectly implemented schema types that could unlock rich snippets like FAQs, reviews, breadcrumbs, or product info.
    - Provide clear implementation steps and schema best practices to increase rich snippet visibility and click-through rates.

4.  *URL Structure:*
    - Examine URL consistency, readability, use of keywords, and avoidance of unnecessary parameters or dynamic IDs.
    - Suggest URL rewrites, canonicalization, and redirection strategies to improve crawlability and user experience.
    - Emphasize the SEO benefits of a clean, logical URL hierarchy and naming conventions.

5.  *Visibility:*
    - Interpret the site’s overall visibility score, factoring in impression share, index coverage, and organic click-through rates.
    - Identify potential indexing issues, penalty risks, or content quality problems reducing visibility.
    - Recommend technical and content improvements to maximize site visibility and organic traffic volume.

6.  *Competitor Analysis:*
    - Compare your site’s scores to known competitor benchmarks focusing on keyword coverage, backlink authority, and content depth.
    - Pinpoint competitive gaps and strategic weaknesses revealed by this score.
    - Suggest advanced tactics such as content gap filling, link acquisition from high-authority domains, and leveraging competitor weaknesses.

7.  *Pagination Strength:*
    - Evaluate how well pagination is handled from a user experience and SEO perspective based on this score.
    - Detect issues like duplicate content, improper rel=“next/prev” tags, or crawl inefficiencies in paginated series.
    - Propose pagination best practices and technical fixes to improve indexing and reduce bounce rates.

8.  *Total Score Analysis:*
    - Interpret the overall cumulative SEO health index.
    - Provide a strategic roadmap prioritizing high-impact fixes that will maximize SEO ROI within 3-6 months.
    - Recommend an implementation timeline that balances quick wins with long-term improvements.

Format your output as a detailed, prioritized list where each recommendation includes:
- *Priority Level:* High, Medium, or Low — indicating the urgency and impact of the recommendation.
- *SEO Dimension:* Which scoring category this recommendation targets.
- *Issue:* Clear, concise description of the problem or opportunity.
- *Actionable Recommendation:* Step-by-step, specific actions to implement the fix or improvement.
- *Expected Impact:* How this change will improve rankings, visibility, traffic, or conversions, supported by realistic outcomes.

Be extremely precise and data-driven, directly referencing the scoring data provided. Avoid generic advice; tailor every suggestion to leverage the insights from these scores to deliver the best possible SEO results.

Here is the SEO scoring data you must analyze:

\`\`\`json
${JSON.stringify(seoScoresData, null, 2)}
\`\`\`

---
`;
    } else {
      combinedPrompt += `## 📊 SEO SCORE ANALYSIS
No SEO phrase results data was provided for analysis.
---
`;
    }


    // Add Lighthouse Report section conditionally
    if (lighthouseAnalysisData) {
      combinedPrompt += `## ⚡ LIGHTHOUSE PERFORMANCE & TECHNICAL SEO ANALYSIS

Analyze the following Lighthouse report data. For each recommendation, state its priority (High, Medium, Low), the specific Lighthouse category/audit it addresses, the issue, the actionable steps, and the expected impact.

### 📈 Overall Lighthouse Scores:
- **Performance Score:** ${lighthouseAnalysisData.scores.performance !== undefined ? (lighthouseAnalysisData.scores.performance * 100).toFixed(0) : 'N/A'}%
- **Accessibility Score:** ${lighthouseAnalysisData.scores.accessibility !== undefined ? (lighthouseAnalysisData.scores.accessibility * 100).toFixed(0) : 'N/A'}%
- **Best Practices Score:** ${lighthouseAnalysisData.scores['best-practices'] !== undefined ? (lighthouseAnalysisData.scores['best-practices'] * 100).toFixed(0) : 'N/A'}%
- **SEO Score (Lighthouse):** ${lighthouseAnalysisData.scores.seo !== undefined ? (lighthouseAnalysisData.scores.seo * 100).toFixed(0) : 'N/A'}%

### ⏱️ Core Web Vitals & Performance Metrics Analysis:
Analyze these critical user-centric metrics. For any metric indicating a poor score (e.g., FCP > 1.8s, LCP > 2.5s, CLS > 0.1), identify the root cause from the audit data and provide clear optimization strategies.

- **First Contentful Paint (FCP):** ${lighthouseAnalysisData.metrics['first-contentful-paint'] || 'N/A'} ms (Target: < 1.8s)
- **Largest Contentful Paint (LCP):** ${lighthouseAnalysisData.metrics['largest-contentful-paint'] || 'N/A'} ms (Target: < 2.5s)
- **Cumulative Layout Shift (CLS):** ${lighthouseAnalysisData.metrics['cumulative-layout-shift'] || 'N/A'} (Target: < 0.1)
- **Total Blocking Time (TBT):** ${lighthouseAnalysisData.metrics['total-blocking-time'] || 'N/A'} ms (Target: < 200ms)
- **Speed Index:** ${lighthouseAnalysisData.metrics['speed-index'] || 'N/A'} (Lower is better)
- **Time to Interactive (TTI):** ${lighthouseAnalysisData.metrics['interactive'] || 'N/A'} ms (Target: < 3.8s)

### 💡 Detailed Audit Findings & Actionable Recommendations:
Go through the following specific audit results. For each audit that has a score less than 1 (indicating a failure or partial pass) or shows a clear issue (e.g., a "not applicable" audit that *should* be applicable or an informational audit with negative findings), explain the problem, its impact on SEO/UX/Performance, and provide detailed, step-by-step actionable solutions.

**Format each recommendation as follows:**

**Priority Level:** [High/Medium/Low]
**Lighthouse Category/Audit:** [e.g., Performance: Eliminate render-blocking resources, SEO: Image alt attributes]
**Issue:** [Concise description of the problem identified from the audit]
**Actionable Recommendation:**
- [Step 1: Specific instruction, e.g., "Defer or asynchronously load non-critical CSS/JS."]
- [Step 2: Further instruction, e.g., "Use srcset for responsive images."]
**Expected Impact:** [Clearly state the anticipated benefit, e.g., "Improves LCP by 500ms and reduces FCP, leading to better user experience and search ranking potential."]

---
Here are the audit results you must analyze. Pay close attention to the 'score', 'displayValue', and 'details' fields for deeper insights.

\`\`\`json
${JSON.stringify(lighthouseAnalysisData.audits, null, 2)}
\`\`\`

---
Provide a holistic summary and next steps, considering the interdependencies between performance, accessibility, and SEO.
`;
    } else {
      combinedPrompt += `## ⚡ LIGHTHOUSE PERFORMANCE & TECHNICAL SEO ANALYSIS
No Lighthouse report data was provided for analysis.
---
`;
    }

    console.log("✅ Step 6: Sending combined data to Novita API...");
    let aiRecommendationText = "";
    try {
      const novitaResponse = await axios.post(
        "https://api.novita.ai/v3/openai/chat/completions",
        {
          model: "deepseek/deepseek_v3",
          messages: [{ role: "user", content: combinedPrompt }],
          max_tokens: 2500, // Increased max_tokens significantly to accommodate both reports
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${NOVITA_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      aiRecommendationText = novitaResponse.data?.choices?.[0]?.message?.content?.trim() || "";
    } catch (apiError) {
      console.error("❌ Error generating combined recommendations from Novita API:", apiError?.response?.data || apiError.message);
      aiRecommendationText = "An error occurred while generating recommendations from the AI.";
    }

    console.log("✅ Step 7: Upserting recommendation to DB...");
    const updatedRecommendation = await SeoRecommendation.findOneAndUpdate(
      { seoReport: seoReportDoc._id },
      {
        clerkUserId: clerkUserId,
        website: websiteDoc._id,
        seoReport: seoReportDoc._id,
        recommendations: {
          seo: aiRecommendationText, // Store the combined text here
          lighthouse: "", // Keep this empty as the combined text is in 'seo'
        },
        action: "Analyzed",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    await Website.findByIdAndUpdate(
      websiteId,
      { $addToSet: { seoRecommendation: updatedRecommendation._id } },
      { new: true }
    );

    console.log("✅ Step 8: Response to client");
    return res.status(200).json({
      message: "SEO and Lighthouse recommendations generated and saved successfully.",
      recommendation: {
        seo: aiRecommendationText, // Return the combined text
      },
    });

  } catch (error) {
    console.error("❌ generateSEORecommendations error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};






















export {
  getSEORecommendations,
  generateSEORecommendations,
  generateLightHouseRecommendation,
  getUserSeoRecommendations,
  updateRecommendation,
  deleteRecommendation,
};

  // 📄 READ ONE recommendation by ID
  // const getRecommendationById = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const recommendation = await SeoRecommendation.findById(id);
  //     if (!recommendation) return res.status(404).json({ error: "Recommendation not found." });
  
  //     return res.status(200).json(recommendation);
  //   } catch (error) {
  //     return res.status(500).json({ error: "Failed to fetch recommendation." });
  //   }
  // };
