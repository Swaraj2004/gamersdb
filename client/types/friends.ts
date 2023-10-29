export interface Friend {
    _id: string;
    username: string;
    profileImg: string | null;
}

export interface FriendsResponse {
    result: Friend[];
    success: boolean;
}
