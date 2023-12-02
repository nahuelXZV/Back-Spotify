import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { FileSystemService } from 'src/common/utils/fileSystem.utils';
import { VersionEntity } from '../entities/version.entity';
import { CancionesEntity } from '../entities/canciones.entity';
import { Lyria, LyriaService } from 'src/common/utils/lyria.utils';
import { Idiomas } from 'src/common/constants/idiomas.constants';

export interface VersionCreateOptions {
    cancionFile: Express.Multer.File;
    cancion: CancionesEntity;
    idioma: string;
    isBase?: boolean;
    letra: string;
}

@Injectable()
export class VersionService {

    private readonly logger = new Logger('VersionService');

    constructor(
        @InjectRepository(VersionEntity)
        private readonly versionRepository: Repository<VersionEntity>,
        @InjectRepository(CancionesEntity)
        private readonly cancionesRepository: Repository<CancionesEntity>,
    ) { }

    public async create(cancion: Express.Multer.File, cancionesEntity: CancionesEntity, nameCancion: string, idioma: Idiomas): Promise<boolean> {
        try {
            const response: Lyria = await LyriaService.getCancion(nameCancion);
            const letra = response.letra[0];
            this.createVersion({
                cancionFile: cancion,
                cancion: cancionesEntity,
                idioma,
                isBase: true,
                letra
            });

            const listIdiomas = Object.values(Idiomas);
            listIdiomas.forEach(async idioma => {
                const letraTraducida = '....';  // aqui va la letra traducida con la IA, para luego ser reemplazada por la letra traducida
                const cancionTraducida = cancion; // aqui va la cancion traducida con la IA, para luego ser reemplazada por la cancion traducida
                await this.createVersion({
                    cancionFile: cancionTraducida,
                    cancion: cancionesEntity,
                    idioma: idioma,
                    isBase: false,
                    letra: letraTraducida
                });
            });
            return true;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    // actualizar la version
    public async update(id: string, cancion_final: Express.Multer.File): Promise<VersionEntity> {
        try {
            const version: VersionEntity = await this.versionRepository.findOneOrFail({ where: { id } });

            const nameCancion = cancion_final.originalname.split('.').shift().replace(/ /g, '_').toLowerCase();
            const extension = cancion_final.originalname.split('.').pop();
            const name_file = nameCancion + `_${version.idioma}` + '.' + extension;

            FileSystemService.deleteFile({ pathFile: 'versiones', name: version.nombre_cancion });
            FileSystemService.saveFile({
                pathFile: 'versiones',
                name: name_file,
                file: cancion_final
            });
            version.nombre_cancion = name_file;
            version.estado_traduccion = 'terminado';
            return await this.versionRepository.save(version);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }


    public async findAll(cancionId: string): Promise<VersionEntity[]> {
        try {
            const cancion = await this.cancionesRepository.findOne({ where: { id: cancionId } });
            return await this.versionRepository.createQueryBuilder('version')
                .leftJoinAndSelect('version.cancion', 'cancion')
                .where('cancion.id = :id', { id: cancion.id })
                .getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(cancionID: string, idioma: string): Promise<VersionEntity> {
        try {
            const cancion = await this.cancionesRepository.findOne({ where: { id: cancionID } });
            return await this.versionRepository.createQueryBuilder('version')
                .leftJoinAndSelect('version.cancion', 'cancion')
                .where('cancion.id = :id', { id: cancion.id })
                .andWhere('version.idioma = :idioma', { idioma })
                .getOne();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string): Promise<DeleteMessage> {
        try {
            const version = await this.versionRepository.findOneOrFail({ where: { id } });
            const versionDeleted = await this.versionRepository.delete(version.id);
            if (versionDeleted.affected === 0) throw new Error('Version no eliminado');
            FileSystemService.deleteFile({ pathFile: 'generos', name: version.nombre_cancion });
            return { message: 'Version eliminado', deleted: true, };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }


    private async createVersion(options: VersionCreateOptions): Promise<boolean> {
        const { cancionFile, cancion, idioma, isBase, letra } = options;
        const nameCancion = cancionFile.originalname.split('.').shift().replace(/ /g, '_').toLowerCase();
        const extension = cancionFile.originalname.split('.').pop();
        const name_file = nameCancion + `_${idioma}` + '.' + extension;
        try {
            const version = this.versionRepository.create({ letra, idioma, isBase, cancion, nombre_cancion: name_file });
            await this.versionRepository.save(version);

            FileSystemService.saveFile({
                pathFile: 'versiones',
                name: name_file,
                file: cancionFile
            });
            return true;
        } catch (error) {
            FileSystemService.deleteFile({
                pathFile: 'versiones',
                name: name_file
            });
            handlerError(error, this.logger);
        }


    }

}
