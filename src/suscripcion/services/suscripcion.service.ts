import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { SuscripcionEntity } from '../entities/suscripcion.entity';
import { CreateSuscripcionDto } from '../dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from '../dto/update-suscripcion.dto';

@Injectable()
export class SuscripcionService {

  private readonly logger = new Logger('SuscripcionService');

  constructor(
    @InjectRepository(SuscripcionEntity)
    private readonly suscripcionRepository: Repository<SuscripcionEntity>,
  ) { }

  public async create(createSuscripcionDto: CreateSuscripcionDto): Promise<SuscripcionEntity> {
    try {
      const suscripcion = this.suscripcionRepository.create(createSuscripcionDto);
      return await this.suscripcionRepository.save(suscripcion);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<SuscripcionEntity[]> {
    try {
      const { limit, offset } = queryDto;
      if (limit && offset) return await this.suscripcionRepository.find({ skip: offset, take: limit });
      if (limit) return await this.suscripcionRepository.find({ take: limit });
      return await this.suscripcionRepository.find();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<SuscripcionEntity> {
    try {
      const suscripcion = await this.suscripcionRepository.findOne({ where: { id } });
      if (!suscripcion) return null;
      return suscripcion;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateSuscripcionDto: UpdateSuscripcionDto): Promise<SuscripcionEntity> {
    try {
      const suscripcion = await this.suscripcionRepository.findOne({ where: { id } });
      if (!suscripcion) return null;
      await this.suscripcionRepository.update(id, updateSuscripcionDto);
      return await this.suscripcionRepository.findOne({ where: { id } });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<DeleteMessage> {
    try {
      const suscripcion = await this.suscripcionRepository.findOne({ where: { id } });
      const suscripcionDeleted = await this.suscripcionRepository.delete(suscripcion.id);
      if (suscripcionDeleted.affected === 0) throw new Error('No se pudo eliminar la suscripcion');
      return {
        message: 'Suscripcion Eliminado',
        deleted: true,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
