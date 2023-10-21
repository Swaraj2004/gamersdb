const asyncHandler = require("express-async-handler");
const igdb = require("igdb-api-node").default;
const client = igdb(
    process.env.TWITCH_CLIENT_ID,
    process.env.TWITCH_APP_ACCESS_TOKEN
);

// @desc Get recently released and upcoming games
// @route GET games/recent_and_upcoming/:limit
// @access Public
const getAllRecentAndUpcommingGames = asyncHandler(async (req, res) => {
    const limit = req.params.limit;

    // Check data
    if (!limit) {
        return res.status(400).json({
            message: "Page limit is required",
            success: false,
        });
    }

    // Current time
    const now = parseInt(Date.now() / 1000);

    // Fetch data
    const response = await igdb()
        .multi([
            igdb()
                .query("games", "recent-releases")
                .fields("name, cover.url, slug, aggregated_rating")
                .where(
                    `first_release_date < ${now} & parent_game = null & version_parent = null`
                )
                .sort("first_release_date desc")
                .limit(limit),
            igdb()
                .query("games", "coming-soon")
                .fields("name, cover.url, slug, aggregated_rating")
                .where(
                    `first_release_date > ${now} & parent_game = null & version_parent = null`
                )
                .sort("first_release_date asc")
                .limit(limit),
        ])
        .request("/multiquery");

    // Format fetched data
    const formattedData = response.data.map((category) => ({
        name: category.name,
        result: category.result.map((game) => ({
            id: game.id,
            name: game.name,
            slug: game.slug,
            rating: game.aggregated_rating || null,
            cover_url: game.cover
                ? `https:${game.cover.url}`.replace("thumb", "cover_big")
                : null,
        })),
    }));

    res.json({ result: formattedData, success: true });
});

// @desc Get games
// @route POST games/search
// @access Public
const searchGames = asyncHandler(async (req, res) => {
    const { name, platforms, genres, minRating } = req.body;

    // Confirm data
    if (!name) {
        return res
            .status(400)
            .json({ message: "Name is required", success: false });
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
        .limit(100)
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

    res.json({ result: formattedData, success: true });
});

// @desc Get game data
// @route GET games/gamedata/:slug
// @access Public
const getGameData = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    // Confirm data
    if (!slug) {
        return res
            .status(400)
            .json({ message: "Game slug is required", success: false });
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
        return res
            .status(404)
            .json({ message: "Game not found", success: false });
    }

    // Fetched game data
    const game = response.data[0];

    // Set id, name, rating, summary
    const id = game.id;
    const name = game.name;
    const rating = Math.round(game.aggregated_rating) || null;
    const summary = game.summary || null;

    // Find cover url
    const cover_url = game.cover
        ? `https:${game.cover.url}`.replace("thumb", "720p")
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
    // Set release date
    const release_date = dateReadable(game.first_release_date) || null;

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
    // Set age rating
    const age_rating = ageRating ? ratingNum[ageRating.rating] : null;

    // Find genres
    const genres = game.genres ? game.genres.map((genre) => genre.name) : null;

    // Find game modes
    const game_modes = game.game_modes
        ? game.game_modes.map((mode) => mode.name)
        : null;

    // Find developer companies
    const developers = game.involved_companies
        ? game.involved_companies
              .filter((company) => company.developer)
              .map((developer) => developer.company.name)
        : null;

    // Find publisher companies
    const publishers = game.involved_companies
        ? game.involved_companies
              .filter((company) => company.publisher)
              .map((publisher) => publisher.company.name)
        : null;

    // Find platforms
    const platforms = game.platforms
        ? game.platforms.map((platform) => platform.name)
        : null;

    // Find player perspectives
    const player_perspectives = game.player_perspectives
        ? game.player_perspectives.map((perspective) => perspective.name)
        : null;

    // Find screenshots
    const screenshots = game.screenshots
        ? game.screenshots.map((screenshot) =>
              `https:${screenshot.url}`.replace("thumb", "screenshot_huge")
          )
        : null;

    // Find videos
    const videos = game.videos
        ? game.videos.map((video) => video.video_id)
        : null;

    // Find required websites with urls
    const websiteCategories = {
        1: "official",
        13: "steam",
        15: "itch",
        16: "epicgames",
        17: "gog",
    };
    let websites = game.websites
        ? game.websites
              .filter((website) =>
                  [1, 13, 15, 16, 17].includes(website.category)
              )
              .map((website) => {
                  return {
                      category: websiteCategories[website.category],
                      url: website.url,
                  };
              })
        : null;
    if (websites !== null && websites.length === 0) websites = null;

    // Format fetched data
    const formattedData = {
        id,
        name,
        rating,
        summary,
        cover_url,
        release_date,
        age_rating,
        genres,
        game_modes,
        developers,
        publishers,
        platforms,
        player_perspectives,
        screenshots,
        videos,
        websites,
    };

    res.json({ result: formattedData, success: true });
});

module.exports = {
    getAllRecentAndUpcommingGames,
    searchGames,
    getGameData,
};
