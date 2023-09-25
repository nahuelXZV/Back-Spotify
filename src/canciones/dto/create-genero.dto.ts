import { IsMimeType, IsNotEmpty, IsObject, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGeneroDto {

    @ApiProperty({
        example: 'Cumbia',
        type: String,
        description: 'Nombre del genero',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        type: Object,
        description: 'Imagen del genero',
    })
    image: Express.Multer.File;
}