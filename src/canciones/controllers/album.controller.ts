import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { RolesAccess } from 'src/auth/decorators';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto';
import { AlbumService } from '../services/album.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AlbumEntity } from '../entities/album.entity';

@ApiTags('Album')
@UseGuards(AuthGuard, RolesGuard)
@Controller('album')
export class AlbumController {

    constructor(private readonly albumService: AlbumService) { }

    @Post()
    @UseInterceptors(FileInterceptor('imagen'))
    create(
        @UploadedFile() imagen: Express.Multer.File,
        @Body() createAlbumDto: CreateAlbumDto,
        @GetUser() user_id: string
    ): Promise<AlbumEntity> {
        return this.albumService.create(createAlbumDto, user_id, imagen);
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @Get()
    findAll(@Query() queryDto: QueryDto): Promise<AlbumEntity[]> {
        return this.albumService.findAll(queryDto);
    }

    @ApiQuery({ name: 'attribute', type: 'string', required: true })
    @ApiQuery({ name: 'value', type: 'string', required: true })
    @Get('many/:attribute/:value')
    findManyBy(
        @Param('attribute', ParseUUIDPipe) attribute: string,
        @Param('value', ParseUUIDPipe) value: string
    ): Promise<AlbumEntity[]> {
        return this.albumService.findManyBy(attribute, value);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AlbumEntity> {
        return this.albumService.findOne(id);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    @UseInterceptors(FileInterceptor('imagen'))
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateAlbumDto: UpdateAlbumDto,
        @GetUser() user_id: string,
        @UploadedFile() imagen?: Express.Multer.File,
    ): Promise<AlbumEntity> {
        return this.albumService.update(id, updateAlbumDto, user_id, imagen);
    }

    @RolesAccess('ADMIN')
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
        return this.albumService.remove(id);
    }
}
