import { UsersEntity } from "src/users/entities/users.entity";
import { SuscripcionEntity } from "../entities/suscripcion.entity";

export interface ISuscrito {
    fecha_inicio: String;
    fecha_final: String;
    estado: String;
    usuario: UsersEntity;
    suscripcion: SuscripcionEntity;
}