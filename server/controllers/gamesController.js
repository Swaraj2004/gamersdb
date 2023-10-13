const asyncHandler = require("express-async-handler");
const igdb = require("igdb-api-node").default;
const client = igdb(
    process.env.TWITCH_CLIENT_ID,
    process.env.TWITCH_APP_ACCESS_TOKEN
);

// @desc Get recently released and upcoming games
// @route GET games/recent_and_upcoming
// @access Public
const getAllRecentAndUpcommingGames = asyncHandler(async (req, res) => {
    // Current time
    const now = parseInt(Date.now() / 1000);

    // Fetch data
    const response = await igdb()
        .multi([
            igdb()
                .query("games", "recent-releases")
                .fields("name, cover.url, slug")
                .where(`first_release_date < ${now}`)
                .sort("first_release_date desc")
                .limit(20),
            igdb()
                .query("games", "coming-soon")
                .fields("name, cover.url, slug")
                .where(`first_release_date > ${now}`)
                .sort("first_release_date asc")
                .limit(20),
        ])
        .request("/multiquery");

    // Format fetched data
    const formattedData = response.data.map((category) => ({
        name: category.name,
        result: category.result.map((game) => ({
            id: game.id,
            name: game.name,
            slug: game.slug,
            cover_url: game.cover
                ? `https:${game.cover.url}`.replace("thumb", "cover_big")
                : null,
        })),
    }));

    res.json(formattedData);
});

// @desc Get games
// @route GET games/search
// @access Public
const searchGames = asyncHandler(async (req, res) => {
    const { name, platforms, genres, minRating } = req.body;

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    // If platforms or genres or minRating provided
    // then form search query accordingly
    let query = "";
    const joinAnd = () => {
        if (query !== "") {
            query += " & ";
        }
    };
    if (platforms) {
        query += `platforms = (${[...platforms]})`;
    }
    if (genres) {
        joinAnd();
        query += `genres = (${[...genres]})`;
    }
    if (minRating) {
        joinAnd();
        query += `aggregated_rating >= ${minRating}`;
    }

    // Fetch data
    const response = await igdb()
        .fields("name, cover.url, slug, aggregated_rating")
        .limit(50)
        .search(name)
        .where(query)
        .request("/games");

    // Format fetched data
    const formattedData = response.data.map((game) => ({
        id: game.id,
        name: game.name,
        slug: game.slug,
        rating: game.aggregated_rating || null,
        cover_url: game.cover
            ? `https:${game.cover.url}`.replace("thumb", "cover_big")
            : null,
    }));

    res.json(formattedData);
});

// @desc Get game data
// @route GET games/gamedata
// @access Public
const getGameData = asyncHandler(async (req, res) => {
    const { slug } = req.body;

    // Confirm data
    if (!slug) {
        return res.status(400).json({ message: "Game slug is required" });
    }

    // Fetch game data
    const response = await igdb()
        .fields([
            "age_ratings.category",
            "age_ratings.rating",
            "aggregated_rating",
            "artworks.url",
            "cover.url",
            "first_release_date",
            "game_modes.name",
            "genres.name",
            "involved_companies.company.name",
            "involved_companies.developer",
            "involved_companies.publisher",
            "name",
            "platforms.name",
            "player_perspectives.name",
            "screenshots.url",
            "summary",
            "videos.video_id",
            "websites.url",
            "websites.category",
        ])
        .where(`slug = "${slug}"`)
        .request("/games");

    // Check if game exists
    if (!response.data.length) {
        return res.status(404).json({ message: "Game not found" });
    }

    // Fetched game data
    const game = response.data[0];

    // Find ESRB rating
    const ageRating = game.age_ratings
        ? game.age_ratings.find((rating) => rating.category === 1)
        : null;

    // Names for recieved rating number from igdb
    const ratingNum = {
        6: "Rating Pending",
        7: "RP Likely Mature 17+",
        8: "Everyone",
        9: "Everyone 10+",
        10: "Teen 13+",
        11: "Mature 17+",
        12: "Adults Only 18+",
    };

    // Find developer companies
    const developerCompanys = game.involved_companies
        ? game.involved_companies.filter((company) => company.developer)
        : null;

    // Find publisher companies
    const publisherCompanys = game.involved_companies
        ? game.involved_companies.filter((company) => company.publisher)
        : null;

    // Convert timestamp to human readable
    function dateReadable(timestamp) {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const date = new Date(timestamp * 1000);
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    // Format fetched data
    const formattedData = {
        id: game.id,
        name: game.name,
        rating: Math.round(game.aggregated_rating) || null,
        summary: game.summary || null,
        cover_url: game.cover
            ? `https:${game.cover.url}`.replace("thumb", "cover_big")
            : null,
        release_date: dateReadable(game.first_release_date) || null,
        age_rating: ageRating ? ratingNum[ageRating.rating] : null,
        game_modes: game.game_modes
            ? game.game_modes.map((mode) => mode.name)
            : null,
        genres: game.genres ? game.genres.map((genre) => genre.name) : null,
        developers: developerCompanys
            ? developerCompanys.map((developer) => developer.company.name)
            : null,
        publishers: publisherCompanys
            ? publisherCompanys.map((publisher) => publisher.company.name)
            : null,
        platforms: game.platforms
            ? game.platforms.map((platform) => platform.name)
            : null,
        player_perspectives: game.player_perspectives
            ? game.player_perspectives.map((perspective) => perspective.name)
            : null,
        screenshots: game.screenshots
            ? game.screenshots.map((screenshot) =>
                  `https:${screenshot.url}`.replace("thumb", "screenshot_huge")
              )
            : null,
        websites: game.websites
            ? game.websites.map((website) => {
                  return { category: website.category, url: website.url };
              })
            : null,
        videos: game.videos ? game.videos.map((video) => video.video_id) : null,
    };

    res.json(formattedData);
});

module.exports = {
    getAllRecentAndUpcommingGames,
    searchGames,
    getGameData,
};
