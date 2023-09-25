import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { IAlbum } from "../interfaces/album.interface";
import { CancionesEntity } from "./canciones.entity";
import { UsersEntity } from "src/users/entities/users.entity";

@Entity({ name: 'album' })
export class AlbumEntity extends BaseEntity implements IAlbum {

    @Column()
    imagen: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ unique: true })
    slug: string;

    @ManyToOne(() => UsersEntity, user => user.albumes, { onDelete: 'CASCADE' })
    usuario: UsersEntity;

    @OneToMany(() => CancionesEntity, album => album.album, { onDelete: 'CASCADE' })
    canciones: CancionesEntity[];
}
