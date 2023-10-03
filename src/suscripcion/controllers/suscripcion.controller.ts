import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { RolesAccess } from 'src/auth/decorators';
import { SuscripcionService } from '../services/suscripcion.service';
import { CreateSuscripcionDto } from '../dto/create-suscripcion.dto';
import { SuscripcionEntity } from '../entities/suscripcion.entity';
import { UpdateSuscripcionDto } from '../dto/update-suscripcion.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('suscripciones')
export class SuscripcionController {

    constructor(private readonly suscripcionService: SuscripcionService) { }

    @Post()
    create(@Body() createSuscripcionDto: CreateSuscripcionDto): Promise<SuscripcionEntity> {
        return this.suscripcionService.create(createSuscripcionDto);
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @Get()
    findAll(@Query() queryDto: QueryDto): Promise<SuscripcionEntity[]> {
        return this.suscripcionService.findAll(queryDto);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SuscripcionEntity> {
        return this.suscripcionService.findOne(id);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSuscripcionDto: UpdateSuscripcionDto): Promise<SuscripcionEntity> {
        return this.suscripcionService.update(id, updateSuscripcionDto);
    }

    @RolesAccess('ADMIN')
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
        return this.suscripcionService.remove(id);
    }
}
