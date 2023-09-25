import { UsersEntity } from "src/users/entities/users.entity";
import { GeneroEntity } from "../entities/genero.entity";
import { AlbumEntity } from "../entities/album.entity";

export interface ICanciones {
    imagen: string;
    nombre: string;
    slug: string;
    duracion: string;
    reproducciones: number;
    fecha_lanzamiento: Date;
    isPrivado: boolean;
    usuario: UsersEntity;
    genero: GeneroEntity;
    album: AlbumEntity;
}