import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, ParseUUIDPipe, UseGuards, UploadedFiles } from '@nestjs/common';
import { CancionesService } from '../services/canciones.service';
import { CreateCancionesDto, UpdateCancionesDto } from '../dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CancionesEntity } from '../entities/canciones.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { RolesAccess } from 'src/auth/decorators';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ModifyUrlInterceptor } from '../interceptors/modify-url/modify-url.interceptor';
import { response } from 'express';

@ApiTags('Canciones')
@UseGuards(AuthGuard, RolesGuard)
@Controller('canciones')
export class CancionesController {
  constructor(private readonly cancionesService: CancionesService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'imagen', maxCount: 1 },
      { name: 'cancion', maxCount: 1 },]
    ))
  create(
    @UploadedFiles() files: { imagen: Express.Multer.File[], cancion: Express.Multer.File[] },
    @Body() createCancionesDto: CreateCancionesDto,
    @GetUser() user_id: string
  ): Promise<CancionesEntity> {
    return this.cancionesService.create(createCancionesDto, user_id, files.cancion[0], files.imagen[0]);
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @UseInterceptors(new ModifyUrlInterceptor('canciones'))
  @Get()
  findAll(@Query() queryDto: QueryDto): Promise<CancionesEntity[]> {
    const pathFile = 'canciones';
    const request = { pathFile };
    return this.cancionesService.findAll(queryDto);
  }

  @ApiQuery({ name: 'attribute', type: 'string', required: true })
  @ApiQuery({ name: 'value', type: 'string', required: true })
  @UseInterceptors(new ModifyUrlInterceptor('canciones'))
  @Get('by/:attribute/:value')
  findManyBy(
    @Param('attribute') attribute: string,
    @Param('value') value: string
  ): Promise<CancionesEntity[]> {
    return this.cancionesService.findManyBy(attribute, value);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(new ModifyUrlInterceptor('canciones'))
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CancionesEntity> {
    return this.cancionesService.findOne(id);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCancionesDto: UpdateCancionesDto,
    @GetUser() user_id: string,
    @UploadedFile() imagen?: Express.Multer.File,
  ): Promise<CancionesEntity> {
    return this.cancionesService.update(id, updateCancionesDto, user_id, imagen);
  }

  @RolesAccess('ADMIN')
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
    return this.cancionesService.remove(id);
  }
}
