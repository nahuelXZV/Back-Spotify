import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CancionesService } from '../services/canciones.service';
import { CreateCancionesDto, UpdateCancionesDto } from '../dto';

@Controller('canciones')
export class CancionesController {
  constructor(private readonly cancionesService: CancionesService) { }

  // @Post()
  // create(@Body() createCancionesDto: CreateCancionesDto) {
  //   return this.cancionesService.create(createCancionesDto);
  // }

  // @Get()
  // findAll() {
  //   return this.cancionesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cancionesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCancionesDto: UpdateCancionesDto) {
  //   return this.cancionesService.update(id, updateCancionesDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cancionesService.remove(id);
  // }
}
