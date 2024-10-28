import type { IBook } from "@/types/books";

export interface IUser {
    id: number;
    name: string;
    email: string;
    admin: boolean;
    password?: string;
    favorites: IBook[];
    created_at: Date;
    updated_at: Date;
}

export interface ICurrentUser extends IUser{}

export type IUserFor =  Omit<IUser, 'id' | 'favorites' | 'admin' | 'created_at' | 'updated_at'>;
