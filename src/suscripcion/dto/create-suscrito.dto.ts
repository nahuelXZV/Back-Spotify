import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSuscritoDto {

    @ApiProperty({
        example: '625b25bd-4be0-410d-baae-74b5854608aa',
        type: String,
        description: 'ID de la suscripcion',
    })
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    suscripcion: string;
}