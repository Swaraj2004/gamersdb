const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// @desc Get news
// @route POST /news
// @access Public
const getNews = (req, res) => {
    const { limit, page } = req.body;

    // Check data
    if (!limit) {
        return res.status(400).json({
            message: "Page limit is required",
            success: false,
        });
    }

    // Fetch news data
    newsapi.v2
        .everything({
            domains: "eurogamer.net,kotaku.com,destructoid.com",
            language: "en",
            pageSize: limit,
            page: page || 1,
        })
        .then((response) => {
            // Format objects in the array
            const formattedResult = response.articles.map((obj) => {
                const { source, content, ...rest } = obj;
                return {
                    source: source.name,
                    ...rest,
                };
            });

            res.json({ result: formattedResult, success: true });
        })
        .catch((error) => {
            res.status(500).json({ message: error.message, success: false });
        });
};

module.exports = {
    getNews,
};
