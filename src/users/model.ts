export interface UserSettings {
    isAwesome: boolean
}

export interface User {
    id?: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    settings: UserSettings
    data: string
}
