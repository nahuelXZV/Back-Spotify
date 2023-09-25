import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { GeneroEntity } from '../entities/genero.entity';
import { FileSystemService } from 'src/common/utils/fileSystem.utils';
import { VersionEntity } from '../entities/version.entity';
import { CancionesEntity } from '../entities/canciones.entity';

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

    public async create(cancion: Express.Multer.File, cancionesEntity: CancionesEntity): Promise<boolean> {
        try {
            const idiomas = ['en', 'pt', 'fr', 'it', 'de'];
            const letra = '....';
            this.createVersion({
                cancionFile: cancion,
                cancion: cancionesEntity,
                idioma: 'es',
                isBase: true,
                letra
            });

            // idiomas.forEach(async idioma => {
            //     const letraTraducida = '....';
            //     const cancionTraducida = cancion;
            //     await this.createVersion({
            //         cancionFile: cancionTraducida,
            //         cancion: cancionEntity,
            //         idioma: idioma,
            //         isBase: false,
            //         letra: letraTraducida
            //     });
            // });
            return true;
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
