import User from '../models/User.js'; // Import User model

/**
 * Increments usage count for the authenticated user and recommendation type.
 * @param {String} userId - The authenticated user id from the JWT payload.
 * @param {'seo'|'techstack'} type - The type of recommendation.
 */
const incrementUsage = async (userId, type) => {
  try {
    const user = await User.findById(userId) || await User.findOne({ clerkUserId: userId });
    if (!user) {
      console.warn(`❌ No user found for authenticated user id: ${userId}`);
      return;
    }

    // Ensure weekly tracking is still valid (optional safety)
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const weekStart = new Date(user.subscription.usage.weekStart || now);
    if (now - weekStart > oneWeek) {
      user.subscription.usage.seoRecommendations = 0;
      user.subscription.usage.techStackRecommendations = 0;
      user.subscription.usage.weekStart = now;
    }

    if (type === 'seo') {
      user.subscription.usage.seoRecommendations++;
    } else if (type === 'techstack') {
      user.subscription.usage.techStackRecommendations++;
    }

    await user.save();
    console.log(`✅ Incremented ${type} usage for user ${userId}`);
  } catch (err) {
    console.error(`❌ Error incrementing usage for user ${userId}:`, err.message);
  }
};

export default incrementUsage;
