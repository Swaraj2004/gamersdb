export interface News {
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
}

export interface NewsResponse {
    result: News[];
    success: boolean;
}
