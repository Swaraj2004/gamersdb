export interface Game {
    id: number;
    name: string;
    slug: string;
    cover_url: string | null;
}

export interface GameCategory {
    name: string;
    result: Game[];
}

export interface GameResponse {
    result: GameCategory[];
    success: boolean;
}

export interface SearchGameResponse {
    result: Game[];
    success: boolean;
}
