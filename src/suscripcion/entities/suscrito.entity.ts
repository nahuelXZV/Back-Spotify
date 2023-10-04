import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { ISuscrito } from "../interfaces/suscrito.interface";
import { UsersEntity } from "src/users/entities/users.entity";
import { SuscripcionEntity } from "./suscripcion.entity";

@Entity({ name: 'suscrito' })
export class SuscritoEntity extends BaseEntity implements ISuscrito {

    @Column()
    fecha_inicio: String;

    @Column()
    fecha_final: String;

    @Column()
    estado: String;

    @ManyToOne(() => UsersEntity, user => user.suscripciones, { onDelete: 'CASCADE' })
    usuario: UsersEntity;

    @ManyToOne(() => SuscripcionEntity, suscripcion => '', { onDelete: 'CASCADE' })
    suscripcion: SuscripcionEntity;
}
