export interface Collection {
    _id: string;
    name: string;
}

export interface CollectionsResponse {
    result: Collection[];
    success: boolean;
}
