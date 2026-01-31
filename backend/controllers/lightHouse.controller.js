import SeoReport from "../models/seoModel.js";
import Website from "../models/website.js"; // Assuming you have this
import lighthouseScrapper from "../services/light_house_scrapper.js";
import lighthouseService from "../services/light_house_services.js";

const { scrapeWebsite } = lighthouseScrapper;
const { runLighthouse } = lighthouseService;

const analyzeWebsite = async (req, res) => {
    try {
        console.log("hit the controller");
        const userId = req.userId;
        console.log(userId);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let { domain } = req.body;
        console.log(req.body);
        if (!domain) {
            return res.status(400).json({ error: "Missing required field: domain" });
        }

        // Normalize domain
        domain = domain.trim().replace(/^https?:\/\//i, "");
        const normalizedDomain = `https://${domain}`;

            // Check if website exists
            let website = await Website.findOne({
                clerkuserId: userId,
                domain: normalizedDomain,
            });
        console.log("website:", website);    
        if (!website) {
            website = new Website({
                clerkuserId: userId,
                domain: normalizedDomain,
            });
            await website.save();
        }

        // Create initial report
        const newReport = new SeoReport({
            clerkUserId: userId,
            website: website._id,
            phraseResults: [],
            lighthouse: {
                logs: ["🔄 Analysis initialized..."],
                error: null,
                lighthouseReport: {},
                createdAt: new Date(),
            },
        });

        await newReport.save();

        // Link report to website
        await Website.findByIdAndUpdate(website._id, {
            seoReport: newReport._id,
        });

        // Run SEO and Lighthouse analysis synchronously
        console.log("🔍 Running Lighthouse and SEO Scraper...");
        let seoData, lighthouseResult;

        try {
            [seoData, lighthouseResult] = await Promise.all([
                scrapeWebsite(normalizedDomain),
                runLighthouse(normalizedDomain),
            ]);
        } catch (err) {
            console.error("❌ Background analysis failed:", err.message || err);
            const failReport = await SeoReport.findByIdAndUpdate(
                newReport._id,
                {
                    $set: {
                        "lighthouse.logs": ["❌ Analysis failed."],
                        "lighthouse.error": {
                            message: err.message,
                            stack: err.stack,
                            name: err.name || "UnknownError",
                        },
                    },
                },
                { new: true }
            );
            return res
                .status(500)
                .json({ error: "Analysis failed", lighthouse: failReport.lighthouse });
        }

        console.log("✅ Updating SEO report with results...");
        const finalReport = await SeoReport.findByIdAndUpdate(
            newReport._id,
            {
                $set: {
                    "lighthouse.lighthouseReport": lighthouseResult,
                    "lighthouse.logs": ["✅ Lighthouse analysis completed."],
                    "lighthouse.error": null,
                    phraseResults: seoData,
                },
                $currentDate: {
                    "lighthouse.createdAt": true,
                },
            },
            { new: true }
        ).populate("website");

        return res.status(200).json({
            message: "Analysis completed successfully",
            lighthouse: finalReport.lighthouse,
        });
    } catch (error) {
        console.error("❌ Error initiating analysis:", error.message || error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔧 Background Processing Logic
const processAnalysis = async (reportId, domain) => {
    try {
        console.log("🔍 Running Lighthouse and SEO Scraper...");
        const [seoData, lighthouseResult] = await Promise.all([
            scrapeWebsite(domain),
            runLighthouse(domain),
        ]);

        console.log("✅ Updating SEO report with results...");
        await SeoReport.findByIdAndUpdate(reportId, {
            $set: {
                "lighthouse.lighthouseReport": lighthouseResult,
                "lighthouse.logs": ["✅ Lighthouse analysis completed."],
                "lighthouse.error": null,
                phraseResults: seoData,
            },
            $currentDate: {
                "lighthouse.createdAt": true,
            },
        });
    } catch (error) {
        console.error("❌ Background analysis failed:", error.message || error);
        await SeoReport.findByIdAndUpdate(reportId, {
            $set: {
                "lighthouse.logs": ["❌ Analysis failed."],
                "lighthouse.error": {
                    message: error.message,
                    stack: error.stack,
                    name: error.name || "UnknownError",
                },
            },
        });
    }
};

// 📄 READ ONE
const getReport = async (req, res) => {
    try {
        
        const { id } = req.params;
        console.log("🔍 Looking up website with ID:", id);

        const website = await Website.findById(id).populate("seoReport");

        if (!website) {
            return res.status(404).json({ error: "Website not found" });
        }

        if (!website.seoReport) {
            return res.status(404).json({ error: "No SEO report associated with this website" });
        }

        const lighthouse = website.seoReport.lighthouse;

        if (!lighthouse) {
            return res.status(404).json({ error: "Lighthouse report not found" });
        }

        return res.status(200).json(website.seoReport);
    } catch (error) {
        console.error("❌ Error fetching lighthouse report:", error.message || error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📄 READ ALL for current user
const getAllReports = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const reports = await SeoReport.find({ clerkUserId: userId })
            .populate("website")
            .sort({ createdAt: -1 });

        return res.status(200).json(reports);
    } catch (error) {
        console.error("❌ Error fetching reports:", error.message || error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📝 UPDATE
const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await SeoReport.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ error: "Report not found" });
        }

        return res.status(200).json(updated);
    } catch (error) {
        console.error("❌ Error updating report:", error.message || error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ❌ DELETE
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await SeoReport.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Report not found" });
        }

        // Remove reference from website
        await Website.findByIdAndUpdate(deleted.website, {
            $unset: { seoReport: "" },
        });

        return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting report:", error.message || error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export { analyzeWebsite, getReport, getAllReports, updateReport, deleteReport };