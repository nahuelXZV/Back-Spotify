import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { RolesAccess } from 'src/auth/decorators';
import { SuscritoService } from '../services/suscrito.service';
import { CreateSuscritoDto } from '../dto/create-suscrito.dto';
import { SuscritoEntity } from '../entities/suscrito.entity';
import { UpdateSuscriptoDto } from '../dto/update-suscrito.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('suscrito')
export class SuscritoController {

    constructor(private readonly suscritoService: SuscritoService) { }

    @Post()
    create(@Body() createSuscritoDto: CreateSuscritoDto, @GetUser() user_id: string,): Promise<SuscritoEntity> {
        return this.suscritoService.create(createSuscritoDto, user_id);
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @Get()
    findAll(@Query() queryDto: QueryDto): Promise<SuscritoEntity[]> {
        return this.suscritoService.findAll(queryDto);
    }

    @Get('byUser')
    findByUser(@GetUser() usuario: string): Promise<SuscritoEntity[]> {
        return this.suscritoService.findByUser(usuario);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SuscritoEntity> {
        return this.suscritoService.findOne(id);
    }

    @RolesAccess('ADMIN')
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
        return this.suscritoService.remove(id);
    }
}
