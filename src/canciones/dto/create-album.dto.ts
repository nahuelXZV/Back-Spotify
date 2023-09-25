import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAlbumDto {

    @ApiProperty({
        example: 'Bailando con tu sombra',
        type: String,
        description: 'Nombre del album',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    
    @ApiProperty({
        type: Object,
        description: 'Imagen del album',
    })
    image: Express.Multer.File;
}