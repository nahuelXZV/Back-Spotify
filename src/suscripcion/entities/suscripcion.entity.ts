import { Column, Entity } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { ISuscripcion } from "../interfaces/suscripcion.interface";

@Entity({ name: 'suscripcion' })
export class SuscripcionEntity extends BaseEntity implements ISuscripcion {

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column()
    precio: number;
    
    @Column()
    duracion: number;
    
    @Column()
    estado: string;
}
