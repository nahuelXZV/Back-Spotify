import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSuscripcionDto {

    @ApiProperty({
        example: 'Mensual',
        type: String,
        description: 'Nombre de la suscripcion',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        example: 'Suscripcion mensual',
        type: String,
        description: 'Descripcion de la suscripcion',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    descripcion: string;


    @ApiProperty({
        example: 100,
        type: Number,
        description: 'Precio de la suscripcion',
    })
    @IsNotEmpty()
    precio: number;

    @ApiProperty({
        example: 30,
        type: Number,
        description: 'Duracion de la suscripcion',
    })
    @IsNotEmpty()
    duracion: number;

    @ApiProperty({
        example: 'Activo',
        type: String,
        description: 'Estado de la suscripcion',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    estado: string;
}