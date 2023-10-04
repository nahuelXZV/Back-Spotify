import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { SuscritoEntity } from '../entities/suscrito.entity';
import { CreateSuscritoDto } from '../dto/create-suscrito.dto';
import { UpdateSuscriptoDto } from '../dto/update-suscrito.dto';
import { UserService } from 'src/users/services/users.service';
import { SuscripcionService } from './suscripcion.service';

@Injectable()
export class SuscritoService {

    private readonly logger = new Logger('SuscritoService');
    private readonly relations: string[] = ['usuario', 'suscripcion'];

    constructor(
        @InjectRepository(SuscritoEntity)
        private readonly suscritoRepository: Repository<SuscritoEntity>,
        private readonly usuarioService: UserService,
        private readonly suscripcionesService: SuscripcionService
    ) { }

    public async create(createSuscritoDto: CreateSuscritoDto, user_id: string): Promise<SuscritoEntity> {
        try {
            const usuario = await this.usuarioService.findOne(user_id);
            const suscripcion = await this.suscripcionesService.findOne(createSuscritoDto.suscripcion);
            const duracion_dias = suscripcion.duracion;
            const fecha_inicio = new Date() + '';
            // sumar dias
            const fecha_final = new Date(new Date().getTime() + (duracion_dias * 24 * 60 * 60 * 1000)) + '';
            const estado = 'Activo';
            const suscrito = this.suscritoRepository.create({ fecha_inicio, fecha_final, estado, usuario, suscripcion });
            return await this.suscritoRepository.save(suscrito);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto): Promise<SuscritoEntity[]> {
        try {
            const { limit, offset } = queryDto;
            if (limit && offset) return await this.suscritoRepository.find({ skip: offset, take: limit, relations: this.relations });
            if (limit) return await this.suscritoRepository.find({ take: limit, relations: this.relations });
            return await this.suscritoRepository.find({ relations: this.relations });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<SuscritoEntity> {
        try {
            const suscrito = await this.suscritoRepository.findOne({ where: { id }, relations: this.relations });
            if (!suscrito) return null;
            return suscrito;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findByUser(usuario: string): Promise<SuscritoEntity[]> {
        try {
            const suscrito = await this.suscritoRepository.createQueryBuilder('suscrito')
                .innerJoinAndSelect('suscrito.usuario', 'usuario')
                .innerJoinAndSelect('suscrito.suscripcion', 'suscripcion')
                .where('usuario.id = :usuario', { usuario })
                .getMany();
            if (!suscrito) return null;
            return suscrito;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }


    public async remove(id: string): Promise<DeleteMessage> {
        try {
            const suscrito = await this.suscritoRepository.findOne({ where: { id } });
            const suscritoDeleted = await this.suscritoRepository.delete(suscrito.id);
            if (suscritoDeleted.affected === 0) throw new Error('No se pudo eliminar la suscripcion');
            return {
                message: 'Suscripcion Eliminado',
                deleted: true,
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
