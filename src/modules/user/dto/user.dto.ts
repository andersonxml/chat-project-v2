export interface EditDTO {
    name?: string | undefined ,
    email?: string | undefined,
    password?: string | undefined,
    role?: 'USER' | 'SAC' | 'ADMIN' | undefined
}