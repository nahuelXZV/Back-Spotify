import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { IGenero } from "../interfaces/genero.interface";
import { CancionesEntity } from "./canciones.entity";

@Entity({ name: 'genero' })
export class GeneroEntity extends BaseEntity implements IGenero {

    @Column()
    imagen: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ unique: true })
    slug: string;

    @OneToMany(() => CancionesEntity, generos => generos.genero)
    canciones: CancionesEntity[];
}
