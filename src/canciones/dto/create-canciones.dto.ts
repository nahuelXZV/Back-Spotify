import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsMimeType, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

import { AlbumEntity } from "../entities/album.entity";
import { GeneroEntity } from "../entities/genero.entity";

export class CreateCancionesDto {

    @ApiProperty({
        example: '',
        type: 'file',
        description: 'Imagen de la cancion',
    })
    @IsNotEmpty()
    @IsMimeType()
    imagen: object;

    @ApiProperty({
        example: 'Cumbia de los trapos',
        type: String,
        description: 'Nombre de la cancion',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        example: 'true',
        type: Boolean,
        description: 'La cancion es privada?',
        nullable: true
    })
    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    isPrivado?: boolean;

    @ApiProperty({
        example: 'ef55cc42-1787-40d5-9857-91a8e15c693d',
        type: String,
        description: 'ID del genero',
    })
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    genero: GeneroEntity;

    @ApiProperty({
        example: 'ef55cc42-1787-40d5-9857-91a8e15c693d',
        type: String,
        description: 'ID del album',
        nullable: true
    })
    @IsString()
    @IsUUID()
    @IsOptional()
    album?: AlbumEntity;
}
