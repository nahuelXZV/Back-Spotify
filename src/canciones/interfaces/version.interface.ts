import { CancionesEntity } from "../entities/canciones.entity";

export interface IVersion {
    idioma: string;
    letra: string;
    nombre_cancion: string;
    isBase: boolean;
    cancion: CancionesEntity;
    estado_traduccion: string;
}