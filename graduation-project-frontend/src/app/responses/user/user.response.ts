export interface UserResponse {
    id: number;
    address?: string | null;
    birthDate?: string | null;
    email?: string | null;
    gender?: string | null;
    idCard: string;
    password?: string | null;
    phoneNumber?: string | null;
    role: string;
    userName: string;
}