import { PartialType } from '@nestjs/mapped-types';
import { CreateSuscritoDto } from './create-suscrito.dto';

export class UpdateSuscriptoDto extends PartialType(CreateSuscritoDto) { }
