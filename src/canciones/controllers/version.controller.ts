import { Controller, Delete, Get, Param, UseGuards, ParseUUIDPipe, UseInterceptors, Post, UploadedFile, Put, Patch } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { RolesAccess } from 'src/auth/decorators';
import { VersionService } from '../services/version.service';
import { VersionEntity } from '../entities/version.entity';
import { AddUrlInterceptor } from '../interceptors/addUrl/add-url.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { Idiomas } from 'src/common/constants/idiomas.constants';

@ApiTags('Version')
@UseGuards(AuthGuard, RolesGuard)
@Controller('version')
export class VersionController {

    constructor(private readonly versionService: VersionService) { }

    @ApiParam({ name: 'cancion', type: 'string' })
    @UseInterceptors(new AddUrlInterceptor('versiones'))
    @Get(':cancion/all')
    findAll(@Param('cancion', ParseUUIDPipe) cancion: string): Promise<VersionEntity[]> {
        return this.versionService.findAll(cancion);
    }

    @ApiParam({ name: 'cancion', type: 'string' })
    @ApiParam({ name: 'idioma', enum: Idiomas })
    @UseInterceptors(new AddUrlInterceptor('versiones'))
    @Get(':cancion/:idioma')
    findOne(@Param('cancion', ParseUUIDPipe) cancion: string, @Param('idioma') idioma: string): Promise<VersionEntity> {
        return this.versionService.findOne(cancion, idioma);
    }


    @ApiParam({ name: 'id', type: 'string' })
    @ApiParam({ name: 'estado', type: 'string' })
    @ApiBody({
        type: Object,
        description: 'Cancion file',
        required: true,
    })
    @UseInterceptors(FileInterceptor('cancion'))
    @Patch(':id/:estado')
    update(@UploadedFile() cancion: Express.Multer.File, @Param('id', ParseUUIDPipe) id?: string, @Param('estado') estado?: string) {
        return this.versionService.update(id, cancion, estado);
    }

    @RolesAccess('ADMIN')
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
        return this.versionService.remove(id);
    }
}
