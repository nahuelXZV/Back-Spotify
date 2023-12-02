import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { CancionesEntity } from "./canciones.entity";
import { IVersion } from "../interfaces/version.interface";

@Entity({ name: 'version' })
export class VersionEntity extends BaseEntity implements IVersion {

    @Column()
    idioma: string;

    @Column({ type: 'text' })
    letra: string;

    @Column()
    nombre_cancion: string;

    @Column({ default: false })
    isBase: boolean;

    @Column({ default: 'pendiente' })
    estado_traduccion: string;

    @ManyToOne(() => CancionesEntity, canciones => canciones.versiones, { onDelete: 'CASCADE' })
    cancion: CancionesEntity;
}
