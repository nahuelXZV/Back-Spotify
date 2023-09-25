import { PartialType } from '@nestjs/swagger';
import { CreateCancionesDto } from './create-canciones.dto';

export class UpdateCancionesDto extends PartialType(CreateCancionesDto) {}
