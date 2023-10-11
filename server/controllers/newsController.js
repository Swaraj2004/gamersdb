const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// @desc Get news
// @route GET /news
// @access Public
const getNews = (req, res) => {
    const { limit, page } = req.body;
    newsapi.v2
        .everything({
            domains: "eurogamer.net,kotaku.com",
            language: "en",
            pageSize: limit || 30,
            page: page || 1,
        })
        .then((response) => {
            res.json(response);
        });
};

module.exports = {
    getNews,
};
