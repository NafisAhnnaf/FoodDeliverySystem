export interface User {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    tier: 'USER' | 'ADMIN' | 'DEVELOPER';
}