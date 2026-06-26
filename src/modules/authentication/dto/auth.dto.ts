export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO extends LoginDTO {
    name: string;
    role: 'USER' | 'SAC' | 'ADMIN',
}

export interface LogoutDTO {
    id: number;
    tokens?: string | null
}
export interface RefreshDTO {
    id: number;
}