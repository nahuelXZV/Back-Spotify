import { Entity, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base.entity';
import { ROLES } from '../../config/constants';
import { IUser } from '../interfaces/user.interface';
import { CancionesEntity } from 'src/canciones/entities/canciones.entity';
import { AlbumEntity } from 'src/canciones/entities/album.entity';

@Entity({ name: 'user' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(() => CancionesEntity, user => user.usuario)
  canciones: CancionesEntity[];

  @OneToMany(() => AlbumEntity, user => user.usuario)
  albumes: AlbumEntity[];
}
