import { UsersEntity } from "src/users/entities/users.entity";

export interface IAlbum {
    nombre: string;
    imagen: string;
    slug: string;
    usuario: UsersEntity;
}