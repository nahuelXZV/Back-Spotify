import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateGeneroDto, UpdateGeneroDto } from '../dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { GeneroEntity } from '../entities/genero.entity';
import { FileSystemService } from 'src/common/utils/fileSystem.utils';

@Injectable()
export class GeneroService {

    private readonly logger = new Logger('GeneroService');

    constructor(
        @InjectRepository(GeneroEntity)
        private readonly generoRepository: Repository<GeneroEntity>,
    ) { }

    public async create(createGeneroDto: CreateGeneroDto, imagen: Express.Multer.File): Promise<GeneroEntity> {
        const { nombre } = createGeneroDto;
        console.log(imagen);
        const extension = imagen.mimetype === 'image/png' ? 'png' : 'jpg';
        const slug = nombre.toLowerCase().replace(/ /g, '-');
        const name_file = slug + '.' + extension;
        try {
            const genero = this.generoRepository.create({
                imagen: name_file,
                nombre,
                slug
            });
            await this.generoRepository.save(genero);
            FileSystemService.saveFile({
                pathFile: 'generos',
                name: name_file,
                file: imagen
            });
            return genero;
        } catch (error) {
            FileSystemService.deleteFile({
                pathFile: 'generos',
                name: name_file
            });
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto): Promise<GeneroEntity[]> {
        try {
            const { limit, offset } = queryDto;
            if (limit && offset) return await this.generoRepository.find({ skip: offset, take: limit });
            if (limit) return await this.generoRepository.find({ take: limit });
            return await this.generoRepository.find();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<GeneroEntity> {
        try {
            return await this.generoRepository.findOneByOrFail({ id });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async update(id: string, updateGeneroDto: UpdateGeneroDto, imagen: Express.Multer.File): Promise<GeneroEntity> {
        try {
            const { nombre } = updateGeneroDto;
            const genero = await this.findOne(id);
            if (nombre) {
                const slug = nombre.toLowerCase().replace(/ /g, '-');
                genero.nombre = nombre;
                genero.slug = slug;
            }
            if (imagen) {
                const extension = imagen.originalname.split('.').pop();
                const name_file = genero.slug + '.' + extension;
                FileSystemService.deleteFile({ pathFile: 'generos', name: genero.imagen });
                genero.imagen = name_file;
            }
            if (!imagen) return await this.generoRepository.save(genero);
            FileSystemService.saveFile({
                pathFile: 'generos',
                name: genero.imagen,
                file: imagen
            });
            return genero;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string): Promise<DeleteMessage> {
        try {
            const genero = await this.findOne(id);
            const generoDeleted = await this.generoRepository.delete(genero.id);
            if (generoDeleted.affected === 0) throw new Error('Genero no eliminado');
            FileSystemService.deleteFile({ pathFile: 'generos', name: genero.imagen });
            return { message: 'Genero eliminado', deleted: true, };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

}
