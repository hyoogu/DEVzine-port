const redisClient = require('../../config/redis');

module.exports = {
  checkCacheForVisuals: async (req, res, next) => {
    const data = await redisClient.get('visualsActivated');
    if (data) {
      return res.status(200).json({
        data: JSON.parse(data),
        message: 'success',
        source: 'cache',
      });
    }
    return next();
  },
};
