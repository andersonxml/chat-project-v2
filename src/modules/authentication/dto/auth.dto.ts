export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO extends LoginDTO {
    name: string;
}

export interface LogoutDTO {
    id: number;
    tokens?: string | null
}