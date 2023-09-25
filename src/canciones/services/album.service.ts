import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { AlbumEntity } from '../entities/album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto';
import { FileSystemService } from 'src/common/utils/fileSystem.utils';
import { UserService } from 'src/users/services/users.service';

@Injectable()
export class AlbumService {

    private readonly logger = new Logger('AlbumService');

    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
        private readonly userService: UserService,
    ) { }

    public async create(createAlbumDto: CreateAlbumDto, user_id: string, imagen: Express.Multer.File): Promise<AlbumEntity> {
        const { nombre } = createAlbumDto;
        const extension = imagen.originalname.split('.').pop();
        const slug = nombre.toLowerCase().replace(/ /g, '-');
        const name_file = slug + '.' + extension;
        try {
            const user = await this.userService.findOne(user_id);
            const album = this.albumRepository.create({
                imagen: name_file,
                nombre,
                slug,
                usuario: user
            });
            await this.albumRepository.save(album);
            FileSystemService.saveFile({
                pathFile: 'albumes',
                name: name_file,
                file: imagen
            });
            return album;
        } catch (error) {
            FileSystemService.deleteFile({
                pathFile: 'generos',
                name: name_file
            });
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto): Promise<AlbumEntity[]> {
        try {
            const { limit, offset } = queryDto;
            if (limit && offset) return await this.albumRepository.find({ skip: offset, take: limit });
            if (limit) return await this.albumRepository.find({ take: limit });
            return await this.albumRepository.find();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<AlbumEntity> {
        try {
            return await this.albumRepository.findOne({ where: { id }, relations: ['usuario'] });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findManyBy(attribute: string, value: string): Promise<AlbumEntity[]> {
        try {
            return await this.albumRepository.find({ where: { [attribute]: value } });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async update(id: string, updateAlbumDto: UpdateAlbumDto, user_id: string, imagen?: Express.Multer.File): Promise<AlbumEntity> {
        try {
            const { nombre } = updateAlbumDto;
            const album = await this.findOne(id);
            if (album.usuario.id !== user_id) throw new UnauthorizedException('No tienes permiso para editar este album');
            if (nombre) {
                const slug = nombre.toLowerCase().replace(/ /g, '-');
                album.nombre = nombre;
                album.slug = slug;
            }
            if (imagen) {
                const extension = imagen.originalname.split('.').pop();
                const name_file = album.slug + '.' + extension;
                FileSystemService.deleteFile({ pathFile: 'albumes', name: album.imagen });
                album.imagen = name_file;
            }
            if (!imagen) return await this.albumRepository.save(album);
            FileSystemService.saveFile({
                pathFile: 'albumes',
                name: album.imagen,
                file: imagen
            });
            return album;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string): Promise<DeleteMessage> {
        try {
            const album = await this.findOne(id);
            const albumDeleted = await this.albumRepository.delete(album.id);
            if (albumDeleted.affected === 0) throw new Error('Album no eliminado');
            FileSystemService.deleteFile({ pathFile: 'albumes', name: album.imagen });
            return { message: 'Album eliminado', deleted: true, };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
