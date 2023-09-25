import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { CancionesEntity } from '../entities/canciones.entity';
import { CreateCancionesDto, UpdateCancionesDto } from '../dto';
import { AlbumService } from './album.service';
import { GeneroService } from './genero.service';
import { FileSystemService } from 'src/common/utils/fileSystem.utils';
import { UserService } from 'src/users/services/users.service';
import { VersionService } from './version.service';
import { AlbumEntity } from '../entities/album.entity';
import { GeneroEntity } from '../entities/genero.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

@Injectable()
export class CancionesService {

  private readonly logger = new Logger('CancionesService');
  relaciones = ['usuario', 'genero', 'album'];

  constructor(
    @InjectRepository(CancionesEntity)
    private readonly cancionesRepository: Repository<CancionesEntity>,
    private readonly albumService: AlbumService,
    private readonly generoService: GeneroService,
    private readonly userService: UserService,
    private readonly versionService: VersionService,
  ) { }

  public async create(
    createCancionesDto: CreateCancionesDto,
    user_id: string,
    cancion: Express.Multer.File,
    imagen: Express.Multer.File,
  ): Promise<CancionesEntity> {
    const { nombre, album, genero, isPrivado } = createCancionesDto;
    const extension = imagen.originalname.split('.').pop();
    const slug = nombre.toLowerCase().replace(/ /g, '-');
    const name_file = slug + '.' + extension;
    const fecha_lanzamiento = new Date();
    const duracion = '00:00';
    const reproducciones = 0;
    try {
      const albumEntity: AlbumEntity = await this.albumService.findOne(album);
      const generoEntity: GeneroEntity = await this.generoService.findOne(genero);
      const userEntity: UsersEntity = await this.userService.findOne(user_id);
      const cancionEntity: CancionesEntity = this.cancionesRepository.create({
        imagen: name_file,
        nombre,
        slug,
        duracion,
        fecha_lanzamiento,
        isPrivado,
        reproducciones,
        album: albumEntity,
        genero: generoEntity,
        usuario: userEntity,
      });
      const newCancion = await this.cancionesRepository.save(cancionEntity);
      FileSystemService.saveFile({
        pathFile: 'canciones',
        name: name_file,
        file: imagen,
      });
      // versionService 
      this.versionService.create(cancion, newCancion);
      return newCancion;
    } catch (error) {
      FileSystemService.deleteFile({
        pathFile: 'canciones',
        name: name_file,
      });
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<CancionesEntity[]> {
    try {
      const { limit, offset } = queryDto;
      if (limit && offset) return await this.cancionesRepository.find({ skip: offset, take: limit, relations: this.relaciones });
      if (limit) return await this.cancionesRepository.find({ take: limit, relations: this.relaciones });
      return await this.cancionesRepository.find({ relations: this.relaciones });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findManyBy(attribute: any, value: any): Promise<CancionesEntity[]> {
    try {
      console.log(attribute, value);
      return await this.cancionesRepository.createQueryBuilder('canciones')
        .leftJoinAndSelect('canciones.usuario', 'usuario')
        .leftJoinAndSelect('canciones.album', 'album')
        .leftJoinAndSelect('canciones.genero', 'genero')
        .where(`canciones.${attribute} = :value`, { value })
        .getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<CancionesEntity> {
    try {
      return await this.cancionesRepository.findOne({ where: { id }, relations: ['usuario', 'genero', 'album'] });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateExampleDto: UpdateCancionesDto, user_id: string, imagen?: Express.Multer.File): Promise<CancionesEntity> {
    try {
      const cancion = await this.findOne(id);
      const user = await this.userService.findOne(user_id);
      if (cancion.usuario.id !== user.id) throw new Error('No tienes permiso para editar esta cancion');
      const { genero, album, isPrivado, nombre } = updateExampleDto;
      if (nombre) {
        const slug = nombre.toLowerCase().replace(/ /g, '-');
        cancion.nombre = nombre;
        cancion.slug = slug;
      }
      if (genero) {
        const generoEntity = await this.generoService.findOne(genero);
        cancion.genero = generoEntity;
      }
      if (album) {
        const albumEntity = await this.albumService.findOne(album);
        cancion.album = albumEntity;
      }
      if (isPrivado) cancion.isPrivado = isPrivado;
      if (imagen) {
        FileSystemService.deleteFile({ pathFile: 'canciones', name: cancion.imagen });
        const extension = imagen.originalname.split('.').pop();
        const name_file = cancion.slug + '.' + extension;
        cancion.imagen = name_file;
        FileSystemService.saveFile({
          pathFile: 'canciones',
          name: cancion.imagen,
          file: imagen,
        });
      }
      const cancionUpdated = await this.cancionesRepository.save(cancion);
      return cancionUpdated;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<DeleteMessage> {
    try {
      const cancion = await this.findOne(id);
      const cancionDeleted = await this.cancionesRepository.delete(cancion.id);
      if (cancionDeleted.affected === 0) throw new Error('Cancion no eliminado');
      FileSystemService.deleteFile({ pathFile: 'canciones', name: cancion.imagen });
      return { message: 'Cancion eliminado', deleted: true, };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
