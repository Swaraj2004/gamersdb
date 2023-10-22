export interface GameDataResponse {
    result: GameData;
    success: boolean;
}

export interface GameData {
    id: number;
    name: string;
    rating: number | null;
    summary: string | null;
    cover_url: string | null;
    release_date: string | null;
    age_rating: string | null;
    genres: string[] | null;
    game_modes: string[] | null;
    developers: string[] | null;
    publishers: string[] | null;
    platforms: string[] | null;
    player_perspectives: string[] | null;
    screenshots: string[] | null;
    videos: string[] | null;
    websites: {
        category: string;
        url: string;
    }[] | null;
}