export interface TokenData {
    expires: number;
    token: string;
}

export interface NotificationData {
    message: string;
    status: string;
}

export interface UserPublicData {
    id: number;
    email: string;
    isAdmin: boolean;
    isConfirmed: boolean;
    authType: 'local' | 'google' | 'facebook';
}
