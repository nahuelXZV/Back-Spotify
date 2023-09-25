import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { RolesAccess } from 'src/auth/decorators';
import { GeneroService } from '../services/genero.service';
import { CreateGeneroDto, UpdateGeneroDto } from '../dto';
import { GeneroEntity } from '../entities/genero.entity';

@ApiTags('Genero')
@UseGuards(AuthGuard, RolesGuard)
@Controller('genero')
export class GeneroController {

    constructor(private readonly generoService: GeneroService) { }

    @Post()
    @UseInterceptors(FileInterceptor('imagen'))
    create(@UploadedFile() imagen: Express.Multer.File, @Body() createGeneroDto: CreateGeneroDto): Promise<GeneroEntity> {
        return this.generoService.create(createGeneroDto, imagen);
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @Get()
    findAll(@Query() queryDto: QueryDto): Promise<GeneroEntity[]> {
        return this.generoService.findAll(queryDto);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GeneroEntity> {
        return this.generoService.findOne(id);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    @UseInterceptors(FileInterceptor('imagen'))
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGeneroDto: UpdateGeneroDto, @UploadedFile() imagen?: Express.Multer.File): Promise<GeneroEntity> {
        return this.generoService.update(id, updateGeneroDto, imagen);
    }

    @RolesAccess('ADMIN')
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
        return this.generoService.remove(id);
    }
}
