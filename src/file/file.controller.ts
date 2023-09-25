import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Get(':pathfile/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('pathfile') pathfile: string,
    @Param('imageName') imageName: string
  ) {
    const pathFile = this.fileService.getStaticProductImage(pathfile, imageName);
    res.sendFile(pathFile);
  }
}
