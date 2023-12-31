import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { ICanciones } from "../interfaces/canciones.interface";
import { UsersEntity } from "src/users/entities/users.entity";
import { GeneroEntity } from "./genero.entity";
import { AlbumEntity } from "./album.entity";
import { VersionEntity } from "./version.entity";

@Entity({ name: 'canciones' })
export class CancionesEntity extends BaseEntity implements ICanciones {

    @Column()
    imagen: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true, default: '00:00' })
    duracion: string;

    @Column({ default: 0 })
    reproducciones: number;

    @Column({ type: 'date', nullable: true, default: new Date() })
    fecha_lanzamiento: Date;

    @Column({ default: true })
    isPrivado: boolean;

    @ManyToOne(() => UsersEntity, user => user.canciones, { onDelete: 'CASCADE' })
    usuario: UsersEntity;

    @ManyToOne(() => GeneroEntity, genero => genero.canciones, { onDelete: 'CASCADE' })
    genero: GeneroEntity;

    @ManyToOne(() => AlbumEntity, album => album.canciones, { onDelete: 'CASCADE' })
    album: AlbumEntity;

    @OneToMany(() => VersionEntity, versiones => versiones.cancion)
    versiones: VersionEntity[];
}
